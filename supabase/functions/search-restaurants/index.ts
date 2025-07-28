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
    const { query, location } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // First check if we have existing restaurants matching the query
    const { data: existingRestaurants } = await supabase
      .from('restaurants')
      .select('*')
      .or(`name.ilike.%${query}%,location.ilike.%${location || query}%`)
      .limit(5);

    // If we have good matches, return them
    if (existingRestaurants && existingRestaurants.length > 0) {
      return new Response(JSON.stringify({ restaurants: existingRestaurants }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Otherwise, use OpenAI to generate realistic restaurant suggestions
    const prompt = `Generate 3-5 realistic restaurant suggestions for the query "${query}" ${location ? `in ${location}` : ''}. 
    Return a JSON array with objects containing: name, location, address, cuisine_type, rating (1-5), price_level (1-4), description.
    Make them feel authentic and real, with specific addresses and believable details.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a helpful restaurant discovery assistant. Always return valid JSON.' },
          { role: 'user', content: prompt }
        ],
        response_format: { type: "json_object" }
      }),
    });

    const data = await response.json();
    const aiSuggestions = JSON.parse(data.choices[0].message.content);

    return new Response(JSON.stringify({ restaurants: aiSuggestions.restaurants || [] }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in search-restaurants function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
