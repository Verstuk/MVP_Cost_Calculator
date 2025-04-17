-- Add cost_configuration column to users table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'users'
        AND column_name = 'cost_configuration'
    ) THEN
        ALTER TABLE users ADD COLUMN cost_configuration JSONB DEFAULT '{"developerRate": 8000, "designerRate": 7000, "projectManagerRate": 9000, "qaTesterRate": 6000}'::JSONB;
    END IF;
END
$$;

-- Enable realtime for the users table
alter publication supabase_realtime add table users;