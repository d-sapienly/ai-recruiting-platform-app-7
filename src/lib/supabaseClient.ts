import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = 'https://vmqesuskwemmbazcvugt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtcWVzdXNrd2VtbWJhemN2dWd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzNzczNDgsImV4cCI6MjA1Njk1MzM0OH0.uF5WheGwWlnwSQEjM8Z25PlcrjcdXJvSD0c6fN4hsYs';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Authentication functions
export const signInWithEmail = async (email: string, password: string) => {
  console.log(`Attempting to sign in with email: ${email}`);
  const result = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  console.log("Sign in result:", result);
  return result;
};

export const signUpWithEmail = async (email: string, password: string, userData: any = {}) => {
  console.log(`Attempting to sign up with email: ${email} and user data:`, userData);
  const result = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData,
    },
  });
  
  console.log("Sign up result:", result);
  return result;
};

export const signOut = async () => {
  console.log("Signing out user");
  return supabase.auth.signOut();
};

export const resetPassword = async (email: string) => {
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
};

export const updatePassword = async (newPassword: string) => {
  return supabase.auth.updateUser({
    password: newPassword,
  });
};

// Helper function to update user password with current password verification
export const updateUserPassword = async (currentPassword: string, newPassword: string) => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user || !user.email) {
      throw new Error('User not authenticated or email not available');
    }
    
    // Verify current password by attempting to sign in
    const { error: signInError } = await signInWithEmail(user.email, currentPassword);
    
    if (signInError) {
      throw new Error('Current password is incorrect');
    }
    
    // Update to new password
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    });
    
    if (error) {
      throw error;
    }
    
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error };
  }
};

// Helper function to update user profile data
export const updateUserProfile = async (userData: any) => {
  return supabase.auth.updateUser({
    data: userData
  });
};

// Helper function to get the current user
export const getCurrentUser = async () => {
  console.log("Getting current user");
  const result = await supabase.auth.getUser();
  console.log("Current user result:", result);
  return result;
};

// Helper function to create a job seeker profile
export const createJobSeekerProfile = async (profileData: any) => {
  console.log("Creating job seeker profile with data:", profileData);
  const result = await supabase
    .from('job_seekers')
    .insert([profileData])
    .select()
    .single();
  
  console.log("Create job seeker profile result:", result);
  return result;
};

// Helper function to update a job seeker profile
export const updateJobSeekerProfile = async (profileData: any) => {
  console.log("Updating job seeker profile with data:", profileData);
  const result = await supabase
    .from('job_seekers')
    .update(profileData)
    .eq('id', profileData.id)
    .select()
    .single();
  
  console.log("Update job seeker profile result:", result);
  return result;
};

// Helper function to get a job seeker profile by user ID
export const getJobSeekerProfile = async (userId: string) => {
  console.log(`Getting job seeker profile for user ID: ${userId}`);
  const result = await supabase
    .from('job_seekers')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  console.log("Get job seeker profile result:", result);
  return result;
};

// Helper function to check if job seeker profile exists
export const checkJobSeekerProfileExists = async (userId: string) => {
  console.log(`Checking if job seeker profile exists for user ID: ${userId}`);
  const { data, error } = await supabase
    .from('job_seekers')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();
  
  console.log("Check job seeker profile exists result:", { exists: !!data, error });
  return { exists: !!data, error };
};

// Helper function to create a company
export const createCompany = async (companyData: any) => {
  try {
    // First, create the company
    const { data: companyData, error: companyError } = await supabase
      .from('companies')
      .insert([companyData])
      .select()
      .single();
    
    if (companyError) {
      console.error('Error creating company:', companyError);
      return { data: null, error: companyError };
    }
    
    return { data: companyData, error: null };
  } catch (error) {
    console.error('Unexpected error creating company:', error);
    return { data: null, error };
  }
};

