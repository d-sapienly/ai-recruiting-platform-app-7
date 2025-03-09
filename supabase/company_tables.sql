-- COMPANY TABLES AND RLS POLICIES

-- Create storage bucket for company logos
INSERT INTO storage.buckets (id, name, public) VALUES ('company-logos-bucket', 'Company Logos', true);

-- Create policy to allow authenticated users to upload to the company logos bucket
CREATE POLICY "Allow authenticated users to upload company logos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'company-logos-bucket');

-- Create policy to allow public access to company logos
CREATE POLICY "Allow public access to company logos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'company-logos-bucket');

-- Create policy to allow company admins to update their company logos
CREATE POLICY "Allow company admins to update their company logos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'company-logos-bucket' AND
  (storage.foldername(name))[1] IN (
    SELECT id::text FROM companies c
    JOIN company_admins ca ON c.id = ca.company_id
    WHERE ca.user_id = auth.uid()
  )
);

-- Create policy to allow company admins to delete their company logos
CREATE POLICY "Allow company admins to delete their company logos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'company-logos-bucket' AND
  (storage.foldername(name))[1] IN (
    SELECT id::text FROM companies c
    JOIN company_admins ca ON c.id = ca.company_id
    WHERE ca.user_id = auth.uid()
  )
);

-- RLS POLICIES FOR COMPANIES TABLE

-- Enable RLS on companies table
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public to view companies
CREATE POLICY "Allow public to view companies"
ON public.companies FOR SELECT
TO public
USING (true);

-- Create policy to allow company admins to update their company
CREATE POLICY "Allow company admins to update their company"
ON public.companies FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM company_admins
    WHERE company_id = companies.id
    AND user_id = auth.uid()
  )
);

-- Create policy to allow company admins to delete their company
CREATE POLICY "Allow company admins to delete their company"
ON public.companies FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM company_admins
    WHERE company_id = companies.id
    AND user_id = auth.uid()
  )
);

-- Create policy to allow authenticated users to create companies
CREATE POLICY "Allow authenticated users to create companies"
ON public.companies FOR INSERT
TO authenticated
WITH CHECK (true);

-- RLS POLICIES FOR COMPANY_ADMINS TABLE

-- Enable RLS on company_admins table
ALTER TABLE public.company_admins ENABLE ROW LEVEL SECURITY;

-- Create policy to allow company admins to view their company admin records
CREATE POLICY "Allow company admins to view their company admin records"
ON public.company_admins FOR SELECT
TO authenticated
USING (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM company_admins
    WHERE company_id = company_admins.company_id
    AND user_id = auth.uid()
  )
);

-- Create policy to allow authenticated users to create company admin records
CREATE POLICY "Allow authenticated users to create company admin records"
ON public.company_admins FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM company_admins
    WHERE company_id = company_admins.company_id
    AND user_id = auth.uid()
  )
);

-- Create policy to allow company admins to update their company admin records
CREATE POLICY "Allow company admins to update their company admin records"
ON public.company_admins FOR UPDATE
TO authenticated
USING (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM company_admins
    WHERE company_id = company_admins.company_id
    AND user_id = auth.uid()
  )
);

-- Create policy to allow company admins to delete their company admin records
CREATE POLICY "Allow company admins to delete their company admin records"
ON public.company_admins FOR DELETE
TO authenticated
USING (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM company_admins
    WHERE company_id = company_admins.company_id
    AND user_id = auth.uid()
  )
);

-- FUNCTIONS AND TRIGGERS

-- Create function to check if user is a company admin
CREATE OR REPLACE FUNCTION public.is_company_admin(company_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM company_admins
    WHERE company_id = $1
    AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get company ID for current user
CREATE OR REPLACE FUNCTION public.get_user_company_id()
RETURNS uuid AS $$
DECLARE
  company_id uuid;
BEGIN
  SELECT ca.company_id INTO company_id
  FROM company_admins ca
  WHERE ca.user_id = auth.uid()
  LIMIT 1;
  
  RETURN company_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
