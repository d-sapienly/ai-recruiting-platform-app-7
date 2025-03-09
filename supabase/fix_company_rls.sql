-- Drop the problematic policy for company_admins
DROP POLICY IF EXISTS "Allow authenticated users to create company admin records" ON public.company_admins;

-- Create a better policy that allows users to create their own admin record
CREATE POLICY "Allow users to create their own company admin records"
ON public.company_admins FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Make sure the companies insert policy is correct
DROP POLICY IF EXISTS "Allow authenticated users to create companies" ON public.companies;

CREATE POLICY "Allow authenticated users to create companies"
ON public.companies FOR INSERT
TO authenticated
WITH CHECK (true);

-- Create a function to check if a user is the first admin for a company
CREATE OR REPLACE FUNCTION is_first_company_admin(company_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 FROM company_admins
    WHERE company_id = $1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to check if a user owns a company
CREATE OR REPLACE FUNCTION user_owns_company(company_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM companies c
    WHERE c.id = $1 AND 
    EXISTS (
      SELECT 1 FROM company_admins ca
      WHERE ca.company_id = c.id AND ca.user_id = auth.uid()
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
