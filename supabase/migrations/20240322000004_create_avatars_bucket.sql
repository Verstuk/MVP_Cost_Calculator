-- Create avatars storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Set up public access policy for avatars
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Individual User Upload Access" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND (auth.uid() = SPLIT_PART(name, '/', 1)::uuid));

CREATE POLICY "Individual User Update Access" ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'avatars' AND (auth.uid() = SPLIT_PART(name, '/', 1)::uuid));

CREATE POLICY "Individual User Delete Access" ON storage.objects
  FOR DELETE
  USING (bucket_id = 'avatars' AND (auth.uid() = SPLIT_PART(name, '/', 1)::uuid));
