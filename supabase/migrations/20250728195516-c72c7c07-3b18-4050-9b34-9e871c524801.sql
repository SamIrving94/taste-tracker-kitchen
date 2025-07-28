-- Create restaurants table for storing restaurant data
CREATE TABLE public.restaurants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  address TEXT,
  place_id TEXT UNIQUE, -- Google Places ID for consistency
  rating NUMERIC,
  price_level INTEGER,
  photo_url TEXT,
  cuisine_type TEXT,
  phone TEXT,
  website TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Update restaurant_visits to reference the restaurants table
ALTER TABLE public.restaurant_visits 
ADD COLUMN restaurant_id UUID REFERENCES public.restaurants(id);

-- Create index for better performance
CREATE INDEX idx_restaurants_place_id ON public.restaurants(place_id);
CREATE INDEX idx_restaurants_name ON public.restaurants(name);
CREATE INDEX idx_restaurant_visits_restaurant_id ON public.restaurant_visits(restaurant_id);

-- Enable RLS on restaurants table
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;

-- Create policies for restaurants (public read, authenticated write)
CREATE POLICY "Anyone can view restaurants" 
ON public.restaurants 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can insert restaurants" 
ON public.restaurants 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update restaurants" 
ON public.restaurants 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_restaurants_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_restaurants_updated_at
BEFORE UPDATE ON public.restaurants
FOR EACH ROW
EXECUTE FUNCTION public.update_restaurants_updated_at();