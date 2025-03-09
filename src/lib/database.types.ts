export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      companies: {
        Row: {
          created_at: string
          description: string | null
          id: string
          industry: string | null
          location: string | null
          logo_url: string | null
          name: string
          size: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          industry?: string | null
          location?: string | null
          logo_url?: string | null
          name: string
          size?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          industry?: string | null
          location?: string | null
          logo_url?: string | null
          name?: string
          size?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      company_admins: {
        Row: {
          company_id: string
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_admins_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_admins_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      job_applications: {
        Row: {
          applied_at: string
          cover_letter: string | null
          created_at: string
          id: string
          job_id: string
          job_seeker_id: string
          match_score: number | null
          status: string
          updated_at: string
        }
        Insert: {
          applied_at?: string
          cover_letter?: string | null
          created_at?: string
          id?: string
          job_id: string
          job_seeker_id: string
          match_score?: number | null
          status?: string
          updated_at?: string
        }
        Update: {
          applied_at?: string
          cover_letter?: string | null
          created_at?: string
          id?: string
          job_id?: string
          job_seeker_id?: string
          match_score?: number | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_applications_job_seeker_id_fkey"
            columns: ["job_seeker_id"]
            isOneToOne: false
            referencedRelation: "job_seekers"
            referencedColumns: ["id"]
          }
        ]
      }
      job_seekers: {
        Row: {
          bio: string | null
          created_at: string
          current_company: string | null
          current_position: string | null
          education_level: string | null
          headline: string | null
          id: string
          is_actively_looking: boolean
          preferred_job_types: string[] | null
          preferred_locations: string[] | null
          resume_url: string | null
          skills: string[] | null
          updated_at: string
          user_id: string
          years_of_experience: number | null
        }
        Insert: {
          bio?: string | null
          created_at?: string
          current_company?: string | null
          current_position?: string | null
          education_level?: string | null
          headline?: string | null
          id?: string
          is_actively_looking?: boolean
          preferred_job_types?: string[] | null
          preferred_locations?: string[] | null
          resume_url?: string | null
          skills?: string[] | null
          updated_at?: string
          user_id: string
          years_of_experience?: number | null
        }
        Update: {
          bio?: string | null
          created_at?: string
          current_company?: string | null
          current_position?: string | null
          education_level?: string | null
          headline?: string | null
          id?: string
          is_actively_looking?: boolean
          preferred_job_types?: string[] | null
          preferred_locations?: string[] | null
          resume_url?: string | null
          skills?: string[] | null
          updated_at?: string
          user_id?: string
          years_of_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "job_seekers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      jobs: {
        Row: {
          company_id: string
          created_at: string
          deadline: string | null
          description: string
          id: string
          job_type: string
          location: string
          posted_at: string
          requirements: string[] | null
          salary_max: number | null
          salary_min: number | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          deadline?: string | null
          description: string
          id?: string
          job_type: string
          location: string
          posted_at?: string
          requirements?: string[] | null
          salary_max?: number | null
          salary_min?: number | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          deadline?: string | null
          description?: string
          id?: string
          job_type?: string
          location?: string
          posted_at?: string
          requirements?: string[] | null
          salary_max?: number | null
          salary_min?: number | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "jobs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          role: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          role?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      recruiters: {
        Row: {
          bio: string | null
          company_id: string | null
          created_at: string
          id: string
          is_agency: boolean
          specializations: string[] | null
          updated_at: string
          user_id: string
          years_of_experience: number | null
        }
        Insert: {
          bio?: string | null
          company_id?: string | null
          created_at?: string
          id?: string
          is_agency?: boolean
          specializations?: string[] | null
          updated_at?: string
          user_id: string
          years_of_experience?: number | null
        }
        Update: {
          bio?: string | null
          company_id?: string | null
          created_at?: string
          id?: string
          is_agency?: boolean
          specializations?: string[] | null
          updated_at?: string
          user_id?: string
          years_of_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "recruiters_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recruiters_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
