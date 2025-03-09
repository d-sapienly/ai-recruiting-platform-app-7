import React, { useState } from 'react';
import HeroSection from '../components/landing/HeroSection';
import FeatureSection from '../components/landing/FeatureSection';
import UserFlowSection from '../components/landing/UserFlowSection';
import TestimonialSection from '../components/landing/TestimonialSection';
import CTASection from '../components/landing/CTASection';
import Footer from '../components/landing/Footer';
import AuthModal from '../components/auth/AuthModal';

const LandingPage: React.FC = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [userType, setUserType] = useState<'job_seeker' | 'company_admin' | 'recruiter'>('job_seeker');

  const openAuthModal = (mode: 'login' | 'signup', type: 'job_seeker' | 'company_admin' | 'recruiter' = 'job_seeker') => {
    setAuthModalMode(mode);
    setUserType(type);
    setIsAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <HeroSection onLoginClick={() => openAuthModal('login')} onSignupClick={() => openAuthModal('signup')} />
      <FeatureSection />
      <UserFlowSection />
      <TestimonialSection />
      <CTASection 
        onJobSeekerClick={() => openAuthModal('signup', 'job_seeker')}
        onCompanyClick={() => openAuthModal('signup', 'company_admin')}
        onRecruiterClick={() => openAuthModal('signup', 'recruiter')}
      />
      <Footer />
      
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
        userType={userType}
      />
    </div>
  );
};

export default LandingPage;
