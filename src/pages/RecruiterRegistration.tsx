import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle2, AlertCircle, Building, Briefcase, Users, Award } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select } from '../components/ui/select';
import { getCurrentUser, createRecruiterProfile, getCompanies } from '../lib/supabaseClient';
import { Company } from '../types';

const RecruiterRegistration: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    bio: '',
    years_of_experience: '',
    specializations: [] as string[],
    is_agency: false,
    company_id: '',
    company_name: '',
    position: '',
    department: '',
    new_company: false
  });
  
  // Specialization options
  const specializationOptions = [
    'Technical Recruiting',
    'Executive Search',
    'Healthcare',
    'Finance',
    'IT',
    'Sales',
    'Marketing',
    'Engineering',
    'Legal',
    'HR',
    'Education'
  ];
  
  // Fetch user data and companies on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await getCurrentUser();
        
        if (error || !data.user) {
          console.error('Authentication error:', error);
          navigate('/');
          return;
        }
        
        // Check if user role is recruiter
        const userRole = data.user.user_metadata?.role;
        if (userRole !== 'recruiter') {
          setError('You must be registered as a recruiter to access this page');
          setTimeout(() => navigate('/'), 3000);
          return;
        }
        
        // Fetch companies
        fetchCompanies();
      } catch (err: any) {
        console.error('Error checking authentication:', err);
        setError(err.message || 'Authentication error');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  const fetchCompanies = async () => {
    try {
      setLoadingCompanies(true);
      const { data, error } = await getCompanies();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setCompanies(data);
      }
    } catch (err: any) {
      console.error('Error fetching companies:', err);
      setError('Failed to load companies. Please try again.');
    } finally {
      setLoadingCompanies(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleSpecializationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      specializations: checked
        ? [...prev.specializations, value]
        : prev.specializations.filter(spec => spec !== value)
    }));
  };
  
  const handleCompanyTypeChange = (isNewCompany: boolean) => {
    setFormData(prev => ({
      ...prev,
      new_company: isNewCompany,
      company_id: isNewCompany ? '' : prev.company_id
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);
    
    try {
      // Get current user
      const { data: userData, error: userError } = await getCurrentUser();
      
      if (userError || !userData.user) {
        throw new Error('User authentication error');
      }
      
      // Prepare recruiter data
      const recruiterData = {
        user_id: userData.user.id,
        bio: formData.bio,
        years_of_experience: formData.years_of_experience ? parseInt(formData.years_of_experience) : null,
        specializations: formData.specializations.length > 0 ? formData.specializations : null,
        is_agency: formData.is_agency,
        company_id: formData.company_id || null,
        position: formData.position,
        department: formData.department || null
      };
      
      // Create recruiter profile
      const { data, error } = await createRecruiterProfile(recruiterData);
      
      if (error) {
        throw error;
      }
      
      setSuccess('Recruiter profile created successfully!');
      
      // Redirect to dashboard after short delay
      setTimeout(() => {
        navigate('/recruiter/dashboard');
      }, 1500);
    } catch (err: any) {
      console.error('Error creating recruiter profile:', err);
      setError(err.message || 'Failed to create recruiter profile');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const nextStep = () => {
    setStep(step + 1);
    window.scrollTo(0, 0);
  };
  
  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-indigo-500 animate-spin" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="px-4 py-5 sm:p-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Complete Your Recruiter Profile</h1>
              <p className="mt-2 text-gray-600">
                Set up your profile to start connecting with top talent
              </p>
              
              {/* Progress indicator */}
              <div className="mt-6 flex justify-center">
                <ol className="flex items-center space-x-5">
                  {[1, 2, 3].map((i) => (
                    <li key={i} className="flex items-center">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          step >= i
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {step > i ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <span>{i}</span>
                        )}
                      </div>
                      {i < 3 && (
                        <div
                          className={`ml-4 h-0.5 w-10 ${
                            step > i ? 'bg-indigo-600' : 'bg-gray-200'
                          }`}
                        ></div>
                      )}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 rounded-md flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            
            {success && (
              <div className="mb-6 p-4 bg-green-50 rounded-md flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                <p className="text-sm text-green-700">{success}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              {/* Step 1: Basic Information */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="bio">Professional Bio</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        placeholder="Tell us about your recruiting experience and expertise..."
                        className="mt-1 h-32"
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        This will be visible to job seekers and companies
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="years_of_experience">Years of Experience</Label>
                      <Input
                        id="years_of_experience"
                        name="years_of_experience"
                        type="number"
                        min="0"
                        max="50"
                        value={formData.years_of_experience}
                        onChange={handleInputChange}
                        placeholder="e.g., 5"
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label>Recruiter Type</Label>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center">
                          <input
                            id="company_recruiter"
                            name="is_agency"
                            type="radio"
                            checked={!formData.is_agency}
                            onChange={() => setFormData(prev => ({ ...prev, is_agency: false }))}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                          />
                          <label htmlFor="company_recruiter" className="ml-2 block text-sm text-gray-700">
                            In-house Recruiter (I work for a specific company)
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="agency_recruiter"
                            name="is_agency"
                            type="radio"
                            checked={formData.is_agency}
                            onChange={() => setFormData(prev => ({ ...prev, is_agency: true }))}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                          />
                          <label htmlFor="agency_recruiter" className="ml-2 block text-sm text-gray-700">
                            Agency Recruiter (I work with multiple companies)
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="button" onClick={nextStep}>
                      Next Step
                    </Button>
                  </div>
                </motion.div>
              )}
              
              {/* Step 2: Specializations */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-semibold text-gray-900">Specializations</h2>
                  <p className="text-sm text-gray-600">
                    Select the areas you specialize in as a recruiter
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {specializationOptions.map((specialization) => (
                      <div key={specialization} className="flex items-center">
                        <input
                          id={`specialization-${specialization}`}
                          name="specializations"
                          type="checkbox"
                          value={specialization}
                          checked={formData.specializations.includes(specialization)}
                          onChange={handleSpecializationChange}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 rounded"
                        />
                        <label
                          htmlFor={`specialization-${specialization}`}
                          className="ml-2 block text-sm text-gray-700"
                        >
                          {specialization}
                        </label>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={prevStep}>
                      Previous
                    </Button>
                    <Button type="button" onClick={nextStep}>
                      Next Step
                    </Button>
                  </div>
                </motion.div>
              )}
              
              {/* Step 3: Company Information */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-semibold text-gray-900">Company Information</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="position">Your Position</Label>
                      <Input
                        id="position"
                        name="position"
                        value={formData.position}
                        onChange={handleInputChange}
                        placeholder="e.g., Senior Technical Recruiter"
                        className="mt-1"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="department">Department (Optional)</Label>
                      <Input
                        id="department"
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        placeholder="e.g., Human Resources"
                        className="mt-1"
                      />
                    </div>
                    
                    {!formData.is_agency && (
                      <div className="space-y-4">
                        <div>
                          <Label>Company Selection</Label>
                          <div className="mt-2 space-y-2">
                            <div className="flex items-center">
                              <input
                                id="existing_company"
                                name="company_type"
                                type="radio"
                                checked={!formData.new_company}
                                onChange={() => handleCompanyTypeChange(false)}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                              />
                              <label htmlFor="existing_company" className="ml-2 block text-sm text-gray-700">
                                Select an existing company
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                id="new_company"
                                name="company_type"
                                type="radio"
                                checked={formData.new_company}
                                onChange={() => handleCompanyTypeChange(true)}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                              />
                              <label htmlFor="new_company" className="ml-2 block text-sm text-gray-700">
                                My company isn't listed
                              </label>
                            </div>
                          </div>
                        </div>
                        
                        {!formData.new_company ? (
                          <div>
                            <Label htmlFor="company_id">Select Company</Label>
                            <select
                              id="company_id"
                              name="company_id"
                              value={formData.company_id}
                              onChange={handleInputChange}
                              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                              required={!formData.new_company && !formData.is_agency}
                            >
                              <option value="">Select a company</option>
                              {loadingCompanies ? (
                                <option disabled>Loading companies...</option>
                              ) : (
                                companies.map((company) => (
                                  <option key={company.id} value={company.id}>
                                    {company.name}
                                  </option>
                                ))
                              )}
                            </select>
                          </div>
                        ) : (
                          <div>
                            <Label htmlFor="company_name">Company Name</Label>
                            <Input
                              id="company_name"
                              name="company_name"
                              value={formData.company_name}
                              onChange={handleInputChange}
                              placeholder="Enter your company name"
                              className="mt-1"
                              required={formData.new_company && !formData.is_agency}
                            />
                            <p className="mt-1 text-sm text-gray-500">
                              You'll need to register your company separately after completing your profile
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={prevStep}>
                      Previous
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating Profile...
                        </>
                      ) : (
                        'Complete Registration'
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RecruiterRegistration;
