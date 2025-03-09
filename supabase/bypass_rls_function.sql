-- Create a function to safely create a company admin record without triggering duplicate key errors
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
  -- Check if the record already exists to avoid duplicate key errors
  IF NOT EXISTS (
    SELECT 1 FROM company_admins 
    WHERE company_id = p_company_id AND user_id = p_user_id
  ) THEN
    INSERT INTO company_admins (company_id, user_id, role)
    VALUES (p_company_id, p_user_id, p_role);
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Drop the existing trigger that might be causing duplicate inserts
DROP TRIGGER IF EXISTS add_company_creator_as_admin_trigger ON public.companies;
