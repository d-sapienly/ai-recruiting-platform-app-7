import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Search, Building2, UserRound } from 'lucide-react';

interface HeroSectionProps {
  onLoginClick: () => void;
  onSignupClick: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onLoginClick, onSignupClick }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-indigo-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl"
            >
              <span className="block">Find Your Perfect</span>
              <span className="block text-indigo-600">Career Match</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl"
            >
              Connect with top companies, discover opportunities that match your skills, and take the next step in your career journey with our AI-powered recruitment platform.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0"
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Button 
                  onClick={onSignupClick}
                  size="lg"
                  className="w-full"
                >
                  Get Started
                </Button>
                <Button 
                  onClick={onLoginClick}
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  Sign In
                </Button>
              </div>
              
              <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-4">
                <div className="flex items-center">
                  <UserRound className="h-5 w-5 text-indigo-500 mr-2" />
                  <span className="text-sm text-gray-500">For Job Seekers</span>
                </div>
                <div className="flex items-center">
                  <Building2 className="h-5 w-5 text-indigo-500 mr-2" />
                  <span className="text-sm text-gray-500">For Companies</span>
                </div>
                <div className="flex items-center">
                  <Search className="h-5 w-5 text-indigo-500 mr-2" />
                  <span className="text-sm text-gray-500">AI-Powered Matching</span>
                </div>
              </div>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center"
          >
            <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
              <div className="relative block w-full bg-white rounded-lg overflow-hidden">
                <img
                  className="w-full"
                  src="https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                  alt="People working on laptops"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-purple-700 mix-blend-multiply opacity-50"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center">
                    <div className="ml-3">
                      <p className="text-sm font-medium text-white">
                        "Found my dream job in just 2 weeks!"
                      </p>
                      <p className="text-xs text-gray-300 mt-1">
                        Sarah J. - Software Engineer
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
