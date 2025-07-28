import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.53.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, location, latitude, longitude } = await req.json();
    const googleApiKey = Deno.env.get('GOOGLE_PLACES_API_KEY');

    if (!googleApiKey) {
      throw new Error('Google Places API key not configured');
    }

    console.log('Searching for restaurants:', { query, location, latitude, longitude });

    // First, try to find existing restaurants in our database
    let existingRestaurants = [];
    if (query.length > 2) {
      const { data } = await supabase
        .from('restaurants')
        .select('*')
        .or(`name.ilike.%${query}%,location.ilike.%${query}%`)
        .limit(3);
      
      existingRestaurants = data || [];
    }

    // Use Google Places Text Search for broader results
    let searchQuery = query;
    if (location) {
      searchQuery += ` restaurants in ${location}`;
    } else if (latitude && longitude) {
      searchQuery += ` restaurants`;
    } else {
      searchQuery += ' restaurants';
    }

    const placesUrl = new URL('https://maps.googleapis.com/maps/api/place/textsearch/json');
    placesUrl.searchParams.set('query', searchQuery);
    placesUrl.searchParams.set('type', 'restaurant');
    placesUrl.searchParams.set('key', googleApiKey);
    
    if (latitude && longitude) {
      placesUrl.searchParams.set('location', `${latitude},${longitude}`);
      placesUrl.searchParams.set('radius', '5000'); // 5km radius
    }

    console.log('Google Places API URL:', placesUrl.toString().replace(googleApiKey, 'HIDDEN'));

    const response = await fetch(placesUrl.toString());
    const data = await response.json();

    console.log('Google Places API response status:', data.status);

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('Google Places API error:', data);
      throw new Error(`Google Places API error: ${data.status}`);
    }

    // Transform Google Places results to our format
    const googleRestaurants = (data.results || []).slice(0, 5).map((place: any) => ({
      place_id: place.place_id,
      name: place.name,
      location: place.formatted_address || place.vicinity || 'Unknown location',
      address: place.formatted_address,
      cuisine_type: place.types?.find((type: string) => 
        ['restaurant', 'food', 'meal_takeaway', 'meal_delivery'].includes(type)
      ) || 'Restaurant',
      rating: place.rating,
      price_level: place.price_level,
      photo_url: place.photos?.[0] ? 
        `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${googleApiKey}` : 
        null,
      latitude: place.geometry?.location?.lat,
      longitude: place.geometry?.location?.lng,
      google_data: {
        place_id: place.place_id,
        types: place.types,
        user_ratings_total: place.user_ratings_total,
        opening_hours: place.opening_hours,
        plus_code: place.plus_code
      }
    }));

    // Combine existing and Google results, prioritizing existing ones
    const allRestaurants = [...existingRestaurants, ...googleRestaurants];
    
    // Remove duplicates based on name similarity
    const uniqueRestaurants = allRestaurants.filter((restaurant, index, self) => 
      index === self.findIndex(r => 
        r.name.toLowerCase() === restaurant.name.toLowerCase() ||
        r.place_id === restaurant.place_id
      )
    ).slice(0, 8);

    console.log(`Returning ${uniqueRestaurants.length} restaurants`);

    return new Response(JSON.stringify({ 
      restaurants: uniqueRestaurants,
      source: 'google_places',
      query_used: searchQuery
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in google-places-search function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      restaurants: [] 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});