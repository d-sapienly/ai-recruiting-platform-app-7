import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { UserRound, Building2, Users } from 'lucide-react';

interface CTASectionProps {
  onJobSeekerClick: () => void;
  onCompanyClick: () => void;
  onRecruiterClick: () => void;
}

const CTASection: React.FC<CTASectionProps> = ({ 
  onJobSeekerClick, 
  onCompanyClick, 
  onRecruiterClick 
}) => {
  return (
    <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Hiring Experience?</h2>
          <p className="text-lg md:text-xl max-w-3xl mx-auto opacity-90">
            Join thousands of job seekers, companies, and recruiters who are already using our platform to connect.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/20 transition-all"
          >
            <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserRound className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Job Seekers</h3>
            <p className="mb-6 opacity-90">
              Find your dream job with AI-powered matching that understands your unique skills and career goals.
            </p>
            <Button 
              onClick={onJobSeekerClick}
              className="bg-white text-indigo-700 hover:bg-gray-100"
            >
              Sign Up as Job Seeker
            </Button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/20 transition-all"
          >
            <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Companies</h3>
            <p className="mb-6 opacity-90">
              Post jobs and get matched with qualified candidates who are the perfect fit for your company culture.
            </p>
            <Button 
              onClick={onCompanyClick}
              className="bg-white text-indigo-700 hover:bg-gray-100"
            >
              Sign Up as Company
            </Button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/20 transition-all"
          >
            <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Recruiters</h3>
            <p className="mb-6 opacity-90">
              Streamline your recruitment process with powerful tools to find, evaluate, and place top talent.
            </p>
            <Button 
              onClick={onRecruiterClick}
              className="bg-white text-indigo-700 hover:bg-gray-100"
            >
              Sign Up as Recruiter
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
