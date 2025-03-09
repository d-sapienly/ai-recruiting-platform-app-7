import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { updateRecruiterProfile } from '../../lib/supabaseClient';

interface EditRecruiterModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: any;
  onProfileUpdated: () => void;
}

const EditRecruiterModal: React.FC<EditRecruiterModalProps> = ({
  isOpen,
  onClose,
  profile,
  onProfileUpdated,
}) => {
  const [formData, setFormData] = useState({
    bio: '',
    years_of_experience: '',
    specializations: [] as string[],
    position: '',
    department: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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

  // Initialize form data when profile changes or modal opens
  useEffect(() => {
    if (profile && isOpen) {
      setFormData({
        bio: profile.bio || '',
        years_of_experience: profile.years_of_experience?.toString() || '',
        specializations: profile.specializations || [],
        position: profile.position || '',
        department: profile.department || '',
      });
      setError(null);
      setSuccess(null);
    }
  }, [profile, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      // Prepare update data
      const updateData = {
        id: profile.id,
        bio: formData.bio,
        years_of_experience: formData.years_of_experience ? parseInt(formData.years_of_experience) : null,
        specializations: formData.specializations.length > 0 ? formData.specializations : null,
        position: formData.position,
        department: formData.department || null,
      };

      // Update profile
      const { data, error } = await updateRecruiterProfile(updateData);

      if (error) {
        throw error;
      }

      setSuccess('Profile updated successfully!');
      
      // Notify parent component
      setTimeout(() => {
        onProfileUpdated();
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Recruiter Profile</DialogTitle>
          <DialogDescription>
            Update your professional information and specializations
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-50 rounded-md flex items-start">
              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
              <p className="text-sm text-green-700">{success}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                placeholder="e.g., Senior Technical Recruiter"
                disabled={isLoading}
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
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="bio">Professional Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tell us about your recruiting experience and expertise..."
                className="h-24"
                disabled={isLoading}
              />
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
                disabled={isLoading}
              />
            </div>

            <div>
              <Label>Specializations</Label>
              <div className="mt-2 grid grid-cols-2 gap-2">
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
                      disabled={isLoading}
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
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
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

export default EditRecruiterModal;
