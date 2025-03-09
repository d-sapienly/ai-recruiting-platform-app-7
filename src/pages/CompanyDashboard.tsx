import React, { useState, useEffect } from 'react';
import DashboardHeader from '../components/company/DashboardHeader';
import DashboardSidebar from '../components/company/DashboardSidebar';
import DashboardTabs from '../components/company/DashboardTabs';
import EditCompanyModal from '../components/company/EditCompanyModal';
import CreateJobModal from '../components/company/CreateJobModal';
import EditJobModal from '../components/company/EditJobModal';
import { getCurrentUser, getCompanyByUserId, getCompanyJobs, updateCompany, updateJob } from '../lib/supabaseClient';
import { JobFormData } from '../components/company/CreateJobModal';
import { Job } from '../components/company/EditJobModal';

const CompanyDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [company, setCompany] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [isEditCompanyModalOpen, setIsEditCompanyModalOpen] = useState(false);
  const [isCreateJobModalOpen, setIsCreateJobModalOpen] = useState(false);
  const [isEditJobModalOpen, setIsEditJobModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJobsLoading, setIsJobsLoading] = useState(true);
  const [deleteConfirmationJobId, setDeleteConfirmationJobId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        setIsLoading(true);
        const { data: { user } } = await getCurrentUser();
        
        if (user) {
          const { data: companyData } = await getCompanyByUserId(user.id);
          
          if (companyData) {
            setCompany(companyData);
            
            // Fetch jobs for this company
            setIsJobsLoading(true);
            const { data: jobsData } = await getCompanyJobs(companyData.id);
            
            if (jobsData) {
              // Add application count and format dates for display
              // Filter out jobs with status "deleted"
              const formattedJobs = jobsData
                .filter((job: any) => job.status !== 'deleted')
                .map((job: any) => ({
                  ...job,
                  posted_date: job.posted_at || job.created_at,
                  applications_count: 0 // This would be fetched from a real API
                }));
              
              setJobs(formattedJobs);
            }
            setIsJobsLoading(false);
            
            // In a real app, you would fetch applicants here
            setApplicants([]);
          }
        }
      } catch (error) {
        console.error('Error fetching company data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanyData();
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleLogout = () => {
    console.log('Logging out...');
    // Implement logout functionality
  };

  const handleEditCompany = () => {
    setIsEditCompanyModalOpen(true);
  };

  const handleCompanyUpdated = () => {
    // Refresh company data after update
    const refreshCompanyData = async () => {
      try {
        const { data: { user } } = await getCurrentUser();
        if (user) {
          const { data: companyData } = await getCompanyByUserId(user.id);
          if (companyData) {
            setCompany(companyData);
          }
        }
      } catch (error) {
        console.error('Error refreshing company data:', error);
      }
    };
    
    refreshCompanyData();
    setIsEditCompanyModalOpen(false);
  };

  const handleCreateJob = () => {
    setIsCreateJobModalOpen(true);
  };

  const handleEditJob = (jobId: string) => {
    // Find the job in the jobs array
    const jobToEdit = jobs.find(job => job.id === jobId);
    
    if (jobToEdit) {
      setSelectedJob(jobToEdit);
      setIsEditJobModalOpen(true);
    } else {
      console.error('Job not found:', jobId);
    }
  };

  const handleJobUpdated = (updatedJobData: JobFormData) => {
    if (!selectedJob) return;
    
    // Update the job in the local state
    const updatedJobs = jobs.map(job => {
      if (job.id === selectedJob.id) {
        return {
          ...job,
          title: updatedJobData.title,
          description: updatedJobData.description,
          location: updatedJobData.location,
          job_type: updatedJobData.type,
          salary_min: updatedJobData.salary_min,
          salary_max: updatedJobData.salary_max,
          requirements: updatedJobData.requirements ? [updatedJobData.requirements] : null,
          status: updatedJobData.status
        };
      }
      return job;
    });
    
    setJobs(updatedJobs);
    setIsEditJobModalOpen(false);
    setSelectedJob(null);
  };

  const handleDeleteJob = async (jobId: string) => {
    // Set the job ID for confirmation dialog
    setDeleteConfirmationJobId(jobId);
  };

  const confirmDeleteJob = async () => {
    if (!deleteConfirmationJobId) return;
    
    try {
      // Update the job status to "deleted" instead of physically deleting it
      const { data, error } = await updateJob(deleteConfirmationJobId, { status: 'deleted' });
      
      if (error) {
        console.error('Error deleting job:', error);
        alert('Failed to delete job. Please try again.');
      } else {
        console.log('Job marked as deleted:', data);
        
        // Remove the job from the local state
        setJobs(jobs.filter(job => job.id !== deleteConfirmationJobId));
        
        // Close the confirmation dialog
        setDeleteConfirmationJobId(null);
      }
    } catch (error) {
      console.error('Unexpected error deleting job:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  const cancelDeleteJob = () => {
    // Close the confirmation dialog without deleting
    setDeleteConfirmationJobId(null);
  };

  const handleViewApplications = (jobId: string) => {
    console.log('View applications for job:', jobId);
    // Implement view applications functionality
  };

  const handleViewApplicantProfile = (applicantId: string) => {
    console.log('View applicant profile:', applicantId);
    // Implement view applicant profile functionality
  };

  const handleSendMessage = (applicantId: string) => {
    console.log('Send message to applicant:', applicantId);
    // Implement send message functionality
  };

  const handleUpdateApplicantStatus = (applicantId: string, status: string) => {
    console.log('Update applicant status:', applicantId, status);
    // Implement update applicant status functionality
  };

  const handleJobCreated = (jobData: JobFormData) => {
    // Add the new job to the jobs list
    const newJob = {
      ...jobData,
      id: Date.now().toString(), // This would be replaced by the actual ID from the API
      posted_date: new Date().toISOString(),
      applications_count: 0
    };
    
    setJobs([newJob, ...jobs]);
    setIsCreateJobModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading company dashboard...</p>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Company Found</h2>
          <p className="text-gray-600 mb-6">
            It looks like you don't have a company profile yet. Please create a company profile to access the dashboard.
          </p>
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            onClick={() => window.location.href = '/company-registration'}
          >
            Create Company Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader company={company} />
      
      <div className="flex">
        <DashboardSidebar 
          activeTab={activeTab} 
          onTabChange={handleTabChange}
          onLogout={handleLogout}
        />
        
        <main className="flex-1 p-6">
          <DashboardTabs
            activeTab={activeTab}
            company={company}
            jobs={jobs}
            applicants={applicants}
            onEditCompany={handleEditCompany}
            onCreateJob={handleCreateJob}
            onEditJob={handleEditJob}
            onDeleteJob={handleDeleteJob}
            onViewApplications={handleViewApplications}
            onViewApplicantProfile={handleViewApplicantProfile}
            onSendMessage={handleSendMessage}
            onUpdateApplicantStatus={handleUpdateApplicantStatus}
            isJobsLoading={isJobsLoading}
          />
        </main>
      </div>
      
      {/* Edit Company Modal */}
      <EditCompanyModal
        isOpen={isEditCompanyModalOpen}
        onClose={() => setIsEditCompanyModalOpen(false)}
        companyId={company?.id}
        onCompanyUpdated={handleCompanyUpdated}
      />
      
      {/* Create Job Modal */}
      <CreateJobModal
        isOpen={isCreateJobModalOpen}
        onClose={() => setIsCreateJobModalOpen(false)}
        onCreateJob={handleJobCreated}
      />
      
      {/* Edit Job Modal */}
      <EditJobModal
        isOpen={isEditJobModalOpen}
        onClose={() => setIsEditJobModalOpen(false)}
        onJobUpdated={handleJobUpdated}
        job={selectedJob}
      />
      
      {/* Delete Job Confirmation Dialog */}
      {deleteConfirmationJobId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Deletion</h3>
            <p className="text-sm text-gray-500 mb-4">
              Are you sure you want to delete this job posting? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDeleteJob}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteJob}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyDashboard;
