import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  FileText, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Building2
} from 'lucide-react';

interface DashboardSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout?: () => void;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  activeTab,
  onTabChange,
  onLogout = () => {}
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const toggleCollapsed = () => {
    setIsCollapsed(!isCollapsed);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { id: 'company', label: 'Company Profile', icon: <Building2 className="h-5 w-5" /> },
    { id: 'jobs', label: 'Job Postings', icon: <Briefcase className="h-5 w-5" /> },
    { id: 'applicants', label: 'Job Applicants', icon: <Users className="h-5 w-5" /> },
    { id: 'applications', label: 'Applications', icon: <FileText className="h-5 w-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <div 
      className={`h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex-1 flex flex-col overflow-y-auto pt-5 pb-4">
        <div className={`flex items-center justify-center flex-shrink-0 px-4 ${isCollapsed ? 'flex-col' : ''}`}>
          <img
            className="h-8 w-auto"
            src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
            alt="Workflow"
          />
          {!isCollapsed && (
            <span className="ml-2 text-xl font-bold text-gray-900">TalentMatch</span>
          )}
        </div>
        
        <div className="flex justify-end px-4 mt-4">
          <button 
            onClick={toggleCollapsed}
            className="p-1 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>
        </div>
        
        <nav className="mt-5 flex-1 px-2 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full ${
                activeTab === item.id
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              } ${isCollapsed ? 'justify-center' : ''}`}
              title={isCollapsed ? item.label : ''}
            >
              <div className={`${
                activeTab === item.id ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'
              } ${isCollapsed ? '' : 'mr-3'}`}>
                {item.icon}
              </div>
              {!isCollapsed && item.label}
            </button>
          ))}
        </nav>
      </div>
      <div className={`flex-shrink-0 flex border-t border-gray-200 p-4 ${isCollapsed ? 'justify-center' : ''}`}>
        <button
          onClick={onLogout}
          className={`flex-shrink-0 group block flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 ${
            isCollapsed ? 'w-auto justify-center' : 'w-full'
          }`}
          title={isCollapsed ? "Logout" : ''}
        >
          <div className={`text-gray-400 group-hover:text-gray-500 ${isCollapsed ? '' : 'mr-3'}`}>
            <LogOut className="h-5 w-5" />
          </div>
          {!isCollapsed && "Logout"}
        </button>
      </div>
    </div>
  );
};

export default DashboardSidebar;
