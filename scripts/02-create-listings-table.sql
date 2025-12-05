-- Create listings table
CREATE TABLE IF NOT EXISTS public.listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC NOT NULL,
  address TEXT,
  city TEXT,
  type TEXT NOT NULL DEFAULT 'apartment' CHECK (type IN ('apartment', 'house', 'room', 'villa')),
  guests INTEGER,
  bedrooms INTEGER,
  bathrooms INTEGER,
  amenities JSONB DEFAULT '[]'::jsonb,
  images JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_listings_user_id ON public.listings(user_id);
CREATE INDEX IF NOT EXISTS idx_listings_city ON public.listings(city);
CREATE INDEX IF NOT EXISTS idx_listings_created_at ON public.listings(created_at DESC);

-- Enable RLS
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Authenticated users can read listings"
  ON public.listings FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Hosts can create listings"
  ON public.listings FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Hosts can update own listings"
  ON public.listings FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Hosts can delete own listings"
  ON public.listings FOR DELETE
  USING (user_id = auth.uid());
