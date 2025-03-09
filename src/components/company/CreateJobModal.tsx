import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select';
import { createJob } from '../../lib/supabaseClient';
import { getCurrentUser, getCompanyByUserId } from '../../lib/supabaseClient';

interface CreateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateJob: (jobData: JobFormData) => void;
}

export interface JobFormData {
  title: string;
  description: string;
  location: string;
  type: string;
  salary_min?: number | null;
  salary_max?: number | null;
  requirements: string;
  responsibilities: string;
  benefits: string;
  status: string;
  company_id?: string;
}

const CreateJobModal: React.FC<CreateJobModalProps> = ({
  isOpen,
  onClose,
  onCreateJob
}) => {
  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    description: '',
    location: '',
    type: 'full-time',
    salary_min: null,
    salary_max: null,
    requirements: '',
    responsibilities: '',
    benefits: '',
    status: 'draft'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [companyId, setCompanyId] = useState<string | null>(null);

  // Fetch the company ID when the modal opens
  useEffect(() => {
    const fetchCompanyId = async () => {
      try {
        const { data: { user } } = await getCurrentUser();
        
        if (user) {
          const { data: company } = await getCompanyByUserId(user.id);
          
          if (company) {
            setCompanyId(company.id);
          } else {
            console.error('No company found for this user');
          }
        }
      } catch (error) {
        console.error('Error fetching company ID:', error);
      }
    };

    if (isOpen) {
      fetchCompanyId();
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle salary fields specifically
    if (name === 'salary_min' || name === 'salary_max') {
      // Convert to number or null if empty
      const numValue = value === '' ? null : Number(value);
      
      setFormData(prev => ({
        ...prev,
        [name]: numValue
      }));
      
      // Validate salary range immediately
      validateSalaryRange(name, numValue, name === 'salary_min' ? formData.salary_max : formData.salary_min);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      
      // Clear error when field is edited
      if (errors[name]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    }
  };

  const validateSalaryRange = (
    changedField: string, 
    changedValue: number | null, 
    otherValue: number | null
  ) => {
    const newErrors = { ...errors };
    
    // Clear existing salary errors
    delete newErrors.salary_min;
    delete newErrors.salary_max;
    
    // Only validate if both values are present
    if (changedValue !== null && otherValue !== null) {
      if (changedField === 'salary_min' && changedValue > otherValue) {
        newErrors.salary_min = 'Minimum salary cannot be greater than maximum salary';
      } else if (changedField === 'salary_max' && changedValue < otherValue) {
        newErrors.salary_max = 'Maximum salary cannot be less than minimum salary';
      }
    }
    
    // Validate that salaries are positive
    if (changedValue !== null && changedValue <= 0) {
      newErrors[changedField] = 'Salary must be greater than zero';
    }
    
    setErrors(newErrors);
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Required fields validation
    if (!formData.title.trim()) {
      newErrors.title = 'Job title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Job description is required';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    // Salary validation
    if (formData.salary_min !== null && formData.salary_min <= 0) {
      newErrors.salary_min = 'Minimum salary must be greater than zero';
    }
    
    if (formData.salary_max !== null && formData.salary_max <= 0) {
      newErrors.salary_max = 'Maximum salary must be greater than zero';
    }
    
    if (formData.salary_min !== null && formData.salary_max !== null) {
      if (formData.salary_min > formData.salary_max) {
        newErrors.salary_min = 'Minimum salary cannot be greater than maximum salary';
      }
    }
    
    // Company ID validation
    if (!companyId) {
      newErrors.company = 'Unable to determine company. Please try again later.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        // Add company ID to the form data
        const jobDataWithCompany = {
          ...formData,
          company_id: companyId as string
        };
        
        // Save to Supabase
        const { data, error } = await createJob(jobDataWithCompany);
        
        if (error) {
          console.error('Error creating job:', error);
          setErrors(prev => ({
            ...prev,
            submit: error.message || 'Failed to create job. Please try again.'
          }));
        } else {
          // Call the onCreateJob callback with the created job
          onCreateJob(jobDataWithCompany);
          onClose();
        }
      } catch (error: any) {
        console.error('Unexpected error creating job:', error);
        setErrors(prev => ({
          ...prev,
          submit: error.message || 'An unexpected error occurred. Please try again.'
        }));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handlePublish = async () => {
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        // Add company ID and set status to active
        const jobDataWithCompany = {
          ...formData,
          status: 'active',
          company_id: companyId as string
        };
        
        // Save to Supabase
        const { data, error } = await createJob(jobDataWithCompany);
        
        if (error) {
          console.error('Error publishing job:', error);
          setErrors(prev => ({
            ...prev,
            submit: error.message || 'Failed to publish job. Please try again.'
          }));
        } else {
          // Call the onCreateJob callback with the created job
          onCreateJob(jobDataWithCompany);
          onClose();
        }
      } catch (error: any) {
        console.error('Unexpected error publishing job:', error);
        setErrors(prev => ({
          ...prev,
          submit: error.message || 'An unexpected error occurred. Please try again.'
        }));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Job Posting</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Job Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Job Title <span className="text-red-500">*</span></Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Senior Software Engineer"
              className={errors.title ? "border-red-500" : ""}
              disabled={isSubmitting}
            />
            {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
          </div>
          
          {/* Job Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Job Description <span className="text-red-500">*</span></Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide a detailed description of the job..."
              rows={4}
              className={errors.description ? "border-red-500" : ""}
              disabled={isSubmitting}
            />
            {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
          </div>
          
          {/* Location and Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location <span className="text-red-500">*</span></Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. San Francisco, CA or Remote"
                className={errors.location ? "border-red-500" : ""}
                disabled={isSubmitting}
              />
              {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Job Type</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => handleSelectChange(value, 'type')}
                disabled={isSubmitting}
              >
                <SelectTrigger className={errors.type ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                  <SelectItem value="temporary">Temporary</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Salary Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="salary_min">Minimum Salary (Optional)</Label>
              <Input
                id="salary_min"
                name="salary_min"
                type="number"
                value={formData.salary_min === null ? '' : formData.salary_min}
                onChange={handleChange}
                placeholder="e.g. 80000"
                className={errors.salary_min ? "border-red-500" : ""}
                min="0"
                disabled={isSubmitting}
              />
              {errors.salary_min && <p className="text-red-500 text-sm">{errors.salary_min}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="salary_max">Maximum Salary (Optional)</Label>
              <Input
                id="salary_max"
                name="salary_max"
                type="number"
                value={formData.salary_max === null ? '' : formData.salary_max}
                onChange={handleChange}
                placeholder="e.g. 120000"
                className={errors.salary_max ? "border-red-500" : ""}
                min="0"
                disabled={isSubmitting}
              />
              {errors.salary_max && <p className="text-red-500 text-sm">{errors.salary_max}</p>}
            </div>
          </div>
          
          {/* Requirements */}
          <div className="space-y-2">
            <Label htmlFor="requirements">Requirements</Label>
            <Textarea
              id="requirements"
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              placeholder="List the requirements for this position..."
              rows={3}
              disabled={isSubmitting}
            />
          </div>
          
          {/* Responsibilities */}
          <div className="space-y-2">
            <Label htmlFor="responsibilities">Responsibilities</Label>
            <Textarea
              id="responsibilities"
              name="responsibilities"
              value={formData.responsibilities}
              onChange={handleChange}
              placeholder="List the key responsibilities for this position..."
              rows={3}
              disabled={isSubmitting}
            />
          </div>
          
          {/* Benefits */}
          <div className="space-y-2">
            <Label htmlFor="benefits">Benefits</Label>
            <Textarea
              id="benefits"
              name="benefits"
              value={formData.benefits}
              onChange={handleChange}
              placeholder="List the benefits offered with this position..."
              rows={3}
              disabled={isSubmitting}
            />
          </div>
          
          {/* Error message */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {errors.submit}
            </div>
          )}
          
          {/* Company error */}
          {errors.company && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {errors.company}
            </div>
          )}
          
          <DialogFooter className="flex justify-between sm:justify-between">
            <div>
              <Button type="button" variant="outline" onClick={onClose} className="mr-2" disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" variant="secondary" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save as Draft'}
              </Button>
            </div>
            <Button type="button" onClick={handlePublish} disabled={isSubmitting}>
              {isSubmitting ? 'Publishing...' : 'Publish Job'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateJobModal;
