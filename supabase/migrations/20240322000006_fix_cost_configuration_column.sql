-- Add cost_configuration column to users table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'cost_configuration') THEN
        ALTER TABLE public.users ADD COLUMN cost_configuration JSONB DEFAULT NULL;
    END IF;
END $$;
