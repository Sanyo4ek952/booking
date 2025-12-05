-- Create public bucket for listing images
INSERT INTO storage.buckets (id, name, public)
VALUES ('listing-images', 'listing-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to read objects from the bucket
CREATE POLICY IF NOT EXISTS "Public read for listing images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'listing-images');

-- Allow authenticated users to upload to the bucket
CREATE POLICY IF NOT EXISTS "Authenticated upload for listing images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'listing-images' AND auth.role() = 'authenticated');
