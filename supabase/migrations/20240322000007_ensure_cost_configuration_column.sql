-- Ensure cost_configuration column exists in users table with proper default value
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS cost_configuration JSONB DEFAULT '{"developerRate": 8000, "designerRate": 7000, "projectManagerRate": 9000, "qaTesterRate": 6000}'::JSONB;

-- Enable realtime for the users table if not already enabled
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'users'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
  END IF;
END $$;