// Helper function to create a company admin
export const createCompanyAdmin = async (adminData: any) => {
  try {
    // Create the company admin record
    const { data, error } = await supabase
      .from('company_admins')
      .insert([adminData])
      .select()
      .single();
    
    if (error) {
      // Log the error for debugging
      await supabase.rpc('log_rls_error', {
        table_name: 'company_admins',
        operation: 'INSERT',
        error_message: error.message,
        user_id: adminData.user_id
      }).catch(e => console.error('Error logging RLS error:', e));
      
      console.error('Error creating company admin:', error);
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error creating company admin:', error);
    return { data: null, error };
  }
};

// Helper function to get company by ID
export const getCompanyById = async (companyId: string) => {
  return supabase
    .from('companies')
    .select('*')
    .eq('id', companyId)
    .single();
};

// Helper function to get company by admin user ID
export const getCompanyByUserId = async (userId: string) => {
  const { data, error } = await supabase
    .from('company_admins')
    .select('company_id')
    .eq('user_id', userId)
    .single();
  
  if (error || !data) {
    return { data: null, error: error || new Error('No company found for this user') };
  }
  
  return getCompanyById(data.company_id);
};

// Helper function to update company
export const updateCompany = async (companyId: string, updateData: any) => {
  return supabase
    .from('companies')
    .update(updateData)
    .eq('id', companyId)
    .select()
    .single();
};

// Helper function to delete company
export const deleteCompany = async (companyId: string) => {
  return supabase
    .from('companies')
    .delete()
    .eq('id', companyId);
};

// Helper function to get all company admins for a company
export const getCompanyAdmins = async (companyId: string) => {
  return supabase
    .from('company_admins')
    .select('*, profiles:user_id(*)')
    .eq('company_id', companyId);
};

// Helper function to add a company admin
export const addCompanyAdmin = async (companyId: string, userId: string, role: string = 'admin') => {
  return supabase
    .from('company_admins')
    .insert([
      { company_id: companyId, user_id: userId, role }
    ])
    .select()
    .single();
};

// Helper function to remove a company admin
export const removeCompanyAdmin = async (companyId: string, userId: string) => {
  return supabase
    .from('company_admins')
    .delete()
    .eq('company_id', companyId)
    .eq('user_id', userId);
};

// Helper function to check if user is a company admin
export const isCompanyAdmin = async (userId: string, companyId: string) => {
  const { data, error } = await supabase
    .from('company_admins')
    .select('*')
    .eq('company_id', companyId)
    .eq('user_id', userId)
    .single();
  
  return { isAdmin: !!data && !error, data, error };
};

// Recruiter functions
// Helper function to create a recruiter profile
export const createRecruiterProfile = async (profileData: any) => {
  console.log("Creating recruiter profile with data:", profileData);
  const result = await supabase
    .from('recruiters')
    .insert([profileData])
    .select()
    .single();
  
  console.log("Create recruiter profile result:", result);
  return result;
};

// Helper function to update a recruiter profile
export const updateRecruiterProfile = async (profileData: any) => {
  console.log("Updating recruiter profile with data:", profileData);
  const result = await supabase
    .from('recruiters')
    .update(profileData)
    .eq('id', profileData.id)
    .select()
    .single();
  
  console.log("Update recruiter profile result:", result);
  return result;
};

// Helper function to get a recruiter profile by user ID
export const getRecruiterProfile = async (userId: string) => {
  console.log(`Getting recruiter profile for user ID: ${userId}`);
  const result = await supabase
    .from('recruiters')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  console.log("Get recruiter profile result:", result);
  return result;
};

// Helper function to get a recruiter's company
export const getRecruiterCompany = async (companyId: string) => {
  console.log(`Getting company for ID: ${companyId}`);
  const result = await supabase
    .from('companies')
    .select('*')
    .eq('id', companyId)
    .single();
  
  console.log("Get recruiter company result:", result);
  return result;
};

// Helper function to get all companies
export const getCompanies = async () => {
  console.log("Getting all companies");
  const result = await supabase
    .from('companies')
    .select('*')
    .order('name', { ascending: true });
  
  console.log("Get companies result:", result);
  return result;
};

// Helper function to get a recruiter's candidates
export const getRecruiterCandidates = async (recruiterId: string) => {
  console.log(`Getting candidates for recruiter ID: ${recruiterId}`);
  const result = await supabase
    .from('saved_candidates')
    .select(`
      *,
      job_seeker:job_seeker_id(*)
    `)
    .eq('recruiter_id', recruiterId);
  
  console.log("Get recruiter candidates result:", result);
  return result;
};

// Helper function to get a recruiter's jobs
export const getRecruiterJobs = async (recruiterId: string) => {
  console.log(`Getting jobs for recruiter ID: ${recruiterId}`);
  // First get the recruiter to find their company
  const { data: recruiter, error: recruiterError } = await supabase
    .from('recruiters')
    .select('company_id')
    .eq('id', recruiterId)
    .single();
  
  if (recruiterError || !recruiter?.company_id) {
    console.error("Error getting recruiter company:", recruiterError);
    return { data: [], error: recruiterError || new Error('No company found for this recruiter') };
  }
  
  // Then get jobs for that company
  const result = await supabase
    .from('jobs')
    .select(`
      *,
      applications:job_applications(count)
    `)
    .eq('company_id', recruiter.company_id);
  
  // Process the results to add application count
  const processedData = result.data?.map(job => ({
    ...job,
    application_count: job.applications?.[0]?.count || 0
  }));
  
  console.log("Get recruiter jobs result:", { ...result, data: processedData });
  return { ...result, data: processedData };
};

// Helper function to get a recruiter's applications
export const getRecruiterApplications = async (recruiterId: string) => {
  console.log(`Getting applications for recruiter ID: ${recruiterId}`);
  // First get the recruiter to find their company
  const { data: recruiter, error: recruiterError } = await supabase
    .from('recruiters')
    .select('company_id')
    .eq('id', recruiterId)
    .single();
  
  if (recruiterError || !recruiter?.company_id) {
    console.error("Error getting recruiter company:", recruiterError);
    return { data: [], error: recruiterError || new Error('No company found for this recruiter') };
  }
  
  // Then get applications for jobs at that company
  const result = await supabase
    .from('job_applications')
    .select(`
      *,
      job:job_id(title, company_id),
      job_seeker:job_seeker_id(*)
    `)
    .eq('job.company_id', recruiter.company_id);
  
  // Process the results to add job title and candidate name
  const processedData = result.data?.map(app => ({
    ...app,
    job_title: app.job?.title,
    candidate_name: app.job_seeker?.full_name || 'Unknown Candidate',
    candidate_email: app.job_seeker?.email
  }));
  
  console.log("Get recruiter applications result:", { ...result, data: processedData });
  return { ...result, data: processedData || [] };
};

// Helper function to set up real-time subscription for applications
export const subscribeToApplications = (recruiterId: string, callback: (payload: any) => void) => {
  console.log(`Setting up subscription for recruiter ID: ${recruiterId}`);
  
  const channel = supabase
    .channel('recruiter-applications')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'job_applications'
      },
      (payload) => {
        console.log('New application received:', payload);
        callback(payload);
      }
    )
    .subscribe();
  
  console.log("Subscription set up:", channel);
  return channel;
};

