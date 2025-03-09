import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { updateJobSeekerProfile, supabase } from '../../lib/supabaseClient';
import { parseResume } from '../../lib/resumeParser';
import { Loader2, CheckCircle2, AlertCircle, Upload, FileText, X } from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: any;
  onProfileUpdated: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ 
  isOpen, 
  onClose, 
  profile,
  onProfileUpdated
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeUploading, setResumeUploading] = useState(false);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [isParsingResume, setIsParsingResume] = useState(false);
  const [currentResumeUrl, setCurrentResumeUrl] = useState<string | null>(null);
  const [currentResumeFilename, setCurrentResumeFilename] = useState<string | null>(null);
  
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

  // Initialize form with profile data
  useEffect(() => {
    if (profile) {
      setFormData({
        headline: profile.headline || '',
        yearsOfExperience: profile.years_of_experience || 0,
        educationLevel: profile.education_level || '',
        currentPosition: profile.current_position || '',
        currentCompany: profile.current_company || '',
        skills: profile.skills || [],
        preferredJobTypes: profile.preferred_job_types || [],
        preferredLocations: profile.preferred_locations || [],
        bio: profile.bio || '',
        isActivelyLooking: profile.is_actively_looking,
      });
      
      // Set current resume URL if available
      if (profile.resume_url) {
        setCurrentResumeUrl(profile.resume_url);
        // Extract filename from URL
        const filename = profile.resume_url.split('/').pop()?.split('?')[0];
        if (filename) {
          // Remove user ID prefix and timestamp
          const cleanFilename = filename.split('-').slice(1).join('-');
          setCurrentResumeFilename(cleanFilename);
        }
      }
    }
  }, [profile]);

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
    if (!file || !profile?.user_id) return;

    setResumeFile(file);
    setResumeUploading(true);
    setError(null);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${profile.user_id}-${Date.now()}.${fileExt}`;
      const filePath = `${profile.user_id}/${fileName}`;
      
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
        
        setSuccess('Resume analyzed! We\'ve updated some information based on your resume.');
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
    
    if (!profile?.id) {
      setError('Profile ID not found');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Update job seeker profile
      const jobSeekerData = {
        id: profile.id,
        headline: formData.headline,
        years_of_experience: formData.yearsOfExperience,
        education_level: formData.educationLevel,
        current_position: formData.currentPosition,
        current_company: formData.currentCompany,
        is_actively_looking: formData.isActivelyLooking,
        skills: formData.skills,
        preferred_job_types: formData.preferredJobTypes,
        preferred_locations: formData.preferredLocations,
        bio: formData.bio,
        // Only update resume_url if a new resume was uploaded
        ...(resumeUrl && { resume_url: resumeUrl })
      };
      
      const { data, error } = await updateJobSeekerProfile(jobSeekerData);
      
      if (error) {
        throw error;
      }
      
      // Set success message
      setSuccess('Profile updated successfully!');
      
      // Notify parent component
      onProfileUpdated();
      
      // Close modal after a short delay
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error('Profile update error:', err);
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Your Profile</DialogTitle>
          <DialogDescription>
            Update your professional information to improve your job matches
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex border-b mb-4">
          <button
            className={`px-4 py-2 ${activeTab === 'basic' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('basic')}
          >
            Basic Info
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'resume' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('resume')}
          >
            Resume
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'preferences' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('preferences')}
          >
            Preferences
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          {activeTab === 'basic' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
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
            </motion.div>
          )}
          
          {activeTab === 'resume' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {currentResumeUrl && !resumeFile && (
                <div className="p-4 border border-gray-200 rounded-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="h-8 w-8 text-indigo-500 mr-3" />
                      <div>
                        <h3 className="text-sm font-medium">Current Resume</h3>
                        <p className="text-xs text-gray-500">{currentResumeFilename}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(currentResumeUrl, '_blank')}
                      >
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {!resumeFile ? (
                  <>
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4 flex text-sm text-gray-600 justify-center">
                      <label
                        htmlFor="resume-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                      >
                        <span>{currentResumeUrl ? 'Upload a new resume' : 'Upload your resume'}</span>
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
              
              <div className="text-sm text-gray-500">
                <p>Uploading a new resume will:</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>Replace your current resume</li>
                  <li>Analyze your skills and experience</li>
                  <li>Update your profile information (you can review before saving)</li>
                </ul>
              </div>
            </motion.div>
          )}
          
          {activeTab === 'preferences' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
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
            </motion.div>
          )}
          
          {error && (
            <div className="text-sm text-red-600 flex items-center mt-4">
              <AlertCircle className="h-4 w-4 mr-1" />
              {error}
            </div>
          )}
          
          {success && (
            <div className="text-sm text-green-600 flex items-center mt-4">
              <CheckCircle2 className="h-4 w-4 mr-1" />
              {success}
            </div>
          )}
          
          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;
