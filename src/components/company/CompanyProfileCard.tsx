import React from 'react';
import { Building2, MapPin, Globe, Users, Calendar, Edit } from 'lucide-react';
import { Button } from '../ui/button';

interface CompanyProfileCardProps {
  company: any;
  onEditCompany: () => void;
}

const CompanyProfileCard: React.FC<CompanyProfileCardProps> = ({ company, onEditCompany }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Company Profile</h2>
        </div>
        
        <div className="flex items-center mb-6">
          <div className="flex-shrink-0 h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
            {company.logo_url ? (
              <img 
                src={company.logo_url} 
                alt={`${company.name} logo`} 
                className="h-full w-full object-contain"
              />
            ) : (
              <Building2 className="h-8 w-8 text-gray-400" />
            )}
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">{company.name}</h3>
            <p className="text-sm text-gray-500">{company.industry}</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-gray-500">Location</h3>
                <p className="mt-1 text-sm text-gray-900">{company.location || 'Not specified'}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Users className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-gray-500">Company Size</h3>
                <p className="mt-1 text-sm text-gray-900">{company.size || 'Not specified'}</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start">
              <Calendar className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-gray-500">Founded</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {company.founded_year || 'Not specified'}
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Globe className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-gray-500">Website</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {company.website ? (
                    <a 
                      href={company.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-800 hover:underline"
                    >
                      {company.website.replace(/^https?:\/\//, '')}
                    </a>
                  ) : (
                    'Not specified'
                  )}
                </p>
              </div>
            </div>
          </div>
          
          {company.description && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Description</h3>
              <p className="mt-1 text-sm text-gray-900">{company.description}</p>
            </div>
          )}
        </div>
        
        <div className="mt-5">
          <Button
            type="button"
            variant="outline"
            onClick={onEditCompany}
            className="inline-flex items-center"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Company
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfileCard;
