-- USERS & AUTHENTICATION
-- Extends Supabase auth.users with profile information
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('jobseeker', 'recruiter', 'company_admin')),
  phone TEXT,
  location TEXT,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- COMPANIES
CREATE TABLE public.companies (
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

-- RLS Policies
CREATE POLICY "Companies are viewable by everyone" 
  ON public.companies FOR SELECT 
  USING (true);

-- COMPANY ADMINS
CREATE TABLE public.company_admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES public.companies(id) NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'editor')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(company_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE public.company_admins ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Company admins can manage their company" 
  ON public.companies FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.company_admins 
    WHERE company_id = public.companies.id AND user_id = auth.uid()
  ));

-- RECRUITERS
CREATE TABLE public.recruiters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  company_id UUID REFERENCES public.companies(id) NOT NULL,
  position TEXT NOT NULL,
  department TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, company_id)
);

-- Enable Row Level Security
ALTER TABLE public.recruiters ENABLE ROW LEVEL SECURITY;

-- JOB SEEKERS
CREATE TABLE public.job_seekers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  headline TEXT,
  years_of_experience INTEGER,
  education_level TEXT,
  current_position TEXT,
  current_company TEXT,
  resume_url TEXT,
  is_actively_looking BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.job_seekers ENABLE ROW LEVEL SECURITY;

-- SKILLS
CREATE TABLE public.skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- JOB SEEKER SKILLS
CREATE TABLE public.job_seeker_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_seeker_id UUID REFERENCES public.job_seekers(id) NOT NULL,
  skill_id UUID REFERENCES public.skills(id) NOT NULL,
  proficiency_level TEXT CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  years_of_experience INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(job_seeker_id, skill_id)
);

-- JOBS
CREATE TABLE public.jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES public.companies(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT,
  is_remote BOOLEAN DEFAULT false,
  job_type TEXT CHECK (job_type IN ('full-time', 'part-time', 'contract', 'internship', 'temporary')),
  experience_level TEXT CHECK (experience_level IN ('entry', 'mid', 'senior', 'executive')),
  salary_min INTEGER,
  salary_max INTEGER,
  salary_currency TEXT DEFAULT 'USD',
  benefits TEXT[],
  application_deadline DATE,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'closed')),
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Published jobs are viewable by everyone" 
  ON public.jobs FOR SELECT 
  USING (status = 'published');

CREATE POLICY "Company members can manage their jobs" 
  ON public.jobs FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.company_admins 
    WHERE company_id = public.jobs.company_id AND user_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM public.recruiters 
    WHERE company_id = public.jobs.company_id AND user_id = auth.uid()
  ));

-- JOB SKILLS
CREATE TABLE public.job_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES public.jobs(id) NOT NULL,
  skill_id UUID REFERENCES public.skills(id) NOT NULL,
  importance TEXT CHECK (importance IN ('required', 'preferred', 'bonus')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(job_id, skill_id)
);

-- APPLICATIONS
CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES public.jobs(id) NOT NULL,
  job_seeker_id UUID REFERENCES public.job_seekers(id) NOT NULL,
  resume_url TEXT NOT NULL,
  cover_letter TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'interview', 'rejected', 'accepted')),
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(job_id, job_seeker_id)
);

-- Enable Row Level Security
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
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

CREATE POLICY "Company members can view applications for their jobs" 
  ON public.applications FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.jobs 
    WHERE id = public.applications.job_id AND company_id IN (
      SELECT company_id FROM public.company_admins WHERE user_id = auth.uid()
      UNION
      SELECT company_id FROM public.recruiters WHERE user_id = auth.uid()
    )
  ));

CREATE POLICY "Company members can update applications for their jobs" 
  ON public.applications FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.jobs 
    WHERE id = public.applications.job_id AND company_id IN (
      SELECT company_id FROM public.company_admins WHERE user_id = auth.uid()
      UNION
      SELECT company_id FROM public.recruiters WHERE user_id = auth.uid()
    )
  ));

-- INTERVIEWS
CREATE TABLE public.interviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES public.applications(id) NOT NULL,
  recruiter_id UUID REFERENCES public.recruiters(id),
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER NOT NULL,
  location TEXT,
  is_virtual BOOLEAN DEFAULT true,
  meeting_link TEXT,
  notes TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'rescheduled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;

