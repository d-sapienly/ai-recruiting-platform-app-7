import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '../ui/input';

interface Candidate {
  id: string;
  name?: string;
  email?: string;
  current_position?: string;
  current_company?: string;
  years_of_experience?: number;
  status?: string;
  match_score?: number;
}

interface CandidatesTableProps {
  candidates: Candidate[];
  searchQuery: string;
  filterStatus: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const CandidatesTable: React.FC<CandidatesTableProps> = ({
  candidates,
  searchQuery,
  filterStatus,
  onSearchChange,
  onFilterChange
}) => {
  // Helper function to render candidate status badge
  const renderCandidateStatusBadge = (status: string | undefined) => {
    let bgColorClass = 'bg-gray-100';
    let textColorClass = 'text-gray-800';
    
    if (status === 'new') {
      bgColorClass = 'bg-green-100';
      textColorClass = 'text-green-800';
    } else if (status === 'contacted') {
      bgColorClass = 'bg-blue-100';
      textColorClass = 'text-blue-800';
    } else if (status === 'interviewing') {
      bgColorClass = 'bg-purple-100';
      textColorClass = 'text-purple-800';
    } else if (status === 'hired') {
      bgColorClass = 'bg-indigo-100';
      textColorClass = 'text-indigo-800';
    } else if (status === 'rejected') {
      bgColorClass = 'bg-red-100';
      textColorClass = 'text-red-800';
    }
    
    return (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${bgColorClass} ${textColorClass}`}>
        {status?.charAt(0).toUpperCase() + status?.slice(1) || 'New'}
      </span>
    );
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-between mb-4">
          <div className="w-full max-w-lg">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search candidates..."
                className="pl-10"
                value={searchQuery}
                onChange={onSearchChange}
              />
            </div>
          </div>
          <div className="flex items-center">
            <Filter className="h-5 w-5 text-gray-400 mr-2" />
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={filterStatus}
              onChange={onFilterChange}
            >
              <option value="all">All Candidates</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="interviewing">Interviewing</option>
              <option value="hired">Hired</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Experience
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Match Score
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {candidates.length > 0 ? (
                candidates.map((candidate) => (
                  <tr key={candidate.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                          {candidate.name ? candidate.name.charAt(0).toUpperCase() : 'C'}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{candidate.name || 'Candidate Name'}</div>
                          <div className="text-sm text-gray-500">{candidate.email || 'email@example.com'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{candidate.current_position || 'Not specified'}</div>
                      <div className="text-sm text-gray-500">{candidate.current_company || 'Not specified'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{candidate.years_of_experience ? `${candidate.years_of_experience} years` : 'Not specified'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderCandidateStatusBadge(candidate.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {candidate.match_score ? `${candidate.match_score}%` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-indigo-600 hover:text-indigo-900 mr-4">View</button>
                      <button className="text-indigo-600 hover:text-indigo-900">Contact</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No candidates found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CandidatesTable;
