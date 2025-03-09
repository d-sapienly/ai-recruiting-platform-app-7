export interface User {
  id: string;
  email: string;
  role: 'jobseeker' | 'recruiter' | 'company_admin';
  name: string;
  avatar_url?: string;
}

export interface JobSeekerProfile {
  id: string;
  user_id: string;
  headline: string;
  years_of_experience: number;
  education_level: string;
  current_position: string;
  current_company: string;
  resume_url: string | null;
  is_actively_looking: boolean;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: string;
  company_id: string;
  title: string;
  description: string;
  requirements: string[];
  location: string;
  job_type: string;
  salary_min: number | null;
  salary_max: number | null;
  posted_at: string;
  deadline: string | null;
  status: string;
}

export interface Application {
  id: string;
  job_id: string;
  job_seeker_id: string;
  status: string;
  applied_at: string;
  cover_letter: string | null;
  match_score: number | null;
}

export interface Company {
  id: string;
  name: string;
  logo_url: string | null;
  website: string | null;
  industry: string;
  size: string;
  description: string;
  location: string;
}

export interface ParsedResume {
  headline?: string;
  currentPosition?: string;
  currentCompany?: string;
  yearsOfExperience?: number;
  educationLevel?: string;
  skills?: string[];
  education?: {
    degree: string;
    institution: string;
    year: number;
  }[];
  workExperience?: {
    title: string;
    company: string;
    duration: string;
    description: string;
  }[];
}
