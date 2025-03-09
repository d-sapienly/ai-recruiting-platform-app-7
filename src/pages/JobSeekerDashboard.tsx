import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getCurrentUser, getJobSeekerProfile } from '../lib/supabaseClient';
import { Loader2, Edit, Briefcase, MapPin, GraduationCap, Calendar, FileText, Settings } from 'lucide-react';
import { Button } from '../components/ui/button';
import EditProfileModal from '../components/auth/EditProfileModal';
import UserSettingsModal from '../components/auth/UserSettingsModal';

const JobSeekerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      // Get current user
      const { data: userData, error: userError } = await getCurrentUser();
      
      console.log("JobSeekerDashboard - User data:", userData);
      
      if (userError) {
        console.error("JobSeekerDashboard - User error:", userError);
        throw userError;
      }
      
      if (!userData.user) {
        console.log("JobSeekerDashboard - No user found, redirecting to login");
        // Redirect to login if not authenticated
        navigate('/');
        return;
      }
      
      setUserData(userData.user);
      
      // Check if user role is job_seeker
      const userRole = userData.user.user_metadata?.role;
      console.log("JobSeekerDashboard - User role:", userRole);
      
      if (userRole !== 'job_seeker') {
        console.log(`JobSeekerDashboard - User role is ${userRole}, not job_seeker`);
        setError('You do not have permission to access this page');
        return;
      }
      
      // Get job seeker profile
      const { data: profileData, error: profileError } = await getJobSeekerProfile(userData.user.id);
      
      console.log("JobSeekerDashboard - Profile data:", profileData);
      
      if (profileError) {
        console.error("JobSeekerDashboard - Profile error:", profileError);
        throw profileError;
      }
      
      if (!profileData) {
        console.log("JobSeekerDashboard - No profile found, redirecting to registration");
        // Redirect to registration if profile doesn't exist
        navigate('/job-seeker/register');
        return;
      }
      
      setProfile(profileData);
    } catch (err: any) {
      console.error('Error fetching profile:', err);
      setError(err.message || 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [navigate]);

  const handleProfileUpdated = () => {
    // Refresh profile data
    fetchProfile();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-700">{error}</p>
          <button 
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            <div className="px-4 py-5 sm:p-6 flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome to Your Dashboard</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Manage your job search, applications, and profile
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSettingsModalOpen(true)}
                className="flex items-center"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Profile Summary */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900">Your Profile</h2>
                  <div className="flex items-center text-sm text-gray-500">
                    {profile.is_actively_looking ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Actively Looking
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Not Actively Looking
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Headline</h3>
                    <p className="mt-1 text-sm text-gray-900">{profile.headline || 'Not specified'}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-start">
                      <Briefcase className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Current Position</h3>
                        <p className="mt-1 text-sm text-gray-900">{profile.current_position || 'Not specified'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Current Company</h3>
                        <p className="mt-1 text-sm text-gray-900">{profile.current_company || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Experience</h3>
                        <p className="mt-1 text-sm text-gray-900">
                          {profile.years_of_experience ? `${profile.years_of_experience} years` : 'Not specified'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <GraduationCap className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Education</h3>
                        <p className="mt-1 text-sm text-gray-900">
                          {profile.education_level ? profile.education_level.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Not specified'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {profile.resume_url && (
                    <div className="flex items-start">
                      <FileText className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Resume</h3>
                        <p className="mt-1 text-sm text-gray-900">
                          <a 
                            href={profile.resume_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-800 hover:underline"
                          >
                            View Resume
                          </a>
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Skills</h3>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {profile.skills && profile.skills.length > 0 ? (
                        profile.skills.map((skill: string, index: number) => (
                          <span 
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">No skills specified</p>
                      )}
                    </div>
                  </div>
                  
                  {profile.bio && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Bio</h3>
                      <p className="mt-1 text-sm text-gray-900">{profile.bio}</p>
                    </div>
                  )}
                  
                  {profile.preferred_locations && profile.preferred_locations.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Preferred Locations</h3>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {profile.preferred_locations.map((location: string, index: number) => (
                          <span 
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {location}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {profile.preferred_job_types && profile.preferred_job_types.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Preferred Job Types</h3>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {profile.preferred_job_types.map((type: string, index: number) => (
                          <span 
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                          >
                            {type.replace('-', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-5">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditModalOpen(true)}
                    className="inline-flex items-center"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Job Recommendations */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Recommended Jobs</h2>
                
                <div className="space-y-4">
                  <p className="text-sm text-gray-500">
                    Based on your profile, we'll show you personalized job recommendations here.
                  </p>
                  
                  {/* Job Recommendations */}
                  <div className="border border-gray-200 rounded-md p-4">
                    <div className="animate-pulse flex space-x-4">
                      <div className="flex-1 space-y-4 py-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded"></div>
                          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-md p-4">
                    <div className="animate-pulse flex space-x-4">
                      <div className="flex-1 space-y-4 py-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded"></div>
                          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Application Status */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Your Applications</h2>
                
                <div className="space-y-4">
                  <p className="text-sm text-gray-500">
                    You haven't applied to any jobs yet. Start your job search to find opportunities.
                  </p>
                  
                  <Button
                    type="button"
                    className="inline-flex items-center"
                  >
                    Browse Jobs
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Edit Profile Modal */}
      <EditProfileModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profile={profile}
        onProfileUpdated={handleProfileUpdated}
      />
      
      {/* User Settings Modal */}
      <UserSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        userData={userData}
        onUserDataUpdated={handleProfileUpdated}
      />
    </div>
  );
};

export default JobSeekerDashboard;
