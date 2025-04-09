CREATE TABLE IF NOT EXISTS cost_reports (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  project_name TEXT NOT NULL,
  project_description TEXT,
  industry_type TEXT,
  project_type TEXT,
  features JSONB,
  custom_features JSONB,
  technologies JSONB,
  team_composition JSONB,
  timeline JSONB,
  estimated_cost INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

alter publication supabase_realtime add table cost_reports;
