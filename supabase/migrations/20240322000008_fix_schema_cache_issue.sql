-- Fix schema cache issue with cost_configuration column
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS cost_configuration JSONB DEFAULT '{"developerRate": 8000, "designerRate": 7000, "projectManagerRate": 9000, "qaTesterRate": 6000}'::JSONB;
COMMENT ON COLUMN public.users.cost_configuration IS 'User cost configuration settings';
ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
-- Force refresh schema cache
NOTIFY pgrst, 'reload schema';
