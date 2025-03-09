import React from 'react';
import { Users, LineChart, Calendar } from 'lucide-react';

interface Application {
  id: string;
  job_title?: string;
  status?: string;
  candidate_name?: string;
  match_score?: number;
  applied_at: string;
}

interface RecentApplicationsListProps {
  applications: Application[];
  onViewAllClick: () => void;
}

const RecentApplicationsList: React.FC<RecentApplicationsListProps> = ({ 
  applications, 
  onViewAllClick 
}) => {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Applications</h3>
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {applications.slice(0, 5).map((application) => (
            <li key={application.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-indigo-600 truncate">
                    {application.job_title || 'Job Title'}
                  </p>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        application.status === 'interview' ? 'bg-blue-100 text-blue-800' : 
                        application.status === 'accepted' ? 'bg-green-100 text-green-800' : 
                        application.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                        'bg-gray-100 text-gray-800'}`}>
                      {application.status?.charAt(0).toUpperCase() + application.status?.slice(1) || 'Unknown'}
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      <Users className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      {application.candidate_name || 'Candidate Name'}
                    </p>
                    {application.match_score && (
                      <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                        <LineChart className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        Match Score: {application.match_score}%
                      </p>
                    )}
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <Calendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                    <p>
                      Applied on {new Date(application.applied_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
          {applications.length === 0 && (
            <li>
              <div className="px-4 py-4 sm:px-6 text-center text-gray-500">
                No applications yet
              </div>
            </li>
          )}
        </ul>
        {applications.length > 5 && (
          <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
            <button
              onClick={onViewAllClick}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              View all applications
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentApplicationsList;
