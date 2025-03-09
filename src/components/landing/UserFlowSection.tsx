import React from 'react';
import { motion } from 'framer-motion';
import { UserRound, Building2, Users, ArrowRight } from 'lucide-react';

const UserFlowSection: React.FC = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="bg-gray-50 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center mb-16">
          <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">How It Works</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Tailored for Every User
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Our platform provides a seamless experience for job seekers, companies, and recruiters.
          </p>
        </div>

        <div className="mt-12">
          <motion.div 
            className="space-y-16"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {/* Job Seeker Flow */}
            <motion.div variants={item}>
              <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
                <div className="lg:col-span-5">
                  <div className="flex items-center justify-center lg:justify-start">
                    <div className="p-3 rounded-full bg-indigo-50 text-indigo-700">
                      <UserRound className="h-8 w-8" />
                    </div>
                    <h3 className="ml-3 text-2xl font-bold text-gray-900">For Job Seekers</h3>
                  </div>
                  <div className="mt-6 space-y-6">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-500 text-white">
                          1
                        </div>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-medium text-gray-900">Create your profile</h4>
                        <p className="mt-1 text-gray-500">
                          Build a comprehensive profile showcasing your skills, experience, and career goals.
                        </p>
                      </div>
                    </div>
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-500 text-white">
                          2
                        </div>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-medium text-gray-900">Get matched</h4>
                        <p className="mt-1 text-gray-500">
                          Our AI algorithm matches you with jobs that align with your skills and preferences.
                        </p>
                      </div>
                    </div>
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-500 text-white">
                          3
                        </div>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-medium text-gray-900">Apply and interview</h4>
                        <p className="mt-1 text-gray-500">
                          Apply to positions with a single click and manage your interviews all in one place.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-10 lg:mt-0 lg:col-span-7">
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" 
                      alt="Job seeker using laptop" 
                      className="w-full h-64 object-cover object-center sm:h-72 md:h-80 lg:h-96"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Company Flow */}
            <motion.div variants={item}>
              <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
                <div className="lg:col-span-7 order-2 lg:order-1">
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" 
                      alt="Company team meeting" 
                      className="w-full h-64 object-cover object-center sm:h-72 md:h-80 lg:h-96"
                    />
                  </div>
                </div>
                <div className="mt-10 lg:mt-0 lg:col-span-5 order-1 lg:order-2">
                  <div className="flex items-center justify-center lg:justify-start">
                    <div className="p-3 rounded-full bg-indigo-50 text-indigo-700">
                      <Building2 className="h-8 w-8" />
                    </div>
                    <h3 className="ml-3 text-2xl font-bold text-gray-900">For Companies</h3>
                  </div>
                  <div className="mt-6 space-y-6">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-500 text-white">
                          1
                        </div>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-medium text-gray-900">Create company profile</h4>
                        <p className="mt-1 text-gray-500">
                          Showcase your company culture, benefits, and what makes you unique.
                        </p>
                      </div>
                    </div>
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-500 text-white">
                          2
                        </div>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-medium text-gray-900">Post job openings</h4>
                        <p className="mt-1 text-gray-500">
                          Create detailed job listings with required skills and qualifications.
                        </p>
                      </div>
                    </div>
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-500 text-white">
                          3
                        </div>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-medium text-gray-900">Review AI-matched candidates</h4>
                        <p className="mt-1 text-gray-500">
                          Get matched with qualified candidates and streamline your hiring process.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Recruiter Flow */}
            <motion.div variants={item}>
              <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
                <div className="lg:col-span-5">
                  <div className="flex items-center justify-center lg:justify-start">
                    <div className="p-3 rounded-full bg-indigo-50 text-indigo-700">
                      <Users className="h-8 w-8" />
                    </div>
                    <h3 className="ml-3 text-2xl font-bold text-gray-900">For Recruiters</h3>
                  </div>
                  <div className="mt-6 space-y-6">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-500 text-white">
                          1
                        </div>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-medium text-gray-900">Manage multiple clients</h4>
                        <p className="mt-1 text-gray-500">
                          Easily switch between different company accounts and manage multiple job postings.
                        </p>
                      </div>
                    </div>
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-500 text-white">
                          2
                        </div>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-medium text-gray-900">Access talent pool</h4>
                        <p className="mt-1 text-gray-500">
                          Search our extensive database of candidates with advanced filtering options.
                        </p>
                      </div>
                    </div>
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-500 text-white">
                          3
                        </div>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-medium text-gray-900">Track recruitment metrics</h4>
                        <p className="mt-1 text-gray-500">
                          Monitor performance with detailed analytics on your recruitment campaigns.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-10 lg:mt-0 lg:col-span-7">
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" 
                      alt="Recruiter working" 
                      className="w-full h-64 object-cover object-center sm:h-72 md:h-80 lg:h-96"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default UserFlowSection;
