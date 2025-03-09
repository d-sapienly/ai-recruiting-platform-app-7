import React from 'react';

const DatabaseDiagram: React.FC = () => {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Database Schema Diagram</h2>
      <div className="overflow-auto">
        <svg width="1000" height="800" viewBox="0 0 1000 800" className="border border-gray-200 rounded">
          {/* Users & Authentication */}
          <g transform="translate(50, 50)">
            <rect width="180" height="120" fill="#e6f7ff" stroke="#1890ff" strokeWidth="2" rx="4" />
            <text x="90" y="25" textAnchor="middle" fontWeight="bold">profiles</text>
            <line x1="30" y1="35" x2="150" y2="35" stroke="#1890ff" strokeWidth="1" />
            <text x="10" y="55" fontSize="12">id (PK, FK to auth.users)</text>
            <text x="10" y="75" fontSize="12">email, full_name, role</text>
            <text x="10" y="95" fontSize="12">phone, location, bio</text>
            <text x="10" y="115" fontSize="12">avatar_url, timestamps</text>
          </g>

          {/* Companies */}
          <g transform="translate(300, 50)">
            <rect width="180" height="120" fill="#f6ffed" stroke="#52c41a" strokeWidth="2" rx="4" />
            <text x="90" y="25" textAnchor="middle" fontWeight="bold">companies</text>
            <line x1="30" y1="35" x2="150" y2="35" stroke="#52c41a" strokeWidth="1" />
            <text x="10" y="55" fontSize="12">id (PK)</text>
            <text x="10" y="75" fontSize="12">name, description</text>
            <text x="10" y="95" fontSize="12">industry, size, location</text>
            <text x="10" y="115" fontSize="12">logo_url, timestamps</text>
          </g>

          {/* Company Admins */}
          <g transform="translate(300, 200)">
            <rect width="180" height="100" fill="#f6ffed" stroke="#52c41a" strokeWidth="2" rx="4" />
            <text x="90" y="25" textAnchor="middle" fontWeight="bold">company_admins</text>
            <line x1="30" y1="35" x2="150" y2="35" stroke="#52c41a" strokeWidth="1" />
            <text x="10" y="55" fontSize="12">id (PK)</text>
            <text x="10" y="75" fontSize="12">company_id (FK)</text>
            <text x="10" y="95" fontSize="12">user_id (FK), role</text>
          </g>

          {/* Recruiters */}
          <g transform="translate(50, 200)">
            <rect width="180" height="100" fill="#fff2e8" stroke="#fa8c16" strokeWidth="2" rx="4" />
            <text x="90" y="25" textAnchor="middle" fontWeight="bold">recruiters</text>
            <line x1="30" y1="35" x2="150" y2="35" stroke="#fa8c16" strokeWidth="1" />
            <text x="10" y="55" fontSize="12">id (PK)</text>
            <text x="10" y="75" fontSize="12">user_id (FK), company_id (FK)</text>
            <text x="10" y="95" fontSize="12">position, department</text>
          </g>

          {/* Job Seekers */}
          <g transform="translate(50, 330)">
            <rect width="180" height="120" fill="#f9f0ff" stroke="#722ed1" strokeWidth="2" rx="4" />
            <text x="90" y="25" textAnchor="middle" fontWeight="bold">job_seekers</text>
            <line x1="30" y1="35" x2="150" y2="35" stroke="#722ed1" strokeWidth="1" />
            <text x="10" y="55" fontSize="12">id (PK)</text>
            <text x="10" y="75" fontSize="12">user_id (FK)</text>
            <text x="10" y="95" fontSize="12">headline, experience</text>
            <text x="10" y="115" fontSize="12">resume_url, is_active</text>
          </g>

          {/* Skills */}
          <g transform="translate(300, 330)">
            <rect width="180" height="80" fill="#f9f0ff" stroke="#722ed1" strokeWidth="2" rx="4" />
            <text x="90" y="25" textAnchor="middle" fontWeight="bold">skills</text>
            <line x1="30" y1="35" x2="150" y2="35" stroke="#722ed1" strokeWidth="1" />
            <text x="10" y="55" fontSize="12">id (PK)</text>
            <text x="10" y="75" fontSize="12">name, category</text>
          </g>

          {/* Job Seeker Skills */}
          <g transform="translate(300, 440)">
            <rect width="180" height="100" fill="#f9f0ff" stroke="#722ed1" strokeWidth="2" rx="4" />
            <text x="90" y="25" textAnchor="middle" fontWeight="bold">job_seeker_skills</text>
            <line x1="30" y1="35" x2="150" y2="35" stroke="#722ed1" strokeWidth="1" />
            <text x="10" y="55" fontSize="12">id (PK)</text>
            <text x="10" y="75" fontSize="12">job_seeker_id (FK)</text>
            <text x="10" y="95" fontSize="12">skill_id (FK), proficiency</text>
          </g>

          {/* Jobs */}
          <g transform="translate(550, 50)">
            <rect width="180" height="140" fill="#fff2e8" stroke="#fa8c16" strokeWidth="2" rx="4" />
            <text x="90" y="25" textAnchor="middle" fontWeight="bold">jobs</text>
            <line x1="30" y1="35" x2="150" y2="35" stroke="#fa8c16" strokeWidth="1" />
            <text x="10" y="55" fontSize="12">id (PK)</text>
            <text x="10" y="75" fontSize="12">company_id (FK)</text>
            <text x="10" y="95" fontSize="12">title, description</text>
            <text x="10" y="115" fontSize="12">location, salary, type</text>
            <text x="10" y="135" fontSize="12">status, created_by (FK)</text>
          </g>

          {/* Job Skills */}
          <g transform="translate(550, 220)">
            <rect width="180" height="100" fill="#fff2e8" stroke="#fa8c16" strokeWidth="2" rx="4" />
            <text x="90" y="25" textAnchor="middle" fontWeight="bold">job_skills</text>
            <line x1="30" y1="35" x2="150" y2="35" stroke="#fa8c16" strokeWidth="1" />
            <text x="10" y="55" fontSize="12">id (PK)</text>
            <text x="10" y="75" fontSize="12">job_id (FK)</text>
            <text x="10" y="95" fontSize="12">skill_id (FK), importance</text>
          </g>

          {/* Applications */}
          <g transform="translate(550, 350)">
            <rect width="180" height="120" fill="#fff1f0" stroke="#f5222d" strokeWidth="2" rx="4" />
            <text x="90" y="25" textAnchor="middle" fontWeight="bold">applications</text>
            <line x1="30" y1="35" x2="150" y2="35" stroke="#f5222d" strokeWidth="1" />
            <text x="10" y="55" fontSize="12">id (PK)</text>
            <text x="10" y="75" fontSize="12">job_id (FK)</text>
            <text x="10" y="95" fontSize="12">job_seeker_id (FK)</text>
            <text x="10" y="115" fontSize="12">status, resume_url</text>
          </g>

          {/* Interviews */}
          <g transform="translate(550, 500)">
            <rect width="180" height="120" fill="#fff1f0" stroke="#f5222d" strokeWidth="2" rx="4" />
            <text x="90" y="25" textAnchor="middle" fontWeight="bold">interviews</text>
            <line x1="30" y1="35" x2="150" y2="35" stroke="#f5222d" strokeWidth="1" />
            <text x="10" y="55" fontSize="12">id (PK)</text>
            <text x="10" y="75" fontSize="12">application_id (FK)</text>
            <text x="10" y="95" fontSize="12">recruiter_id (FK)</text>
            <text x="10" y="115" fontSize="12">scheduled_at, status</text>
          </g>

          {/* Messages */}
          <g transform="translate(800, 50)">
            <rect width="180" height="120" fill="#f0f5ff" stroke="#2f54eb" strokeWidth="2" rx="4" />
            <text x="90" y="25" textAnchor="middle" fontWeight="bold">messages</text>
            <line x1="30" y1="35" x2="150" y2="35" stroke="#2f54eb" strokeWidth="1" />
            <text x="10" y="55" fontSize="12">id (PK)</text>
            <text x="10" y="75" fontSize="12">sender_id (FK)</text>
            <text x="10" y="95" fontSize="12">recipient_id (FK)</text>
            <text x="10" y="115" fontSize="12">content, is_read</text>
          </g>

          {/* Notifications */}
          <g transform="translate(800, 200)">
            <rect width="180" height="120" fill="#f0f5ff" stroke="#2f54eb" strokeWidth="2" rx="4" />
            <text x="90" y="25" textAnchor="middle" fontWeight="bold">notifications</text>
            <line x1="30" y1="35" x2="150" y2="35" stroke="#2f54eb" strokeWidth="1" />
            <text x="10" y="55" fontSize="12">id (PK)</text>
            <text x="10" y="75" fontSize="12">user_id (FK)</text>
            <text x="10" y="95" fontSize="12">type, title, message</text>
            <text x="10" y="115" fontSize="12">related_entity, is_read</text>
          </g>

          {/* AI Matching */}
          <g transform="translate(800, 350)">
            <rect width="180" height="140" fill="#fcffe6" stroke="#a0d911" strokeWidth="2" rx="4" />
            <text x="90" y="25" textAnchor="middle" fontWeight="bold">job_matches</text>
            <line x1="30" y1="35" x2="150" y2="35" stroke="#a0d911" strokeWidth="1" />
            <text x="10" y="55" fontSize="12">id (PK)</text>
            <text x="10" y="75" fontSize="12">job_id (FK)</text>
            <text x="10" y="95" fontSize="12">job_seeker_id (FK)</text>
            <text x="10" y="115" fontSize="12">match_score</text>
            <text x="10" y="135" fontSize="12">component scores</text>
          </g>

          {/* Job Seeker Preferences */}
          <g transform="translate(800, 520)">
            <rect width="180" height="120" fill="#fcffe6" stroke="#a0d911" strokeWidth="2" rx="4" />
            <text x="90" y="25" textAnchor="middle" fontWeight="bold">job_seeker_preferences</text>
            <line x1="30" y1="35" x2="150" y2="35" stroke="#a0d911" strokeWidth="1" />
            <text x="10" y="55" fontSize="12">id (PK)</text>
            <text x="10" y="75" fontSize="12">job_seeker_id (FK)</text>
            <text x="10" y="95" fontSize="12">desired_titles, locations</text>
            <text x="10" y="115" fontSize="12">salary, remote, job_types</text>
          </g>

          {/* Saved Items */}
          <g transform="translate(50, 480)">
            <rect width="180" height="80" fill="#fff0f6" stroke="#eb2f96" strokeWidth="2" rx="4" />
            <text x="90" y="25" textAnchor="middle" fontWeight="bold">saved_jobs</text>
            <line x1="30" y1="35" x2="150" y2="35" stroke="#eb2f96" strokeWidth="1" />
            <text x="10" y="55" fontSize="12">job_seeker_id (FK)</text>
            <text x="10" y="75" fontSize="12">job_id (FK)</text>
          </g>

          <g transform="translate(50, 590)">
            <rect width="180" height="100" fill="#fff0f6" stroke="#eb2f96" strokeWidth="2" rx="4" />
            <text x="90" y="25" textAnchor="middle" fontWeight="bold">saved_candidates</text>
            <line x1="30" y1="35" x2="150" y2="35" stroke="#eb2f96" strokeWidth="1" />
            <text x="10" y="55" fontSize="12">recruiter_id (FK)</text>
            <text x="10" y="75" fontSize="12">job_seeker_id (FK)</text>
            <text x="10" y="95" fontSize="12">notes</text>
          </g>

          {/* Relationships */}
          {/* Profiles to Job Seekers */}
          <path d="M 140,170 L 140,330" stroke="#722ed1" strokeWidth="1.5" fill="none" strokeDasharray="5,5" />
          <circle cx="140" cy="170" r="3" fill="#722ed1" />
          <circle cx="140" cy="330" r="3" fill="#722ed1" />

          {/* Profiles to Recruiters */}
          <path d="M 120,170 L 120,200" stroke="#fa8c16" strokeWidth="1.5" fill="none" strokeDasharray="5,5" />
          <circle cx="120" cy="170" r="3" fill="#fa8c16" />
          <circle cx="120" cy="200" r="3" fill="#fa8c16" />

          {/* Companies to Jobs */}
          <path d="M 480,110 L 550,110" stroke="#fa8c16" strokeWidth="1.5" fill="none" />
          <circle cx="480" cy="110" r="3" fill="#fa8c16" />
          <circle cx="550" cy="110" r="3" fill="#fa8c16" />

          {/* Companies to Recruiters */}
          <path d="M 300,110 L 230,220" stroke="#fa8c16" strokeWidth="1.5" fill="none" />
          <circle cx="300" cy="110" r="3" fill="#fa8c16" />
          <circle cx="230" cy="220" r="3" fill="#fa8c16" />

          {/* Companies to Company Admins */}
          <path d="M 390,170 L 390,200" stroke="#52c41a" strokeWidth="1.5" fill="none" />
          <circle cx="390" cy="170" r="3" fill="#52c41a" />
          <circle cx="390" cy="200" r="3" fill="#52c41a" />

          {/* Jobs to Applications */}
          <path d="M 640,190 L 640,350" stroke="#f5222d" strokeWidth="1.5" fill="none" />
          <circle cx="640" cy="190" r="3" fill="#f5222d" />
          <circle cx="640" cy="350" r="3" fill="#f5222d" />

          {/* Jobs to Job Skills */}
          <path d="M 620,190 L 620,220" stroke="#fa8c16" strokeWidth="1.5" fill="none" />
          <circle cx="620" cy="190" r="3" fill="#fa8c16" />
          <circle cx="620" cy="220" r="3" fill="#fa8c16" />

          {/* Skills to Job Skills */}
          <path d="M 480,370 L 550,270" stroke="#fa8c16" strokeWidth="1.5" fill="none" />
          <circle cx="480" cy="370" r="3" fill="#fa8c16" />
          <circle cx="550" cy="270" r="3" fill="#fa8c16" />

          {/* Skills to Job Seeker Skills */}
          <path d="M 390,410 L 390,440" stroke="#722ed1" strokeWidth="1.5" fill="none" />
          <circle cx="390" cy="410" r="3" fill="#722ed1" />
          <circle cx="390" cy="440" r="3" fill="#722ed1" />

          {/* Job Seekers to Job Seeker Skills */}
          <path d="M 230,390 L 300,490" stroke="#722ed1" strokeWidth="1.5" fill="none" />
          <circle cx="230" cy="390" r="3" fill="#722ed1" />
          <circle cx="300" cy="490" r="3" fill="#722ed1" />

          {/* Job Seekers to Applications */}
          <path d="M 230,390 L 550,410" stroke="#f5222d" strokeWidth="1.5" fill="none" />
          <circle cx="230" cy="390" r="3" fill="#f5222d" />
          <circle cx="550" cy="410" r="3" fill="#f5222d" />

          {/* Applications to Interviews */}
          <path d="M 640,470 L 640,500" stroke="#f5222d" strokeWidth="1.5" fill="none" />
          <circle cx="640" cy="470" r="3" fill="#f5222d" />
          <circle cx="640" cy="500" r="3" fill="#f5222d" />

          {/* Recruiters to Interviews */}
          <path d="M 230,300 L 550,540" stroke="#f5222d" strokeWidth="1.5" fill="none" />
          <circle cx="230" cy="300" r="3" fill="#f5222d" />
          <circle cx="550" cy="540" r="3" fill="#f5222d" />

          {/* Job Seekers to Job Matches */}
          <path d="M 230,390 L 800,420" stroke="#a0d911" strokeWidth="1.5" fill="none" />
          <circle cx="230" cy="390" r="3" fill="#a0d911" />
          <circle cx="800" cy="420" r="3" fill="#a0d911" />

          {/* Jobs to Job Matches */}
          <path d="M 730,120 L 800,380" stroke="#a0d911" strokeWidth="1.5" fill="none" />
          <circle cx="730" cy="120" r="3" fill="#a0d911" />
          <circle cx="800" cy="380" r="3" fill="#a0d911" />

          {/* Job Seekers to Job Seeker Preferences */}
          <path d="M 230,450 L 800,560" stroke="#a0d911" strokeWidth="1.5" fill="none" />
          <circle cx="230" cy="450" r="3" fill="#a0d911" />
          <circle cx="800" cy="560" r="3" fill="#a0d911" />

          {/* Job Seekers to Saved Jobs */}
          <path d="M 140,450 L 140,480" stroke="#eb2f96" strokeWidth="1.5" fill="none" />
          <circle cx="140" cy="450" r="3" fill="#eb2f96" />
          <circle cx="140" cy="480" r="3" fill="#eb2f96" />

          {/* Jobs to Saved Jobs */}
          <path d="M 550,120 L 230,500" stroke="#eb2f96" strokeWidth="1.5" fill="none" />
          <circle cx="550" cy="120" r="3" fill="#eb2f96" />
          <circle cx="230" cy="500" r="3" fill="#eb2f96" />

          {/* Recruiters to Saved Candidates */}
          <path d="M 140,300 L 140,590" stroke="#eb2f96" strokeWidth="1.5" fill="none" />
          <circle cx="140" cy="300" r="3" fill="#eb2f96" />
          <circle cx="140" cy="590" r="3" fill="#eb2f96" />

          {/* Job Seekers to Saved Candidates */}
          <path d="M 100,450 L 100,590" stroke="#eb2f96" strokeWidth="1.5" fill="none" />
          <circle cx="100" cy="450" r="3" fill="#eb2f96" />
          <circle cx="100" cy="590" r="3" fill="#eb2f96" />
        </svg>
      </div>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Core Tables</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li><span className="font-medium">profiles</span> - User profiles linked to Supabase auth</li>
            <li><span className="font-medium">companies</span> - Company information</li>
            <li><span className="font-medium">jobs</span> - Job listings with details</li>
            <li><span className="font-medium">job_seekers</span> - Job seeker profiles</li>
            <li><span className="font-medium">recruiters</span> - Recruiter profiles</li>
            <li><span className="font-medium">applications</span> - Job applications</li>
          </ul>
        </div>
        
        <div className="p-4 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">AI Matching System</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li><span className="font-medium">job_matches</span> - AI-generated match scores</li>
            <li><span className="font-medium">job_seeker_preferences</span> - Job seeker preferences</li>
            <li><span className="font-medium">skills</span> - Skill database</li>
            <li><span className="font-medium">job_skills</span> - Skills required for jobs</li>
            <li><span className="font-medium">job_seeker_skills</span> - Skills possessed by job seekers</li>
          </ul>
        </div>
      </div>
      
      <div className="mt-4 p-4 border border-gray-200 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Security Features</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Row Level Security (RLS) on all tables</li>
          <li>Role-based access control (jobseeker, recruiter, company_admin)</li>
          <li>Secure data access patterns through RLS policies</li>
          <li>Automatic timestamp management for created_at/updated_at fields</li>
        </ul>
      </div>
    </div>
  );
};

export default DatabaseDiagram;