// Helper function to create a job posting
export const createJob = async (jobData: any) => {
  console.log("Creating job with data:", jobData);
  
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Format the job data according to the schema
    // Let the database handle created_at and updated_at timestamps
    const formattedJobData = {
      title: jobData.title,
      description: jobData.description,
      location: jobData.location,
      job_type: jobData.type,
      salary_min: jobData.salary_min,
      salary_max: jobData.salary_max,
      status: jobData.status,
      company_id: jobData.company_id,
      posted_at: new Date().toISOString(),
      requirements: jobData.requirements ? [jobData.requirements] : null
    };
    
    // Insert the job into the jobs table
    const { data, error } = await supabase
      .from('jobs')
      .insert([formattedJobData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating job:', error);
      return { data: null, error };
    }
    
    console.log("Job created successfully:", data);
    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error creating job:', error);
    return { data: null, error };
  }
};

// Helper function to update a job posting
export const updateJob = async (jobId: string, jobData: any) => {
  console.log(`Updating job ${jobId} with data:`, jobData);
  
  try {
    // Format the job data according to the schema
    // Let the database handle the updated_at timestamp
    const formattedJobData = {
      title: jobData.title,
      description: jobData.description,
      location: jobData.location,
      job_type: jobData.type,
      salary_min: jobData.salary_min,
      salary_max: jobData.salary_max,
      status: jobData.status,
      requirements: jobData.requirements ? [jobData.requirements] : null
    };
    
    // Update the job in the jobs table
    const { data, error } = await supabase
      .from('jobs')
      .update(formattedJobData)
      .eq('id', jobId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating job:', error);
      return { data: null, error };
    }
    
    console.log("Job updated successfully:", data);
    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error updating job:', error);
    return { data: null, error };
  }
};

// Helper function to get jobs for a company
export const getCompanyJobs = async (companyId: string) => {
  console.log(`Getting jobs for company ID: ${companyId}`);
  
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error getting company jobs:', error);
      return { data: null, error };
    }
    
    console.log("Company jobs retrieved successfully:", data);
    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error getting company jobs:', error);
    return { data: null, error };
  }
};

// Helper function to delete a job
export const deleteJob = async (jobId: string) => {
  console.log(`Deleting job with ID: ${jobId}`);
  
  try {
    const { data, error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', jobId);
    
    if (error) {
      console.error('Error deleting job:', error);
      return { error };
    }
    
    console.log("Job deleted successfully");
    return { error: null };
  } catch (error) {
    console.error('Unexpected error deleting job:', error);
    return { error };
  }
};
