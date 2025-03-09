import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Zap, 
  BarChart, 
  MessageSquare, 
  Calendar, 
  Shield 
} from 'lucide-react';

const features = [
  {
    name: 'AI-Powered Matching',
    description: 'Our intelligent algorithm matches job seekers with the perfect opportunities based on skills, experience, and preferences.',
    icon: Zap,
    color: 'bg-indigo-500'
  },
  {
    name: 'Advanced Search',
    description: 'Find exactly what you\'re looking for with powerful filters and search capabilities.',
    icon: Search,
    color: 'bg-purple-500'
  },
  {
    name: 'Analytics Dashboard',
    description: 'Track application status, interview performance, and job search metrics in real-time.',
    icon: BarChart,
    color: 'bg-blue-500'
  },
  {
    name: 'Integrated Messaging',
    description: 'Communicate directly with recruiters and hiring managers through our secure platform.',
    icon: MessageSquare,
    color: 'bg-green-500'
  },
  {
    name: 'Interview Scheduling',
    description: 'Seamlessly schedule and manage interviews with integrated calendar functionality.',
    icon: Calendar,
    color: 'bg-yellow-500'
  },
  {
    name: 'Privacy Controls',
    description: 'Control who sees your profile and how your data is used with advanced privacy settings.',
    icon: Shield,
    color: 'bg-red-500'
  }
];

const FeatureSection: React.FC = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Everything You Need to Succeed
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Our platform provides powerful tools for job seekers, recruiters, and companies to streamline the hiring process.
          </p>
        </div>

        <motion.div 
          className="mt-16"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div 
                key={feature.name} 
                className="relative p-6 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                variants={item}
              >
                <div>
                  <div className={`${feature.color} rounded-md p-2 inline-flex items-center justify-center text-white`}>
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">{feature.name}</h3>
                  <p className="mt-2 text-base text-gray-500">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FeatureSection;
