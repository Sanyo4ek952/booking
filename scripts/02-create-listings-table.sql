-- Create listings table
CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  address VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL, -- apartment, house, room, villa
  guests INTEGER NOT NULL,
  bedrooms INTEGER NOT NULL,
  bathrooms INTEGER NOT NULL,
  amenities TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_listings_host_id ON listings(host_id);
CREATE INDEX idx_listings_city ON listings(city);
CREATE INDEX idx_listings_created_at ON listings(created_at DESC);

-- Enable RLS
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Hosts can insert their own listings
CREATE POLICY "Hosts can create listings"
  ON listings FOR INSERT
  WITH CHECK (host_id = auth.uid());

-- RLS Policy: Hosts can update their own listings
CREATE POLICY "Hosts can update own listings"
  ON listings FOR UPDATE
  USING (host_id = auth.uid())
  WITH CHECK (host_id = auth.uid());

-- RLS Policy: Hosts can delete their own listings
CREATE POLICY "Hosts can delete own listings"
  ON listings FOR DELETE
  USING (host_id = auth.uid());

-- RLS Policy: Anyone can view listings
CREATE POLICY "Anyone can view listings"
  ON listings FOR SELECT
  USING (true);
