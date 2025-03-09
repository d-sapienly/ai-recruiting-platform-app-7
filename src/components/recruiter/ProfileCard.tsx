import React from 'react';
import { Briefcase } from 'lucide-react';

interface ProfileCardProps {
  profile: {
    position: string;
    is_agency?: boolean;
  };
  company: {
    name: string;
  } | null;
  userData: {
    user_metadata?: {
      name?: string;
    };
  };
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, company, userData }) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Welcome, {userData.user_metadata?.name || 'Recruiter'}
      </h2>
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
              <Briefcase className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-5">
              <h3 className="text-lg font-medium text-gray-900">{profile.position}</h3>
              <p className="text-sm text-gray-500">
                {company ? company.name : profile.is_agency ? 'Agency Recruiter' : 'In-house Recruiter'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
