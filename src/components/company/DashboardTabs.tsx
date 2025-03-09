import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/Tabs';
import CompanyProfileCard from './CompanyProfileCard';
import JobsTable from './JobsTable';
import ApplicantsTable from './ApplicantsTable';

interface DashboardTabsProps {
  activeTab: string;
  company: any;
  jobs: any[];
  applicants: any[];
  onEditCompany: () => void;
  onCreateJob: () => void;
  onEditJob: (jobId: string) => void;
  onDeleteJob: (jobId: string) => void;
  onViewApplications: (jobId: string) => void;
  onViewApplicantProfile: (applicantId: string) => void;
  onSendMessage: (applicantId: string) => void;
  onUpdateApplicantStatus: (applicantId: string, status: string) => void;
  isJobsLoading?: boolean;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({
  activeTab,
  company,
  jobs,
  applicants,
  onEditCompany,
  onCreateJob,
  onEditJob,
  onDeleteJob,
  onViewApplications,
  onViewApplicantProfile,
  onSendMessage,
  onUpdateApplicantStatus,
  isJobsLoading = false
}) => {
  return (
    <Tabs value={activeTab} onValueChange={() => {}} className="w-full">
      {/* Dashboard Tab */}
      <TabsContent value="dashboard">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <CompanyProfileCard company={company} onEditCompany={onEditCompany} />
          
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Overview</h2>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                  <div className="bg-indigo-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-indigo-800">Active Jobs</h3>
                    <p className="mt-2 text-3xl font-semibold text-indigo-600">
                      {jobs.filter(job => job.status === 'active').length}
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-green-800">Total Applicants</h3>
                    <p className="mt-2 text-3xl font-semibold text-green-600">
                      {applicants.length}
                    </p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-blue-800">Interviews Scheduled</h3>
                    <p className="mt-2 text-3xl font-semibold text-blue-600">
                      {applicants.filter(app => app.status === 'interview').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-1 gap-6">
          <JobsTable 
            jobs={jobs.slice(0, 5)} 
            onCreateJob={onCreateJob}
            onEditJob={onEditJob}
            onDeleteJob={onDeleteJob}
            onViewApplications={onViewApplications}
            isLoading={isJobsLoading}
          />
          
          <ApplicantsTable 
            applicants={applicants.slice(0, 5)}
            onViewProfile={onViewApplicantProfile}
            onSendMessage={onSendMessage}
            onUpdateStatus={onUpdateApplicantStatus}
          />
        </div>
      </TabsContent>
      
      {/* Company Profile Tab */}
      <TabsContent value="company">
        <div className="max-w-3xl mx-auto">
          <CompanyProfileCard company={company} onEditCompany={onEditCompany} />
        </div>
      </TabsContent>
      
      {/* Jobs Tab */}
      <TabsContent value="jobs">
        <JobsTable 
          jobs={jobs} 
          onCreateJob={onCreateJob}
          onEditJob={onEditJob}
          onDeleteJob={onDeleteJob}
          onViewApplications={onViewApplications}
          isLoading={isJobsLoading}
        />
      </TabsContent>
      
      {/* Applicants Tab */}
      <TabsContent value="applicants">
        <ApplicantsTable 
          applicants={applicants}
          onViewProfile={onViewApplicantProfile}
          onSendMessage={onSendMessage}
          onUpdateStatus={onUpdateApplicantStatus}
        />
      </TabsContent>
      
      {/* Applications Tab */}
      <TabsContent value="applications">
        <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
          <h2 className="text-xl font-semibold mb-4">Applications by Job</h2>
          {jobs.length > 0 ? (
            <div className="space-y-4">
              {jobs.map(job => (
                <div key={job.id} className="border rounded-lg p-4">
                  <h3 className="font-medium text-lg">{job.title}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-500">
                      {job.applications_count} applications
                    </span>
                    <button 
                      onClick={() => onViewApplications(job.id)}
                      className="text-sm text-indigo-600 hover:text-indigo-800"
                    >
                      View applications
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No job postings yet.</p>
          )}
        </div>
      </TabsContent>
      
      {/* Settings Tab */}
      <TabsContent value="settings">
        <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
          <h2 className="text-xl font-semibold mb-4">Company Settings</h2>
          <p className="text-gray-500">Company settings page is under development.</p>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
