import React from 'react';
import { 
  Database, 
  Users, 
  Building2, 
  UserRound, 
  Search, 
  FileText, 
  MessageSquare, 
  Bell, 
  Lock, 
  Server, 
  Layers
} from 'lucide-react';

const ArchitectureDiagram: React.FC = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Recruitment Platform Architecture</h2>
      
      <div className="relative">
        {/* Frontend Layer */}
        <div className="border-2 border-blue-500 rounded-lg p-4 mb-8">
          <div className="flex items-center mb-2">
            <Layers className="text-blue-500 mr-2" />
            <h3 className="text-xl font-semibold">Frontend (React)</h3>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="border border-gray-300 rounded p-3 bg-blue-50">
              <div className="flex items-center mb-2">
                <Building2 className="text-blue-600 mr-2" size={20} />
                <span className="font-medium">Company Portal</span>
              </div>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>• Job posting</li>
                <li>• Application review</li>
                <li>• Candidate management</li>
              </ul>
            </div>
            
            <div className="border border-gray-300 rounded p-3 bg-blue-50">
              <div className="flex items-center mb-2">
                <UserRound className="text-blue-600 mr-2" size={20} />
                <span className="font-medium">Job Seeker Portal</span>
              </div>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>• Profile management</li>
                <li>• Job search</li>
                <li>• Application tracking</li>
              </ul>
            </div>
            
            <div className="border border-gray-300 rounded p-3 bg-blue-50">
              <div className="flex items-center mb-2">
                <Users className="text-blue-600 mr-2" size={20} />
                <span className="font-medium">Recruiter Portal</span>
              </div>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>• Candidate sourcing</li>
                <li>• Interview scheduling</li>
                <li>• Hiring pipeline</li>
              </ul>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-3">
            <div className="border border-gray-300 rounded p-2 bg-gray-50 text-center">
              <div className="flex flex-col items-center">
                <Search size={18} className="text-gray-600" />
                <span className="text-xs mt-1">Search</span>
              </div>
            </div>
            <div className="border border-gray-300 rounded p-2 bg-gray-50 text-center">
              <div className="flex flex-col items-center">
                <FileText size={18} className="text-gray-600" />
                <span className="text-xs mt-1">Documents</span>
              </div>
            </div>
            <div className="border border-gray-300 rounded p-2 bg-gray-50 text-center">
              <div className="flex flex-col items-center">
                <MessageSquare size={18} className="text-gray-600" />
                <span className="text-xs mt-1">Messaging</span>
              </div>
            </div>
            <div className="border border-gray-300 rounded p-2 bg-gray-50 text-center">
              <div className="flex flex-col items-center">
                <Bell size={18} className="text-gray-600" />
                <span className="text-xs mt-1">Notifications</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Backend Layer */}
        <div className="border-2 border-green-500 rounded-lg p-4 mb-8">
          <div className="flex items-center mb-2">
            <Server className="text-green-500 mr-2" />
            <h3 className="text-xl font-semibold">Backend (Supabase)</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="border border-gray-300 rounded p-3 bg-green-50">
              <div className="flex items-center mb-2">
                <Database className="text-green-600 mr-2" size={20} />
                <span className="font-medium">Database Services</span>
              </div>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>• PostgreSQL database</li>
                <li>• Real-time subscriptions</li>
                <li>• Row-level security</li>
                <li>• Database triggers</li>
              </ul>
            </div>
            
            <div className="border border-gray-300 rounded p-3 bg-green-50">
              <div className="flex items-center mb-2">
                <Lock className="text-green-600 mr-2" size={20} />
                <span className="font-medium">Authentication</span>
              </div>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>• User management</li>
                <li>• Role-based access</li>
                <li>• OAuth providers</li>
                <li>• JWT tokens</li>
              </ul>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="border border-gray-300 rounded p-2 bg-gray-50 text-center">
              <span className="text-xs">Storage</span>
            </div>
            <div className="border border-gray-300 rounded p-2 bg-gray-50 text-center">
              <span className="text-xs">Edge Functions</span>
            </div>
            <div className="border border-gray-300 rounded p-2 bg-gray-50 text-center">
              <span className="text-xs">Webhooks</span>
            </div>
          </div>
        </div>
        
        {/* Data Flow Arrows */}
        <div className="absolute left-1/2 top-[180px] transform -translate-x-1/2 h-16 w-0.5 bg-gray-400 flex items-center justify-center">
          <div className="absolute top-1/2 -mt-1 w-3 h-3 rotate-45 border-r-2 border-b-2 border-gray-400"></div>
        </div>
        
        <div className="absolute left-1/2 top-[380px] transform -translate-x-1/2 h-16 w-0.5 bg-gray-400 flex items-center justify-center">
          <div className="absolute bottom-1/2 -mb-1 w-3 h-3 rotate-45 border-l-2 border-t-2 border-gray-400"></div>
        </div>
      </div>
    </div>
  );
};

export default ArchitectureDiagram;
