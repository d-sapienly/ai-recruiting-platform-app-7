import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';

const CompanyRegistration: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  
  // Company form data
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    size: '',
    foundedYear: '',
    website: '',
    location: '',
    description: '',
    logoFile: null as File | null,
    logoPreview: null as string | null,
  });

  // Company size options
  const companySizes = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'];
  
  // Industry options
  const industries = [
    'Technology', 'Healthcare', 'Finance', 'Education', 'Retail', 
    'Manufacturing', 'Media', 'Transportation', 'Construction', 'Other'
  ];

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setUser(data.session.user);
      } else {
        navigate('/');
      }
    };
    
    checkAuth();
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, logoFile: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({ 
          ...prev, 
          logoPreview: event.target?.result as string 
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNextStep = () => {
    setStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Step 1: Create company record
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .insert([
          {
            name: formData.name,
            industry: formData.industry,
            size: formData.size,
            founded_year: formData.foundedYear ? parseInt(formData.foundedYear) : null,
            website: formData.website,
            location: formData.location,
            description: formData.description,
          }
        ])
        .select()
        .single();
      
      if (companyError) throw companyError;
      
      // Step 2: Upload logo if provided
      let logoUrl = null;
      if (formData.logoFile && companyData.id) {
        const fileExt = formData.logoFile.name.split('.').pop();
        const filePath = `${companyData.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('company-logos-bucket')
          .upload(filePath, formData.logoFile);
          
        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage
          .from('company-logos-bucket')
          .getPublicUrl(filePath);
          
        logoUrl = data.publicUrl;
        
        // Update company with logo URL
        const { error: updateError } = await supabase
          .from('companies')
          .update({ logo_url: logoUrl })
          .eq('id', companyData.id);
          
        if (updateError) throw updateError;
      }
      
      // Step 3: Create company admin record using RPC function to bypass RLS
      // This function now checks for existing records to avoid duplicates
      const { error: adminError } = await supabase.rpc(
        'create_initial_company_admin',
        { 
          p_company_id: companyData.id,
          p_user_id: user.id,
          p_role: 'admin'
        }
      );
      
      if (adminError) throw adminError;
      
      // Step 4: Update user metadata with role
      const { error: updateUserError } = await supabase.auth.updateUser({
        data: { 
          role: 'company_admin',
          company_id: companyData.id
        }
      });
      
      if (updateUserError) throw updateUserError;
      
      setSuccess('Company registration successful!');
      
      // Redirect to company dashboard after short delay
      setTimeout(() => {
        navigate('/company/dashboard');
      }, 1500);
      
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Company Name *</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="industry">Industry *</Label>
        <select
          id="industry"
          name="industry"
          value={formData.industry}
          onChange={handleInputChange}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          required
        >
          <option value="">Select Industry</option>
          {industries.map(industry => (
            <option key={industry} value={industry}>{industry}</option>
          ))}
        </select>
      </div>
      
      <div>
        <Label htmlFor="size">Company Size *</Label>
        <select
          id="size"
          name="size"
          value={formData.size}
          onChange={handleInputChange}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          required
        >
          <option value="">Select Size</option>
          {companySizes.map(size => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
      </div>
      
      <div className="flex justify-end">
        <Button 
          type="button" 
          onClick={handleNextStep}
          disabled={!formData.name || !formData.industry || !formData.size}
        >
          Next
        </Button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="foundedYear">Founded Year</Label>
        <Input
          id="foundedYear"
          name="foundedYear"
          type="number"
          min="1800"
          max={new Date().getFullYear()}
          value={formData.foundedYear}
          onChange={handleInputChange}
        />
      </div>
      
      <div>
        <Label htmlFor="website">Website</Label>
        <Input
          id="website"
          name="website"
          type="url"
          value={formData.website}
          onChange={handleInputChange}
          placeholder="https://example.com"
        />
      </div>
      
      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
          placeholder="City, Country"
        />
      </div>
      
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={handlePrevStep}>
          Back
        </Button>
        <Button type="button" onClick={handleNextStep}>
          Next
        </Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="description">Company Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={4}
        />
      </div>
      
      <div>
        <Label htmlFor="logo">Company Logo</Label>
        {formData.logoPreview && (
          <div className="mb-2">
            <img 
              src={formData.logoPreview} 
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
        />
        <p className="text-sm text-gray-500 mt-1">
          Recommended: Square image, at least 200x200px
        </p>
      </div>
      
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={handlePrevStep}>
          Back
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="animate-spin mr-2">⟳</span>
              Registering...
            </>
          ) : 'Complete Registration'}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Register Your Company
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Complete the form below to set up your company profile
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Progress indicator */}
          <div className="mb-6">
            <div className="flex justify-between">
              <div className={`text-sm ${step >= 1 ? 'text-indigo-600 font-medium' : 'text-gray-500'}`}>
                Basic Info
              </div>
              <div className={`text-sm ${step >= 2 ? 'text-indigo-600 font-medium' : 'text-gray-500'}`}>
                Details
              </div>
              <div className={`text-sm ${step >= 3 ? 'text-indigo-600 font-medium' : 'text-gray-500'}`}>
                Finish
              </div>
            </div>
            <div className="mt-2 h-2 bg-gray-200 rounded-full">
              <div 
                className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              ></div>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompanyRegistration;