-- MESSAGES
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES auth.users(id) NOT NULL,
  recipient_id UUID REFERENCES auth.users(id) NOT NULL,
  related_job_id UUID REFERENCES public.jobs(id),
  related_application_id UUID REFERENCES public.applications(id),
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own messages" 
  ON public.messages FOR SELECT 
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can send messages" 
  ON public.messages FOR INSERT 
  WITH CHECK (auth.uid() = sender_id);

-- NOTIFICATIONS
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  related_entity_type TEXT,
  related_entity_id UUID,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own notifications" 
  ON public.notifications FOR SELECT 
  USING (auth.uid() = user_id);

-- AI MATCHING
-- Stores job seeker preferences for matching
CREATE TABLE public.job_seeker_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_seeker_id UUID REFERENCES public.job_seekers(id) NOT NULL,
  desired_job_titles TEXT[],
  desired_locations TEXT[],
  min_salary INTEGER,
  remote_preference TEXT CHECK (remote_preference IN ('remote-only', 'hybrid', 'on-site', 'no-preference')),
  job_types TEXT[] CHECK (job_types <@ ARRAY['full-time', 'part-time', 'contract', 'internship', 'temporary']),
  industries TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(job_seeker_id)
);

-- Stores AI-generated match scores
CREATE TABLE public.job_matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES public.jobs(id) NOT NULL,
  job_seeker_id UUID REFERENCES public.job_seekers(id) NOT NULL,
  match_score DECIMAL(5,2) NOT NULL CHECK (match_score >= 0 AND match_score <= 100),
  skill_match_score DECIMAL(5,2),
  experience_match_score DECIMAL(5,2),
  location_match_score DECIMAL(5,2),
  salary_match_score DECIMAL(5,2),
  is_viewed_by_job_seeker BOOLEAN DEFAULT false,
  is_viewed_by_recruiter BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(job_id, job_seeker_id)
);

-- Enable Row Level Security
ALTER TABLE public.job_matches ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Job seekers can view their own matches" 
  ON public.job_matches FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.job_seekers 
    WHERE id = public.job_matches.job_seeker_id AND user_id = auth.uid()
  ));

CREATE POLICY "Company members can view matches for their jobs" 
  ON public.job_matches FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.jobs 
    WHERE id = public.job_matches.job_id AND company_id IN (
      SELECT company_id FROM public.company_admins WHERE user_id = auth.uid()
      UNION
      SELECT company_id FROM public.recruiters WHERE user_id = auth.uid()
    )
  ));

-- SAVED JOBS
CREATE TABLE public.saved_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_seeker_id UUID REFERENCES public.job_seekers(id) NOT NULL,
  job_id UUID REFERENCES public.jobs(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(job_seeker_id, job_id)
);

-- Enable Row Level Security
ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Job seekers can manage their saved jobs" 
  ON public.saved_jobs FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.job_seekers 
    WHERE id = public.saved_jobs.job_seeker_id AND user_id = auth.uid()
  ));

-- SAVED CANDIDATES
CREATE TABLE public.saved_candidates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recruiter_id UUID REFERENCES public.recruiters(id) NOT NULL,
  job_seeker_id UUID REFERENCES public.job_seekers(id) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(recruiter_id, job_seeker_id)
);

-- Enable Row Level Security
ALTER TABLE public.saved_candidates ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Recruiters can manage their saved candidates" 
  ON public.saved_candidates FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.recruiters 
    WHERE id = public.saved_candidates.recruiter_id AND user_id = auth.uid()
  ));

-- Create functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updating timestamps
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_companies_updated_at
BEFORE UPDATE ON public.companies
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_seekers_updated_at
BEFORE UPDATE ON public.job_seekers
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at
BEFORE UPDATE ON public.jobs
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at
BEFORE UPDATE ON public.applications
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_interviews_updated_at
BEFORE UPDATE ON public.interviews
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_seeker_preferences_updated_at
BEFORE UPDATE ON public.job_seeker_preferences
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_matches_updated_at
BEFORE UPDATE ON public.job_matches
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_saved_candidates_updated_at
BEFORE UPDATE ON public.saved_candidates
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
