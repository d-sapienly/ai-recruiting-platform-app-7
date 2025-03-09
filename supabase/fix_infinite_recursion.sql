-- STEP 1: Drop all existing policies on company_admins to start fresh
DROP POLICY IF EXISTS "Allow company admins to view their company admin records" ON public.company_admins;
DROP POLICY IF EXISTS "Allow authenticated users to create company admin records" ON public.company_admins;
DROP POLICY IF EXISTS "Allow users to create their own company admin records" ON public.company_admins;
DROP POLICY IF EXISTS "Allow users to create their own admin records" ON public.company_admins;
DROP POLICY IF EXISTS "Allow company admins to update their company admin records" ON public.company_admins;
DROP POLICY IF EXISTS "Allow users to update company admin records" ON public.company_admins;
DROP POLICY IF EXISTS "Allow company admins to delete their company admin records" ON public.company_admins;
DROP POLICY IF EXISTS "Allow users to delete company admin records" ON public.company_admins;
DROP POLICY IF EXISTS "Allow users to view company admin records" ON public.company_admins;

-- STEP 2: Temporarily disable RLS on company_admins to ensure we can create new policies
ALTER TABLE public.company_admins DISABLE ROW LEVEL SECURITY;

-- STEP 3: Create a security definer function to safely check admin status without recursion
CREATE OR REPLACE FUNCTION check_user_is_admin_for_company(company_id uuid, user_id uuid)
RETURNS boolean AS $$
BEGIN
  -- Direct query to the table without going through RLS
  RETURN EXISTS (
    SELECT 1 FROM public.company_admins
    WHERE company_id = $1 AND user_id = $2
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- STEP 4: Create new non-recursive policies

-- Policy for SELECT: Users can view admin records they are associated with
CREATE POLICY "view_company_admin_records"
ON public.company_admins FOR SELECT
TO authenticated
USING (
  -- User can see their own records
  user_id = auth.uid() OR
  -- Or records for companies they administer (using our safe function)
  check_user_is_admin_for_company(company_id, auth.uid())
);

-- Policy for INSERT: Users can only create admin records for themselves
CREATE POLICY "insert_own_admin_record"
ON public.company_admins FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid()
);

-- Policy for UPDATE: Users can update admin records for companies they administer
CREATE POLICY "update_company_admin_records"
ON public.company_admins FOR UPDATE
TO authenticated
USING (
  -- User can update their own records
  user_id = auth.uid() OR
  -- Or records for companies they administer (using our safe function)
  check_user_is_admin_for_company(company_id, auth.uid())
);

-- Policy for DELETE: Users can delete admin records for companies they administer
CREATE POLICY "delete_company_admin_records"
ON public.company_admins FOR DELETE
TO authenticated
USING (
  -- User can delete their own records
  user_id = auth.uid() OR
  -- Or records for companies they administer (using our safe function)
  check_user_is_admin_for_company(company_id, auth.uid())
);

-- STEP 5: Create a bypass function for initial company admin creation
CREATE OR REPLACE FUNCTION create_initial_company_admin(
  p_company_id UUID,
  p_user_id UUID,
  p_role TEXT DEFAULT 'admin'
)
RETURNS VOID
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO company_admins (company_id, user_id, role)
  VALUES (p_company_id, p_user_id, p_role);
END;
$$ LANGUAGE plpgsql;

-- STEP 6: Re-enable RLS on company_admins
ALTER TABLE public.company_admins ENABLE ROW LEVEL SECURITY;

-- STEP 7: Create a trigger to automatically add the creator as admin when a company is created
CREATE OR REPLACE FUNCTION add_company_creator_as_admin()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM create_initial_company_admin(NEW.id, auth.uid());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS add_company_creator_as_admin_trigger ON public.companies;

-- Create the trigger
CREATE TRIGGER add_company_creator_as_admin_trigger
AFTER INSERT ON public.companies
FOR EACH ROW
EXECUTE FUNCTION add_company_creator_as_admin();
