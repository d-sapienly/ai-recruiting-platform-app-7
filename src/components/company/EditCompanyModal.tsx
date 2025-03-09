import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select } from '../ui/select';
import { supabase } from '../../lib/supabaseClient';

interface Company {
  id: string;
  name: string;
  description: string;
  industry: string;
  size: string;
  founded_year: number;
  website: string;
  logo_url: string;
  location: string;
}

interface EditCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: string | null;
  onCompanyUpdated: () => void;
}

const companySizes = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'];
const industries = [
  'Technology', 'Healthcare', 'Finance', 'Education', 'Retail', 
  'Manufacturing', 'Media', 'Transportation', 'Construction', 'Other'
];

const EditCompanyModal: React.FC<EditCompanyModalProps> = ({ 
  isOpen, 
  onClose, 
  companyId,
  onCompanyUpdated
}) => {
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && companyId) {
      fetchCompanyData();
    } else {
      setCompany(null);
      setLogoPreview(null);
      setLogoFile(null);
      setError(null);
    }
  }, [isOpen, companyId]);

  const fetchCompanyData = async () => {
    if (!companyId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', companyId)
        .single();
      
      if (error) {
        throw error;
      }
      
      setCompany(data);
      if (data.logo_url) {
        setLogoPreview(data.logo_url);
      }
    } catch (err: any) {
      console.error('Error fetching company:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCompany(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Upload logo if changed
      let logoUrl = company.logo_url;
      if (logoFile && companyId) {
        const fileExt = logoFile.name.split('.').pop();
        const filePath = `${companyId}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('company-logos-bucket')
          .upload(filePath, logoFile);
          
        if (uploadError) {
          throw uploadError;
        }
        
        const { data } = supabase.storage
          .from('company-logos-bucket')
          .getPublicUrl(filePath);
          
        logoUrl = data.publicUrl;
      }
      
      // Update company data
      const { error: updateError } = await supabase
        .from('companies')
        .update({
          ...company,
          logo_url: logoUrl,
          updated_at: new Date()
        })
        .eq('id', companyId);
        
      if (updateError) {
        throw updateError;
      }
      
      onCompanyUpdated();
      onClose();
    } catch (err: any) {
      console.error('Error updating company:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Company Profile</DialogTitle>
        </DialogHeader>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {isLoading && !company ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Company Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={company?.name || ''}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="industry" className="text-right">Industry</Label>
                <select
                  id="industry"
                  name="industry"
                  value={company?.industry || ''}
                  onChange={handleInputChange}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="">Select Industry</option>
                  {industries.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="size" className="text-right">Company Size</Label>
                <select
                  id="size"
                  name="size"
                  value={company?.size || ''}
                  onChange={handleInputChange}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="">Select Size</option>
                  {companySizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="founded_year" className="text-right">Founded Year</Label>
                <Input
                  id="founded_year"
                  name="founded_year"
                  type="number"
                  min="1800"
                  max={new Date().getFullYear()}
                  value={company?.founded_year || ''}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="website" className="text-right">Website</Label>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  value={company?.website || ''}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="https://example.com"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location" className="text-right">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={company?.location || ''}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="City, Country"
                />
              </div>
              
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right pt-2">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={company?.description || ''}
                  onChange={handleInputChange}
                  className="col-span-3"
                  rows={4}
                />
              </div>
              
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="logo" className="text-right pt-2">Company Logo</Label>
                <div className="col-span-3">
                  {logoPreview && (
                    <div className="mb-2">
                      <img 
                        src={logoPreview} 
                        alt="Company logo preview" 
                        className="h-20 w-auto object-contain border rounded p-1"
                      />
                    </div>
                  )}
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="col-span-3"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Recommended: Square image, at least 200x200px
                  </p>
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
                    <span className="animate-spin mr-2">⟳</span>
                    Saving...
                  </>
                ) : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditCompanyModal;
