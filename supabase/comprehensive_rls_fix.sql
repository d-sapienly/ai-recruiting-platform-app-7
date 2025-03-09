-- STEP 1: Temporarily disable RLS on company_admins to diagnose the issue
ALTER TABLE public.company_admins DISABLE ROW LEVEL SECURITY;

-- STEP 2: Drop all existing policies on company_admins
DROP POLICY IF EXISTS "Allow company admins to view their company admin records" ON public.company_admins;
DROP POLICY IF EXISTS "Allow authenticated users to create company admin records" ON public.company_admins;
DROP POLICY IF EXISTS "Allow users to create their own company admin records" ON public.company_admins;
DROP POLICY IF EXISTS "Allow company admins to update their company admin records" ON public.company_admins;
DROP POLICY IF EXISTS "Allow company admins to delete their company admin records" ON public.company_admins;

-- STEP 3: Create a simplified set of policies for company_admins

-- Policy for SELECT: Users can view admin records for companies they administer
CREATE POLICY "Allow users to view company admin records"
ON public.company_admins FOR SELECT
TO authenticated
USING (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM company_admins ca
    WHERE ca.company_id = company_admins.company_id
    AND ca.user_id = auth.uid()
  )
);

-- Policy for INSERT: Users can create admin records for themselves
CREATE POLICY "Allow users to create their own admin records"
ON public.company_admins FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Policy for UPDATE: Users can update admin records for companies they administer
CREATE POLICY "Allow users to update company admin records"
ON public.company_admins FOR UPDATE
TO authenticated
USING (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM company_admins ca
    WHERE ca.company_id = company_admins.company_id
    AND ca.user_id = auth.uid()
  )
);

-- Policy for DELETE: Users can delete admin records for companies they administer
CREATE POLICY "Allow users to delete company admin records"
ON public.company_admins FOR DELETE
TO authenticated
USING (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM company_admins ca
    WHERE ca.company_id = company_admins.company_id
    AND ca.user_id = auth.uid()
  )
);

-- STEP 4: Re-enable RLS on company_admins
ALTER TABLE public.company_admins ENABLE ROW LEVEL SECURITY;

-- STEP 5: Verify and fix companies table policies
DROP POLICY IF EXISTS "Allow authenticated users to create companies" ON public.companies;

CREATE POLICY "Allow authenticated users to create companies"
ON public.companies FOR INSERT
TO authenticated
WITH CHECK (true);

-- STEP 6: Create a function to log RLS errors for debugging
CREATE OR REPLACE FUNCTION log_rls_error(
  table_name text,
  operation text,
  error_message text,
  user_id uuid
) RETURNS void AS $$
BEGIN
  INSERT INTO public.rls_error_logs (
    table_name,
    operation,
    error_message,
    user_id,
    created_at
  ) VALUES (
    table_name,
    operation,
    error_message,
    user_id,
    now()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- STEP 7: Create error logging table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.rls_error_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  table_name TEXT NOT NULL,
  operation TEXT NOT NULL,
  error_message TEXT NOT NULL,
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Allow all authenticated users to insert into the error log
ALTER TABLE public.rls_error_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated users to insert error logs"
ON public.rls_error_logs FOR INSERT
TO authenticated
WITH CHECK (true);

-- Only allow admins to view error logs
CREATE POLICY "Allow admins to view error logs"
ON public.rls_error_logs FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin'
  )
);
