import React from 'react';
import { 
  Building2, 
  UserRound, 
  Users, 
  ArrowRight, 
  FileText, 
  CheckCircle, 
  XCircle,
  Calendar,
  MessageSquare,
  Search,
  PlusCircle,
  Eye,
  Edit,
  UserCheck
} from 'lucide-react';

interface UserFlowDiagramProps {
  userType: 'company' | 'jobseeker' | 'recruiter';
}

const UserFlowDiagram: React.FC<UserFlowDiagramProps> = ({ userType }) => {
  const renderCompanyFlow = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold flex items-center">
        <Building2 className="text-blue-600 mr-2" />
        Hiring Company User Flow
      </h3>
      
      <div className="flex flex-wrap items-start justify-between">
        <div className="flow-step bg-blue-50 p-4 rounded-lg shadow w-64 mb-4">
          <h4 className="font-medium mb-2">1. Account Setup</h4>
          <ul className="text-sm space-y-2">
            <li className="flex items-start">
              <span className="bg-blue-200 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">1</span>
              <span>Register company account</span>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-200 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">2</span>
              <span>Complete company profile</span>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-200 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">3</span>
              <span>Add team members/recruiters</span>
            </li>
          </ul>
        </div>
        
        <ArrowRight className="transform rotate-0 md:rotate-0 text-blue-400 mx-2 self-center" />
        
        <div className="flow-step bg-blue-50 p-4 rounded-lg shadow w-64 mb-4">
          <h4 className="font-medium mb-2">2. Job Management</h4>
          <ul className="text-sm space-y-2">
            <li className="flex items-start">
              <span className="bg-blue-200 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">1</span>
              <span>Create job listings</span>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-200 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">2</span>
              <span>Set requirements & qualifications</span>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-200 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">3</span>
              <span>Publish & promote positions</span>
            </li>
          </ul>
        </div>
        
        <ArrowRight className="transform rotate-0 md:rotate-0 text-blue-400 mx-2 self-center" />
        
        <div className="flow-step bg-blue-50 p-4 rounded-lg shadow w-64 mb-4">
          <h4 className="font-medium mb-2">3. Candidate Review</h4>
          <ul className="text-sm space-y-2">
            <li className="flex items-start">
              <span className="bg-blue-200 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">1</span>
              <span>Review applications</span>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-200 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">2</span>
              <span>Shortlist candidates</span>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-200 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">3</span>
              <span>Schedule interviews</span>
            </li>
          </ul>
        </div>
        
        <ArrowRight className="transform rotate-0 md:rotate-0 text-blue-400 mx-2 self-center" />
        
        <div className="flow-step bg-blue-50 p-4 rounded-lg shadow w-64 mb-4">
          <h4 className="font-medium mb-2">4. Hiring Process</h4>
          <ul className="text-sm space-y-2">
            <li className="flex items-start">
              <span className="bg-blue-200 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">1</span>
              <span>Make job offers</span>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-200 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">2</span>
              <span>Negotiate terms</span>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-200 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">3</span>
              <span>Onboard new employees</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
  
  const renderJobSeekerFlow = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold flex items-center">
        <UserRound className="text-green-600 mr-2" />
        Job Seeker User Flow
      </h3>
      
      <div className="flex flex-wrap items-start justify-between">
        <div className="flow-step bg-green-50 p-4 rounded-lg shadow w-64 mb-4">
          <h4 className="font-medium mb-2">1. Profile Creation</h4>
          <ul className="text-sm space-y-2">
            <li className="flex items-start">
              <span className="bg-green-200 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">1</span>
              <span>Create user account</span>
            </li>
            <li className="flex items-start">
              <span className="bg-green-200 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">2</span>
              <span>Build professional profile</span>
            </li>
            <li className="flex items-start">
              <span className="bg-green-200 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">3</span>
              <span>Upload resume & documents</span>
            </li>
          </ul>
        </div>
        
        <ArrowRight className="transform rotate-0 md:rotate-0 text-green-400 mx-2 self-center" />
        
        <div className="flow-step bg-green-50 p-4 rounded-lg shadow w-64 mb-4">
          <h4 className="font-medium mb-2">2. Job Discovery</h4>
          <ul className="text-sm space-y-2">
            <li className="flex items-start">
              <span className="bg-green-200 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">1</span>
              <span>Search for jobs</span>
            </li>
            <li className="flex items-start">
              <span className="bg-green-200 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">2</span>
              <span>Filter by preferences</span>
            </li>
            <li className="flex items-start">
              <span className="bg-green-200 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">3</span>
              <span>Save interesting positions</span>
            </li>
          </ul>
        </div>
        
        <ArrowRight className="transform rotate-0 md:rotate-0 text-green-400 mx-2 self-center" />
        
        <div className="flow-step bg-green-50 p-4 rounded-lg shadow w-64 mb-4">
          <h4 className="font-medium mb-2">3. Application Process</h4>
          <ul className="text-sm space-y-2">
            <li className="flex items-start">
              <span className="bg-green-200 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">1</span>
              <span>Submit applications</span>
            </li>
            <li className="flex items-start">
              <span className="bg-green-200 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">2</span>
              <span>Customize cover letters</span>
            </li>
            <li className="flex items-start">
              <span className="bg-green-200 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">3</span>
              <span>Track application status</span>
            </li>
          </ul>
        </div>
        
        <ArrowRight className="transform rotate-0 md:rotate-0 text-green-400 mx-2 self-center" />
        
        <div className="flow-step bg-green-50 p-4 rounded-lg shadow w-64 mb-4">
          <h4 className="font-medium mb-2">4. Interview & Offers</h4>
          <ul className="text-sm space-y-2">
            <li className="flex items-start">
              <span className="bg-green-200 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">1</span>
              <span>Schedule interviews</span>
            </li>
            <li className="flex items-start">
              <span className="bg-green-200 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">2</span>
              <span>Receive & review offers</span>
            </li>
            <li className="flex items-start">
              <span className="bg-green-200 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">3</span>
              <span>Accept position</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
  
  const renderRecruiterFlow = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold flex items-center">
        <Users className="text-purple-600 mr-2" />
        Recruiter User Flow
      </h3>
      
      <div className="flex flex-wrap items-start justify-between">
        <div className="flow-step bg-purple-50 p-4 rounded-lg shadow w-64 mb-4">
          <h4 className="font-medium mb-2">1. Account & Setup</h4>
          <ul className="text-sm space-y-2">
            <li className="flex items-start">
              <span className="bg-purple-200 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">1</span>
              <span>Create recruiter account</span>
            </li>
            <li className="flex items-start">
              <span className="bg-purple-200 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">2</span>
              <span>Link to company</span>
            </li>
            <li className="flex items-start">
              <span className="bg-purple-200 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">3</span>
              <span>Set recruiting preferences</span>
            </li>
          </ul>
        </div>
        
        <ArrowRight className="transform rotate-0 md:rotate-0 text-purple-400 mx-2 self-center" />
        
        <div className="flow-step bg-purple-50 p-4 rounded-lg shadow w-64 mb-4">
          <h4 className="font-medium mb-2">2. Candidate Sourcing</h4>
          <ul className="text-sm space-y-2">
            <li className="flex items-start">
              <span className="bg-purple-200 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">1</span>
              <span>Search candidate database</span>
            </li>
            <li className="flex items-start">
              <span className="bg-purple-200 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">2</span>
              <span>Filter by skills & experience</span>
            </li>
            <li className="flex items-start">
              <span className="bg-purple-200 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">3</span>
              <span>Reach out to potential candidates</span>
            </li>
          </ul>
        </div>
        
        <ArrowRight className="transform rotate-0 md:rotate-0 text-purple-400 mx-2 self-center" />
        
        <div className="flow-step bg-purple-50 p-4 rounded-lg shadow w-64 mb-4">
          <h4 className="font-medium mb-2">3. Screening & Assessment</h4>
          <ul className="text-sm space-y-2">
            <li className="flex items-start">
              <span className="bg-purple-200 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">1</span>
              <span>Review applications</span>
            </li>
            <li className="flex items-start">
              <span className="bg-purple-200 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">2</span>
              <span>Conduct initial interviews</span>
            </li>
            <li className="flex items-start">
              <span className="bg-purple-200 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">3</span>
              <span>Evaluate candidate fit</span>
            </li>
          </ul>
        </div>
        
        <ArrowRight className="transform rotate-0 md:rotate-0 text-purple-400 mx-2 self-center" />
        
        <div className="flow-step bg-purple-50 p-4 rounded-lg shadow w-64 mb-4">
          <h4 className="font-medium mb-2">4. Hiring Pipeline</h4>
          <ul className="text-sm space-y-2">
            <li className="flex items-start">
              <span className="bg-purple-200 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">1</span>
              <span>Present candidates to hiring managers</span>
            </li>
            <li className="flex items-start">
              <span className="bg-purple-200 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">2</span>
              <span>Coordinate interview process</span>
            </li>
            <li className="flex items-start">
              <span className="bg-purple-200 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">3</span>
              <span>Facilitate job offers</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-6xl mx-auto overflow-x-auto">
      {userType === 'company' && renderCompanyFlow()}
      {userType === 'jobseeker' && renderJobSeekerFlow()}
      {userType === 'recruiter' && renderRecruiterFlow()}
    </div>
  );
};

export default UserFlowDiagram;
