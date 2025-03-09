-- Create companies table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  industry TEXT,
  size TEXT CHECK (size IN ('1-10', '11-50', '51-200', '201-500', '501-1000', '1000+')),
  founded_year INTEGER,
  website TEXT,
  logo_url TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Create company_admins table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.company_admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES public.companies(id) NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'editor')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(company_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE public.company_admins ENABLE ROW LEVEL SECURITY;

-- Create trigger for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for companies table if it doesn't exist
DROP TRIGGER IF EXISTS update_companies_updated_at ON public.companies;
CREATE TRIGGER update_companies_updated_at
BEFORE UPDATE ON public.companies
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Basic RLS policies for companies table

-- Create policy to allow public to view companies
CREATE POLICY IF NOT EXISTS "Allow public to view companies"
ON public.companies FOR SELECT
TO public
USING (true);

-- Create policy to allow company admins to update their company
CREATE POLICY IF NOT EXISTS "Allow company admins to update their company"
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
CREATE POLICY IF NOT EXISTS "Allow company admins to delete their company"
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
CREATE POLICY IF NOT EXISTS "Allow authenticated users to create companies"
ON public.companies FOR INSERT
TO authenticated
WITH CHECK (true);

-- Basic RLS policies for company_admins table

-- Create policy to allow company admins to view their company admin records
CREATE POLICY IF NOT EXISTS "Allow company admins to view their company admin records"
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
CREATE POLICY IF NOT EXISTS "Allow authenticated users to create company admin records"
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
CREATE POLICY IF NOT EXISTS "Allow company admins to update their company admin records"
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
CREATE POLICY IF NOT EXISTS "Allow company admins to delete their company admin records"
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
