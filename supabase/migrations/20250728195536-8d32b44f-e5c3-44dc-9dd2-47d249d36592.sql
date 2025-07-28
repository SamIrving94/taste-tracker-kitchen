-- Fix RLS security issues by enabling RLS on existing tables
ALTER TABLE public.saved_recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cooking_attempts ENABLE ROW LEVEL SECURITY;

-- Fix function search path security issue
CREATE OR REPLACE FUNCTION public.update_restaurants_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;