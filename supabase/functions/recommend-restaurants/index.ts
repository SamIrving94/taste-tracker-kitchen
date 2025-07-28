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
    const { restaurantName, cuisineType, location, userPreferences } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Get user's visit history for better recommendations
    const authHeader = req.headers.get('authorization');
    let userHistory = '';
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      
      if (user) {
        const { data: visits } = await supabase
          .from('restaurant_visits')
          .select('restaurant_name, dish_name, rating')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);
        
        userHistory = visits ? visits.map(v => `${v.restaurant_name} (${v.dish_name}, rated ${v.rating}/5)`).join(', ') : '';
      }
    }

    const prompt = `Based on the restaurant "${restaurantName}" (${cuisineType} cuisine in ${location}), recommend 4-6 similar restaurants that someone would enjoy.

    ${userHistory ? `User's recent dining history: ${userHistory}` : ''}
    ${userPreferences ? `User preferences: ${userPreferences}` : ''}

    Return a JSON object with a "recommendations" array containing objects with:
    - name: Restaurant name
    - location: Area/neighborhood
    - address: Specific address
    - cuisine_type: Type of cuisine
    - rating: Rating out of 5 (realistic)
    - price_level: 1-4 (budget to upscale)
    - specialties: Array of signature dishes
    - atmosphere: Brief description
    - why_recommended: Why this matches their taste based on the reference restaurant
    - photo_url: A placeholder image URL

    Make recommendations feel authentic and well-matched to their dining preferences.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a knowledgeable local dining expert who gives personalized restaurant recommendations. Always return valid JSON.' },
          { role: 'user', content: prompt }
        ],
        response_format: { type: "json_object" }
      }),
    });

    const data = await response.json();
    const recommendations = JSON.parse(data.choices[0].message.content);

    return new Response(JSON.stringify(recommendations), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in recommend-restaurants function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});