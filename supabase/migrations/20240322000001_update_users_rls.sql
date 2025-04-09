-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read access for all users" ON public.users;

-- Create a policy that allows all authenticated users to read the users table
CREATE POLICY "Enable read access for all users"
ON public.users FOR SELECT
USING (true);

-- Create a policy that allows users to update their own records
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON public.users;
CREATE POLICY "Enable update for users based on user_id"
ON public.users FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Create a policy that allows users to insert their own records
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.users;
CREATE POLICY "Enable insert for authenticated users only"
ON public.users FOR INSERT
WITH CHECK (auth.uid() = id);
