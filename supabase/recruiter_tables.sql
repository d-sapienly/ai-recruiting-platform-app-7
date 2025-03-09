-- Create recruiters table
CREATE TABLE IF NOT EXISTS public.recruiters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  company_id UUID REFERENCES public.companies(id),
  bio TEXT,
  years_of_experience INTEGER,
  specializations TEXT[],
  is_agency BOOLEAN DEFAULT false,
  position TEXT NOT NULL,
  department TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.recruiters ENABLE ROW LEVEL SECURITY;

-- RLS Policies for recruiters
CREATE POLICY "Recruiters can view their own profile" 
  ON public.recruiters FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Recruiters can update their own profile" 
  ON public.recruiters FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Recruiters can insert their own profile" 
  ON public.recruiters FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create saved_candidates table
CREATE TABLE IF NOT EXISTS public.saved_candidates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recruiter_id UUID REFERENCES public.recruiters(id) NOT NULL,
  job_seeker_id UUID REFERENCES public.job_seekers(id) NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'interviewing', 'hired', 'rejected')),
  match_score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(recruiter_id, job_seeker_id)
);

-- Enable Row Level Security
ALTER TABLE public.saved_candidates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for saved_candidates
CREATE POLICY "Recruiters can view their saved candidates" 
  ON public.saved_candidates FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.recruiters 
      WHERE id = public.saved_candidates.recruiter_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Recruiters can manage their saved candidates" 
  ON public.saved_candidates FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.recruiters 
      WHERE id = public.saved_candidates.recruiter_id 
      AND user_id = auth.uid()
    )
  );

-- Create recruiter_job_postings table to track which recruiter posted which job
CREATE TABLE IF NOT EXISTS public.recruiter_job_postings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recruiter_id UUID REFERENCES public.recruiters(id) NOT NULL,
  job_id UUID REFERENCES public.jobs(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(recruiter_id, job_id)
);

-- Enable Row Level Security
ALTER TABLE public.recruiter_job_postings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for recruiter_job_postings
CREATE POLICY "Recruiters can view their job postings" 
  ON public.recruiter_job_postings FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.recruiters 
      WHERE id = public.recruiter_job_postings.recruiter_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Recruiters can manage their job postings" 
  ON public.recruiter_job_postings FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.recruiters 
      WHERE id = public.recruiter_job_postings.recruiter_id 
      AND user_id = auth.uid()
    )
  );

-- Create recruiter_notifications table
CREATE TABLE IF NOT EXISTS public.recruiter_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recruiter_id UUID REFERENCES public.recruiters(id) NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  related_entity_type TEXT,
  related_entity_id UUID,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.recruiter_notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for recruiter_notifications
CREATE POLICY "Recruiters can view their notifications" 
  ON public.recruiter_notifications FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.recruiters 
      WHERE id = public.recruiter_notifications.recruiter_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Recruiters can update their notifications" 
  ON public.recruiter_notifications FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.recruiters 
      WHERE id = public.recruiter_notifications.recruiter_id 
      AND user_id = auth.uid()
    )
  );

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_recruiters_updated_at
BEFORE UPDATE ON public.recruiters
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_saved_candidates_updated_at
BEFORE UPDATE ON public.saved_candidates
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to notify recruiters of new applications
CREATE OR REPLACE FUNCTION notify_recruiter_of_new_application()
RETURNS TRIGGER AS $$
DECLARE
  job_company_id UUID;
  company_recruiters UUID[];
BEGIN
  -- Get the company ID for the job
  SELECT company_id INTO job_company_id
  FROM public.jobs
  WHERE id = NEW.job_id;
  
  -- Get all recruiters for this company
  SELECT array_agg(id) INTO company_recruiters
  FROM public.recruiters
  WHERE company_id = job_company_id;
  
  -- Create notifications for each recruiter
  IF array_length(company_recruiters, 1) > 0 THEN
    FOR i IN 1..array_length(company_recruiters, 1) LOOP
      INSERT INTO public.recruiter_notifications (
        recruiter_id,
        title,
        message,
        related_entity_type,
        related_entity_id
      ) VALUES (
        company_recruiters[i],
        'New Application',
        'A new application has been submitted',
        'application',
        NEW.id
      );
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new applications
CREATE TRIGGER on_new_application
AFTER INSERT ON public.job_applications
FOR EACH ROW EXECUTE FUNCTION notify_recruiter_of_new_application();
