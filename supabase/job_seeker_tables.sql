-- JOB SEEKERS TABLE
CREATE TABLE IF NOT EXISTS public.job_seekers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  headline TEXT,
  years_of_experience INTEGER,
  education_level TEXT,
  current_position TEXT,
  current_company TEXT,
  resume_url TEXT,
  is_actively_looking BOOLEAN DEFAULT true,
  skills TEXT[] DEFAULT '{}',
  preferred_job_types TEXT[] DEFAULT '{}',
  preferred_locations TEXT[] DEFAULT '{}',
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.job_seekers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for job_seekers
CREATE POLICY "Users can view their own job seeker profile" 
  ON public.job_seekers FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own job seeker profile" 
  ON public.job_seekers FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own job seeker profile" 
  ON public.job_seekers FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own job seeker profile" 
  ON public.job_seekers FOR DELETE 
  USING (auth.uid() = user_id);

-- Create trigger for updating timestamps
DROP TRIGGER IF EXISTS update_job_seekers_updated_at ON public.job_seekers;
CREATE TRIGGER update_job_seekers_updated_at
BEFORE UPDATE ON public.job_seekers
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- JOB APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES public.jobs(id) NOT NULL,
  job_seeker_id UUID REFERENCES public.job_seekers(id) NOT NULL,
  resume_url TEXT,
  cover_letter TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'interview', 'rejected', 'accepted')),
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(job_id, job_seeker_id)
);

-- Enable Row Level Security
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for applications
CREATE POLICY "Job seekers can view their own applications" 
  ON public.applications FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.job_seekers 
    WHERE id = public.applications.job_seeker_id AND user_id = auth.uid()
  ));

CREATE POLICY "Job seekers can create applications" 
  ON public.applications FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.job_seekers 
    WHERE id = public.applications.job_seeker_id AND user_id = auth.uid()
  ));

-- SAVED JOBS TABLE
CREATE TABLE IF NOT EXISTS public.saved_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_seeker_id UUID REFERENCES public.job_seekers(id) NOT NULL,
  job_id UUID REFERENCES public.jobs(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(job_seeker_id, job_id)
);

-- Enable Row Level Security
ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for saved_jobs
CREATE POLICY "Job seekers can manage their saved jobs" 
  ON public.saved_jobs FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.job_seekers 
    WHERE id = public.saved_jobs.job_seeker_id AND user_id = auth.uid()
  ));

-- Create a storage bucket for resumes if it doesn't exist
-- Note: This needs to be executed via the Supabase dashboard or API
-- as it's not a standard SQL command
