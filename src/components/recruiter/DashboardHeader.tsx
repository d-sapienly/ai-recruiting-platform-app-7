import React, { useState } from 'react';
import { 
  Bell, 
  MessageSquare, 
  User, 
  Settings, 
  LogOut, 
  Search,
  X
} from 'lucide-react';
import { Button } from '../ui/button';

interface DashboardHeaderProps {
  notificationsCount: number;
  messagesCount: number;
  onEditProfile: () => void;
  onOpenSettings: () => void;
  onOpenMessages: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  notificationsCount,
  messagesCount,
  onEditProfile,
  onOpenSettings,
  onOpenMessages
}) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    if (isProfileMenuOpen) setIsProfileMenuOpen(false);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
    if (isNotificationsOpen) setIsNotificationsOpen(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const handleMessagesClick = () => {
    onOpenMessages();
    if (isNotificationsOpen) setIsNotificationsOpen(false);
    if (isProfileMenuOpen) setIsProfileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Search bar */}
          <div className="flex-1 flex items-center justify-center px-2 lg:ml-6 lg:justify-start">
            <div className="max-w-lg w-full lg:max-w-xs relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Search..."
                type="search"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              {searchQuery && (
                <button
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={clearSearch}
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </div>
          </div>
          
          {/* Right side icons */}
          <div className="flex items-center">
            {/* Notifications */}
            <div className="relative ml-3">
              <button
                className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 relative"
                onClick={toggleNotifications}
              >
                <span className="sr-only">View notifications</span>
                <Bell className="h-6 w-6" />
                {notificationsCount > 0 && (
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
                )}
              </button>
              
              {/* Notifications dropdown */}
              {isNotificationsOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                  </div>
                  {notificationsCount > 0 ? (
                    <div className="max-h-96 overflow-y-auto">
                      {/* Notification items would go here */}
                      <div className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50">
                        <p className="text-sm font-medium text-gray-900">New application received</p>
                        <p className="text-xs text-gray-500 mt-1">John Smith applied for Software Engineer position</p>
                        <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                      </div>
                      <div className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50">
                        <p className="text-sm font-medium text-gray-900">Interview scheduled</p>
                        <p className="text-xs text-gray-500 mt-1">Interview with Sarah Johnson at 2:00 PM</p>
                        <p className="text-xs text-gray-400 mt-1">Yesterday</p>
                      </div>
                    </div>
                  ) : (
                    <div className="px-4 py-3 text-sm text-gray-500">
                      No new notifications
                    </div>
                  )}
                  <div className="px-4 py-2 border-t border-gray-100">
                    <a href="#" className="text-xs text-indigo-600 hover:text-indigo-500">View all notifications</a>
                  </div>
                </div>
              )}
            </div>
            
            {/* Messages */}
            <div className="relative ml-3">
              <button
                className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 relative"
                onClick={handleMessagesClick}
                aria-label="Open messages"
              >
                <span className="sr-only">View messages</span>
                <MessageSquare className="h-6 w-6" />
                {messagesCount > 0 && (
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
                )}
              </button>
            </div>
            
            {/* Profile dropdown */}
            <div className="relative ml-3">
              <button
                className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={toggleProfileMenu}
              >
                <span className="sr-only">View profile</span>
                <User className="h-6 w-6" />
              </button>
              
              {/* Profile menu dropdown */}
              {isProfileMenuOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                  <button
                    onClick={() => {
                      onEditProfile();
                      setIsProfileMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={() => {
                      onOpenSettings();
                      setIsProfileMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Settings
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
