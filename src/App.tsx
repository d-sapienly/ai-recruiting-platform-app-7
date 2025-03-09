import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { getCurrentUser } from './lib/supabaseClient';
import LandingPage from './pages/LandingPage';
import JobSeekerRegistration from './pages/JobSeekerRegistration';
import JobSeekerDashboard from './pages/JobSeekerDashboard';
import CompanyRegistration from './pages/CompanyRegistration';
import CompanyDashboard from './pages/CompanyDashboard';
import RecruiterRegistration from './pages/RecruiterRegistration';
import RecruiterDashboard from './pages/RecruiterDashboard';

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data, error } = await getCurrentUser();
        
        if (error) {
          console.error('Error checking user:', error);
          setUser(null);
        } else {
          setUser(data.user);
        }
      } catch (err) {
        console.error('Unexpected error checking user:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Job Seeker routes */}
        <Route 
          path="/job-seeker/register" 
          element={
            user ? <JobSeekerRegistration /> : <Navigate to="/" replace />
          } 
        />
        <Route 
          path="/job-seeker/dashboard" 
          element={
            user ? <JobSeekerDashboard /> : <Navigate to="/" replace />
          } 
        />
        
        {/* Company routes */}
        <Route 
          path="/company/register" 
          element={
            user ? <CompanyRegistration /> : <Navigate to="/" replace />
          } 
        />
        <Route 
          path="/company/dashboard" 
          element={
            user ? <CompanyDashboard /> : <Navigate to="/" replace />
          } 
        />
        
        {/* Recruiter routes */}
        <Route 
          path="/recruiter/register" 
          element={
            user ? <RecruiterRegistration /> : <Navigate to="/" replace />
          } 
        />
        <Route 
          path="/recruiter/dashboard" 
          element={
            user ? <RecruiterDashboard /> : <Navigate to="/" replace />
          } 
        />
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
