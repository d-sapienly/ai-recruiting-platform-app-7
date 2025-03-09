import React from 'react';
import { Eye, MessageSquare, Check, X, Clock } from 'lucide-react';

interface Applicant {
  id: string;
  name: string;
  email: string;
  job_title: string;
  applied_date: string;
  status: string;
  match_score: number;
}

interface ApplicantsTableProps {
  applicants: Applicant[];
  onViewProfile: (applicantId: string) => void;
  onSendMessage: (applicantId: string) => void;
  onUpdateStatus: (applicantId: string, status: string) => void;
}

const ApplicantsTable: React.FC<ApplicantsTableProps> = ({
  applicants,
  onViewProfile,
  onSendMessage,
  onUpdateStatus
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Job Applicants</h3>
      </div>
      
      {applicants.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applicant
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job Position
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applied Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Match Score
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applicants.map((applicant) => (
                <tr key={applicant.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 font-medium">
                          {applicant.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{applicant.name}</div>
                        <div className="text-sm text-gray-500">{applicant.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{applicant.job_title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{new Date(applicant.applied_date).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      applicant.status === 'pending' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : applicant.status === 'interview' 
                          ? 'bg-blue-100 text-blue-800'
                          : applicant.status === 'accepted'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                    }`}>
                      {applicant.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${
                            applicant.match_score >= 80 
                              ? 'bg-green-500' 
                              : applicant.match_score >= 60 
                                ? 'bg-yellow-500' 
                                : 'bg-red-500'
                          }`} 
                          style={{ width: `${applicant.match_score}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm text-gray-700">{applicant.match_score}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => onViewProfile(applicant.id)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="View Profile"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onSendMessage(applicant.id)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Send Message"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </button>
                      <div className="relative inline-block text-left">
                        <div className="flex space-x-1">
                          <button
                            onClick={() => onUpdateStatus(applicant.id, 'interview')}
                            className="text-blue-600 hover:text-blue-900"
                            title="Schedule Interview"
                          >
                            <Clock className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => onUpdateStatus(applicant.id, 'accepted')}
                            className="text-green-600 hover:text-green-900"
                            title="Accept"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => onUpdateStatus(applicant.id, 'rejected')}
                            className="text-red-600 hover:text-red-900"
                            title="Reject"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="px-6 py-8 text-center">
          <p className="text-sm text-gray-500">
            No applicants yet. When candidates apply to your job postings, they will appear here.
          </p>
        </div>
      )}
    </div>
  );
};

export default ApplicantsTable;
