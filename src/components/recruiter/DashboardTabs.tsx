import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Briefcase } from 'lucide-react';
import { Button } from '../ui/button';

import ProfileCard from './ProfileCard';
import DashboardStats from './DashboardStats';
import RecentApplicationsList from './RecentApplicationsList';
import CandidatesTable from './CandidatesTable';
import JobsTable from './JobsTable';
import ApplicationsTable from './ApplicationsTable';

interface DashboardTabsProps {
  activeTab: string;
  userData: any;
  profile: any;
  company: any;
  stats: {
    totalCandidates: number;
    totalJobs: number;
    totalApplications: number;
    pendingReviews: number;
    interviewsScheduled: number;
    offersExtended: number;
  };
  applications: any[];
  candidates: any[];
  jobs: any[];
  searchQuery: string;
  filterStatus: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onViewAllApplications: () => void;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({
  activeTab,
  userData,
  profile,
  company,
  stats,
  applications,
  candidates,
  jobs,
  searchQuery,
  filterStatus,
  onSearchChange,
  onFilterChange,
  onViewAllApplications
}) => {
  // Filter applications based on search and filter
  const filteredApplications = applications.filter(app => {
    // Apply search filter
    const matchesSearch = 
      app.job_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.candidate_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply status filter
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="px-4 py-6 sm:px-0">
            <ProfileCard 
              profile={profile} 
              company={company} 
              userData={userData} 
            />

            <DashboardStats stats={stats} />

            <RecentApplicationsList 
              applications={applications} 
              onViewAllClick={onViewAllApplications} 
            />
          </div>
        </motion.div>
      )}

      {/* Candidates Tab */}
      {activeTab === 'candidates' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="px-4 py-6 sm:px-0">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Candidates</h2>
              <Button className="flex items-center">
                <UserPlus className="h-4 w-4 mr-2" />
                Add Candidate
              </Button>
            </div>
            
            <CandidatesTable 
              candidates={candidates}
              searchQuery={searchQuery}
              filterStatus={filterStatus}
              onSearchChange={onSearchChange}
              onFilterChange={onFilterChange}
            />
          </div>
        </motion.div>
      )}

      {/* Jobs Tab */}
      {activeTab === 'jobs' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="px-4 py-6 sm:px-0">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Jobs</h2>
              <Button className="flex items-center">
                <Briefcase className="h-4 w-4 mr-2" />
                Post New Job
              </Button>
            </div>
            
            <JobsTable 
              jobs={jobs}
              searchQuery={searchQuery}
              filterStatus={filterStatus}
              onSearchChange={onSearchChange}
              onFilterChange={onFilterChange}
              companyName={company?.name}
            />
          </div>
        </motion.div>
      )}

      {/* Applications Tab */}
      {activeTab === 'applications' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="px-4 py-6 sm:px-0">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Applications</h2>
            </div>
            
            <ApplicationsTable 
              applications={filteredApplications}
              searchQuery={searchQuery}
              filterStatus={filterStatus}
              onSearchChange={onSearchChange}
              onFilterChange={onFilterChange}
              companyName={company?.name}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DashboardTabs;
