import React from 'react';
import { Edit, Trash2, Eye, Plus } from 'lucide-react';
import { Button } from '../ui/button';

interface Job {
  id: string;
  title: string;
  location: string;
  type: string;
  status: string;
  posted_date: string;
  applications_count: number;
}

interface JobsTableProps {
  jobs: Job[];
  onCreateJob: () => void;
  onEditJob: (jobId: string) => void;
  onDeleteJob: (jobId: string) => void;
  onViewApplications: (jobId: string) => void;
  isLoading?: boolean;
}

const JobsTable: React.FC<JobsTableProps> = ({
  jobs,
  onCreateJob,
  onEditJob,
  onDeleteJob,
  onViewApplications,
  isLoading = false
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Job Postings</h3>
        <Button 
          onClick={onCreateJob}
          size="sm"
          className="inline-flex items-center"
        >
          <Plus className="h-4 w-4 mr-1" />
          Post Job
        </Button>
      </div>
      
      {isLoading ? (
        <div className="px-6 py-8 text-center">
          <p className="text-sm text-gray-500">Loading job postings...</p>
        </div>
      ) : jobs.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job Title
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Posted Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applications
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {jobs.map((job) => (
                <tr key={job.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{job.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{job.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{job.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      job.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : job.status === 'draft' 
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {job.posted_date ? new Date(job.posted_date).toLocaleDateString() : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{job.applications_count}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => onViewApplications(job.id)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="View Applications"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onEditJob(job.id)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit Job"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDeleteJob(job.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Job"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="px-6 py-8 text-center">
          <p className="text-sm text-gray-500 mb-4">
            You haven't posted any jobs yet. Create your first job posting to start finding talent.
          </p>
          <Button 
            onClick={onCreateJob}
            className="inline-flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Post Your First Job
          </Button>
        </div>
      )}
    </div>
  );
};

export default JobsTable;
