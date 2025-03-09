import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { 
  createJobSeekerProfile, 
  getCurrentUser, 
  supabase,
  checkJobSeekerProfileExists
} from '../lib/supabaseClient';
import { parseResume } from '../lib/resumeParser';
import { Loader2, Upload, CheckCircle2, AlertCircle } from 'lucide-react';

const JobSeekerRegistration: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeUploading, setResumeUploading] = useState(false);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [isParsingResume, setIsParsingResume] = useState(false);
  const [parsedData, setParsedData] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [profileChecked, setProfileChecked] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    headline: '',
    yearsOfExperience: 0,
    educationLevel: '',
    currentPosition: '',
    currentCompany: '',
    skills: [] as string[],
    preferredJobTypes: [] as string[],
    preferredLocations: [] as string[],
    bio: '',
    isActivelyLooking: true,
  });

  // Check if user is authenticated and get user ID
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Only run this once
        if (profileChecked) return;
        
        const { data, error } = await getCurrentUser();
        
        if (error) {
          throw error;
        }
        
        if (!data.user) {
          // Redirect to login if not authenticated
          navigate('/');
          return;
        }
        
        setUserId(data.user.id);
        
        // Check if profile already exists
        const { exists, error: profileError } = await checkJobSeekerProfileExists(data.user.id);
        
        if (profileError) {
          console.error('Error checking profile:', profileError);
          return;
        }
        
        setProfileChecked(true);
        
        if (exists) {
          // Redirect to dashboard if profile already exists
          navigate('/job-seeker/dashboard');
        }
      } catch (err) {
        console.error('Authentication error:', err);
        navigate('/');
      }
    };
    
    checkAuth();
  }, [navigate, profileChecked]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skills = e.target.value.split(',').map(skill => skill.trim());
    setFormData({
      ...formData,
      skills,
    });
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    setResumeFile(file);
    setResumeUploading(true);
    setError(null);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;
      
      // Upload to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('job-seeker-resumes-bucket')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('job-seeker-resumes-bucket')
        .getPublicUrl(filePath);
      
      setResumeUrl(urlData.publicUrl);
      setSuccess('Resume uploaded successfully!');
      
      // Parse resume
      setIsParsingResume(true);
      const parsed = await parseResume(urlData.publicUrl);
      setParsedData(parsed);
      
      // Pre-fill form with parsed data if available
      if (parsed) {
        setFormData(prevData => ({
          ...prevData,
          headline: parsed.headline || prevData.headline,
          currentPosition: parsed.currentPosition || prevData.currentPosition,
          currentCompany: parsed.currentCompany || prevData.currentCompany,
          yearsOfExperience: parsed.yearsOfExperience || prevData.yearsOfExperience,
          educationLevel: parsed.educationLevel || prevData.educationLevel,
          skills: parsed.skills || prevData.skills,
        }));
      }
    } catch (err: any) {
      console.error('Resume upload error:', err);
      setError(err.message || 'Failed to upload resume');
    } finally {
      setResumeUploading(false);
      setIsParsingResume(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    
    if (!userId) {
      setError('User authentication error. Please try logging in again.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Create job seeker profile
      const jobSeekerData = {
        user_id: userId,
        headline: formData.headline,
        years_of_experience: formData.yearsOfExperience,
        education_level: formData.educationLevel,
        current_position: formData.currentPosition,
        current_company: formData.currentCompany,
        resume_url: resumeUrl,
        is_actively_looking: formData.isActivelyLooking,
        skills: formData.skills,
        preferred_job_types: formData.preferredJobTypes,
        preferred_locations: formData.preferredLocations,
        bio: formData.bio
      };
      
      console.log('Submitting job seeker profile:', jobSeekerData);
      
      const { data, error } = await createJobSeekerProfile(jobSeekerData);
      
      if (error) {
        console.error('Profile creation error details:', error);
        throw error;
      }
      
      console.log('Profile created successfully:', data);
      
      // Set success message
      setSuccess('Profile created successfully! Redirecting to dashboard...');
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate('/job-seeker/dashboard');
      }, 1500);
    } catch (err: any) {
      console.error('Profile creation error:', err);
      setError(err.message || 'Failed to create profile');
    } finally {
      setIsLoading(false);
    }
  };

  // If no userId yet, show loading
  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
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
              <h2 className="text-3xl font-extrabold text-gray-900">Complete Your Profile</h2>
              <p className="mt-2 text-sm text-gray-600">
                Let's set up your job seeker profile to help you find the perfect job match
              </p>
            </div>
            
            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div 
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        step >= i ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {i}
                    </div>
                    <div className="text-xs mt-2 text-gray-500">
                      {i === 1 ? 'Resume' : i === 2 ? 'Basic Info' : 'Preferences'}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-600 transition-all duration-300"
                  style={{ width: `${((step - 1) / 2) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <form onSubmit={handleSubmit}>
              {/* Step 1: Resume Upload */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    {!resumeFile ? (
                      <>
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-4 flex text-sm text-gray-600 justify-center">
                          <label
                            htmlFor="resume-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                          >
                            <span>Upload your resume</span>
                            <input
                              id="resume-upload"
                              name="resume-upload"
                              type="file"
                              className="sr-only"
                              accept=".pdf,.doc,.docx"
                              onChange={handleResumeUpload}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          PDF, DOC, or DOCX up to 10MB
                        </p>
                      </>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center justify-center">
                          {resumeUploading ? (
                            <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
                          ) : (
                            <CheckCircle2 className="h-8 w-8 text-green-500" />
                          )}
                        </div>
                        <p className="text-sm font-medium">{resumeFile.name}</p>
                        {resumeUrl && (
                          <p className="text-xs text-green-600">
                            Resume uploaded successfully!
                          </p>
                        )}
                        {isParsingResume && (
                          <div className="text-sm text-indigo-600 flex items-center justify-center">
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Analyzing your resume...
                          </div>
                        )}
                        {parsedData && (
                          <p className="text-xs text-green-600">
                            Resume analyzed! We've pre-filled some information for you.
                          </p>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setResumeFile(null);
                            setResumeUrl(null);
                          }}
                          className="text-xs text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {error && (
                    <div className="text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {error}
                    </div>
                  )}
                  
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      onClick={() => setStep(2)}
                      disabled={resumeUploading}
                    >
                      {resumeUploading ? 'Uploading...' : 'Continue'}
                    </Button>
                  </div>
                </motion.div>
              )}
              
              {/* Step 2: Basic Information */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="headline">Professional Headline</Label>
                      <Input
                        id="headline"
                        name="headline"
                        value={formData.headline}
                        onChange={handleInputChange}
                        placeholder="e.g. Senior Software Engineer with 5+ years experience"
                        className="mt-1"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="currentPosition">Current Position</Label>
                        <Input
                          id="currentPosition"
                          name="currentPosition"
                          value={formData.currentPosition}
                          onChange={handleInputChange}
                          placeholder="e.g. Software Engineer"
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="currentCompany">Current Company</Label>
                        <Input
                          id="currentCompany"
                          name="currentCompany"
                          value={formData.currentCompany}
                          onChange={handleInputChange}
                          placeholder="e.g. Acme Inc."
                          className="mt-1"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                        <Input
                          id="yearsOfExperience"
                          name="yearsOfExperience"
                          type="number"
                          min="0"
                          max="50"
                          value={formData.yearsOfExperience}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="educationLevel">Education Level</Label>
                        <Select
                          value={formData.educationLevel}
                          onValueChange={(value) => handleSelectChange('educationLevel', value)}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select education level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high_school">High School</SelectItem>
                            <SelectItem value="associate">Associate Degree</SelectItem>
                            <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                            <SelectItem value="master">Master's Degree</SelectItem>
                            <SelectItem value="phd">PhD or Doctorate</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="skills">Skills (comma separated)</Label>
                      <Input
                        id="skills"
                        name="skills"
                        value={formData.skills.join(', ')}
                        onChange={handleSkillsChange}
                        placeholder="e.g. JavaScript, React, Node.js"
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="bio">Professional Bio</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        placeholder="Tell us about your professional background and career goals"
                        className="mt-1"
                        rows={4}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(1)}
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setStep(3)}
                    >
                      Continue
                    </Button>
                  </div>
                </motion.div>
              )}
              
              {/* Step 3: Preferences */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <div>
                      <Label>Preferred Job Types</Label>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        {['full-time', 'part-time', 'contract', 'internship', 'temporary'].map((type) => (
                          <div key={type} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`job-type-${type}`}
                              checked={formData.preferredJobTypes.includes(type)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFormData({
                                    ...formData,
                                    preferredJobTypes: [...formData.preferredJobTypes, type],
                                  });
                                } else {
                                  setFormData({
                                    ...formData,
                                    preferredJobTypes: formData.preferredJobTypes.filter(t => t !== type),
                                  });
                                }
                              }}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <label htmlFor={`job-type-${type}`} className="ml-2 block text-sm text-gray-700 capitalize">
                              {type.replace('-', ' ')}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="preferredLocations">Preferred Locations (comma separated)</Label>
                      <Input
                        id="preferredLocations"
                        name="preferredLocations"
                        value={formData.preferredLocations.join(', ')}
                        onChange={(e) => {
                          const locations = e.target.value.split(',').map(loc => loc.trim());
                          setFormData({
                            ...formData,
                            preferredLocations: locations,
                          });
                        }}
                        placeholder="e.g. New York, Remote, San Francisco"
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <div className="flex items-center">
                        <input
                          id="isActivelyLooking"
                          name="isActivelyLooking"
                          type="checkbox"
                          checked={formData.isActivelyLooking}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              isActivelyLooking: e.target.checked,
                            });
                          }}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="isActivelyLooking" className="ml-2 block text-sm text-gray-700">
                          I am actively looking for a job
                        </label>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        This will make your profile more visible to recruiters
                      </p>
                    </div>
                  </div>
                  
                  {error && (
                    <div className="text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {error}
                    </div>
                  )}
                  
                  {success && (
                    <div className="text-sm text-green-600 flex items-center">
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      {success}
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(2)}
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating Profile...
                        </>
                      ) : (
                        'Complete Profile'
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

export default JobSeekerRegistration;
