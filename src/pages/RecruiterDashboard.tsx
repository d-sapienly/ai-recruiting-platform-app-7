import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import { RealtimeChannel } from '@supabase/supabase-js';

// Components
import DashboardHeader from '../components/recruiter/DashboardHeader';
import DashboardSidebar from '../components/recruiter/DashboardSidebar';
import DashboardTabs from '../components/recruiter/DashboardTabs';
import MessagesTab from '../components/recruiter/MessagesTab';
import CalendarTab from '../components/recruiter/CalendarTab';
import UserSettingsModal from '../components/auth/UserSettingsModal';
import EditRecruiterModal from '../components/recruiter/EditRecruiterModal';

// API functions
import { 
  getCurrentUser, 
  getRecruiterProfile, 
  getRecruiterCompany,
  getRecruiterCandidates,
  getRecruiterJobs,
  getRecruiterApplications,
  subscribeToApplications
} from '../lib/supabaseClient';

const RecruiterDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [company, setCompany] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalCandidates: 0,
    totalJobs: 0,
    totalApplications: 0,
    pendingReviews: 0,
    interviewsScheduled: 0,
    offersExtended: 0
  });
  const [subscription, setSubscription] = useState<RealtimeChannel | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      // Get current user
      const { data: userData, error: userError } = await getCurrentUser();
      
      if (userError) {
        console.error("RecruiterDashboard - User error:", userError);
        throw userError;
      }
      
      if (!userData.user) {
        console.log("RecruiterDashboard - No user found, redirecting to login");
        navigate('/');
        return;
      }
      
      setUserData(userData.user);
      
      // Check if user role is recruiter
      const userRole = userData.user.user_metadata?.role;
      if (userRole !== 'recruiter') {
        console.log(`RecruiterDashboard - User role is ${userRole}, not recruiter`);
        setError('You do not have permission to access this page');
        return;
      }
      
      // Get recruiter profile
      const { data: profileData, error: profileError } = await getRecruiterProfile(userData.user.id);
      
      if (profileError) {
        console.error("RecruiterDashboard - Profile error:", profileError);
        throw profileError;
      }
      
      if (!profileData) {
        console.log("RecruiterDashboard - No profile found, redirecting to registration");
        navigate('/recruiter/register');
        return;
      }
      
      setProfile(profileData);
      
      // Get company if applicable
      if (profileData.company_id) {
        const { data: companyData, error: companyError } = await getRecruiterCompany(profileData.company_id);
        
        if (!companyError && companyData) {
          setCompany(companyData);
        }
      }
      
      // Fetch dashboard data
      await fetchDashboardData(profileData.id);
      
      // Set up real-time subscription
      setupSubscription(profileData.id);

      // Mock data for messages and calendar
      setupMockData();
      
    } catch (err: any) {
      console.error('Error fetching profile:', err);
      setError(err.message || 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDashboardData = async (recruiterId: string) => {
    try {
      // Fetch candidates
      const { data: candidatesData, error: candidatesError } = await getRecruiterCandidates(recruiterId);
      
      if (candidatesError) {
        console.error("Error fetching candidates:", candidatesError);
      } else if (candidatesData) {
        setCandidates(candidatesData);
      }
      
      // Fetch jobs
      const { data: jobsData, error: jobsError } = await getRecruiterJobs(recruiterId);
      
      if (jobsError) {
        console.error("Error fetching jobs:", jobsError);
      } else if (jobsData) {
        setJobs(jobsData);
      }
      
      // Fetch applications
      const { data: applicationsData, error: applicationsError } = await getRecruiterApplications(recruiterId);
      
      if (applicationsError) {
        console.error("Error fetching applications:", applicationsError);
      } else if (applicationsData) {
        setApplications(applicationsData);
        
        // Calculate stats
        const pendingReviews = applicationsData.filter((app: any) => app.status === 'pending').length;
        const interviewsScheduled = applicationsData.filter((app: any) => app.status === 'interview').length;
        const offersExtended = applicationsData.filter((app: any) => app.status === 'accepted').length;
        
        setStats({
          totalCandidates: candidatesData?.length || 0,
          totalJobs: jobsData?.length || 0,
          totalApplications: applicationsData.length,
          pendingReviews,
          interviewsScheduled,
          offersExtended
        });
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    }
  };

  const setupSubscription = (recruiterId: string) => {
    try {
      // Set up real-time subscription for new applications
      const channel = subscribeToApplications(recruiterId, (payload) => {
        console.log("Real-time update received:", payload);
        
        // Add notification
        const newNotification = {
          id: Date.now(),
          title: 'New Application',
          message: `A new application has been submitted for ${payload.new.job_title}`,
          time: new Date().toISOString(),
          read: false
        };
        
        setNotifications(prev => [newNotification, ...prev]);
        
        // Update applications list
        setApplications(prev => [payload.new, ...prev]);
        
        // Update stats
        setStats(prev => ({
          ...prev,
          totalApplications: prev.totalApplications + 1,
          pendingReviews: prev.pendingReviews + 1
        }));
      });
      
      setSubscription(channel);
      
      // Cleanup function
      return () => {
        if (channel) {
          channel.unsubscribe();
        }
      };
    } catch (err) {
      console.error("Error setting up subscription:", err);
    }
  };

  const setupMockData = () => {
    // Mock conversations data
    const mockConversations = [
      {
        id: '1',
        participant: {
          id: 'user1',
          name: 'John Smith',
          status: 'online' as const,
        },
        lastMessage: {
          content: "I'm interested in discussing the Software Engineer position further.",
          timestamp: new Date().toISOString(),
          isRead: false,
        },
        unreadCount: 2,
      },
      {
        id: '2',
        participant: {
          id: 'user2',
          name: 'Sarah Johnson',
          status: 'offline' as const,
          lastSeen: new Date(Date.now() - 3600000).toISOString(),
        },
        lastMessage: {
          content: "Thank you for the interview opportunity.",
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          isRead: true,
        },
        unreadCount: 0,
      },
      {
        id: '3',
        participant: {
          id: 'user3',
          name: 'Michael Brown',
          status: 'away' as const,
        },
        lastMessage: {
          content: "When can we schedule the technical interview?",
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          isRead: true,
        },
        unreadCount: 0,
      },
    ];
    
    // Mock messages data
    const mockMessages = [
      {
        id: 'm1',
        sender: {
          id: 'user1',
          name: 'John Smith',
        },
        content: "Hello, I'm interested in discussing the Software Engineer position further.",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        isRead: true,
      },
      {
        id: 'm2',
        sender: {
          id: 'currentUser',
          name: 'You',
        },
        content: "Hi John, thanks for reaching out! I'd be happy to discuss the position with you.",
        timestamp: new Date(Date.now() - 3500000).toISOString(),
        isRead: true,
      },
      {
        id: 'm3',
        sender: {
          id: 'user1',
          name: 'John Smith',
        },
        content: "Great! I have a few questions about the role and the team structure.",
        timestamp: new Date(Date.now() - 3400000).toISOString(),
        isRead: true,
      },
      {
        id: 'm4',
        sender: {
          id: 'currentUser',
          name: 'You',
        },
        content: "Of course, feel free to ask anything you'd like to know.",
        timestamp: new Date(Date.now() - 3300000).toISOString(),
        isRead: true,
      },
      {
        id: 'm5',
        sender: {
          id: 'user1',
          name: 'John Smith',
        },
        content: "What's the tech stack for this position? And how large is the engineering team?",
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        isRead: false,
      },
    ];
    
    // Mock calendar events
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const mockEvents = [
      {
        id: 'e1',
        title: 'Interview with John Smith',
        date: today.toISOString().split('T')[0],
        startTime: '10:00 AM',
        endTime: '11:00 AM',
        type: 'interview' as const,
        participants: ['John Smith'],
      },
      {
        id: 'e2',
        title: 'Team Meeting',
        date: today.toISOString().split('T')[0],
        startTime: '2:00 PM',
        endTime: '3:00 PM',
        type: 'meeting' as const,
        participants: ['Team'],
      },
      {
        id: 'e3',
        title: 'Review Applications',
        date: tomorrow.toISOString().split('T')[0],
        startTime: '9:00 AM',
        endTime: '12:00 PM',
        type: 'task' as const,
      },
      {
        id: 'e4',
        title: 'Interview with Sarah Johnson',
        date: nextWeek.toISOString().split('T')[0],
        startTime: '11:00 AM',
        endTime: '12:00 PM',
        type: 'interview' as const,
        participants: ['Sarah Johnson'],
      },
    ];
    
    setConversations(mockConversations);
    setMessages(mockMessages);
    setEvents(mockEvents);
  };

  useEffect(() => {
    fetchProfile();
    
    // Cleanup subscription on unmount
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [navigate]);

  const handleProfileUpdated = () => {
    // Refresh profile data
    fetchProfile();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(e.target.value);
  };

  const handleViewAllApplications = () => {
    setActiveTab('applications');
  };

  const handleOpenMessages = () => {
    setActiveTab('messages');
  };

  const handleLogout = async () => {
    try {
      // Here you would typically call your logout function
      console.log('Logging out...');
      navigate('/');
    } catch (err) {
      console.error('Error logging out:', err);
    }
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
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <DashboardSidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        isCollapsed={isSidebarCollapsed}
        toggleCollapsed={toggleSidebar}
      />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader 
          notificationsCount={notifications.length}
          messagesCount={conversations.reduce((count, conv) => count + conv.unreadCount, 0)}
          onEditProfile={() => setIsEditModalOpen(true)}
          onOpenSettings={() => setIsSettingsModalOpen(true)}
          onOpenMessages={handleOpenMessages}
        />
        
        <main className="flex-1 overflow-y-auto p-4">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <DashboardTabs 
              activeTab="dashboard"
              userData={userData}
              profile={profile}
              company={company}
              stats={stats}
              applications={applications}
              candidates={candidates}
              jobs={jobs}
              searchQuery={searchQuery}
              filterStatus={filterStatus}
              onSearchChange={handleSearchChange}
              onFilterChange={handleFilterChange}
              onViewAllApplications={handleViewAllApplications}
            />
          )}
          
          {/* Candidates Tab */}
          {activeTab === 'candidates' && (
            <DashboardTabs 
              activeTab="candidates"
              userData={userData}
              profile={profile}
              company={company}
              stats={stats}
              applications={applications}
              candidates={candidates}
              jobs={jobs}
              searchQuery={searchQuery}
              filterStatus={filterStatus}
              onSearchChange={handleSearchChange}
              onFilterChange={handleFilterChange}
              onViewAllApplications={handleViewAllApplications}
            />
          )}
          
          {/* Jobs Tab */}
          {activeTab === 'jobs' && (
            <DashboardTabs 
              activeTab="jobs"
              userData={userData}
              profile={profile}
              company={company}
              stats={stats}
              applications={applications}
              candidates={candidates}
              jobs={jobs}
              searchQuery={searchQuery}
              filterStatus={filterStatus}
              onSearchChange={handleSearchChange}
              onFilterChange={handleFilterChange}
              onViewAllApplications={handleViewAllApplications}
            />
          )}
          
          {/* Applications Tab */}
          {activeTab === 'applications' && (
            <DashboardTabs 
              activeTab="applications"
              userData={userData}
              profile={profile}
              company={company}
              stats={stats}
              applications={applications}
              candidates={candidates}
              jobs={jobs}
              searchQuery={searchQuery}
              filterStatus={filterStatus}
              onSearchChange={handleSearchChange}
              onFilterChange={handleFilterChange}
              onViewAllApplications={handleViewAllApplications}
            />
          )}
          
          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <MessagesTab 
              conversations={conversations}
              messages={messages}
              currentUserId="currentUser"
            />
          )}
          
          {/* Calendar Tab */}
          {activeTab === 'calendar' && (
            <CalendarTab events={events} />
          )}
          
          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings</h2>
              <p className="text-gray-500">Settings page is under development.</p>
            </div>
          )}
        </main>
      </div>
      
      {/* Edit Profile Modal */}
      <EditRecruiterModal 
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

export default RecruiterDashboard;
