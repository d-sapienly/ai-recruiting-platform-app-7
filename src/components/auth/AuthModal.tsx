import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { 
  signInWithEmail, 
  signUpWithEmail, 
  getCurrentUser 
} from '../../lib/supabaseClient';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
  userType?: 'job_seeker' | 'company_admin' | 'recruiter';
}

const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  initialMode = 'login',
  userType = 'job_seeker'
}) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Reset form when modal opens/closes or mode changes
  useEffect(() => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    setError(null);
    setSuccess(null);
  }, [isOpen, mode]);
  
  // Set initial mode when prop changes
  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    // Validate inputs
    if (mode === 'signup') {
      if (!name.trim()) {
        setError('Please enter your name');
        return;
      }
      
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
    }
    
    setIsLoading(true);
    
    try {
      if (mode === 'login') {
        // Login
        const { data, error } = await signInWithEmail(email, password);
        
        if (error) {
          throw error;
        }
        
        setSuccess('Login successful!');
        
        // Check user role and redirect accordingly
        const { data: userData } = await getCurrentUser();
        console.log("User data after login:", userData);
        const userRole = userData.user?.user_metadata?.role;
        console.log("User role:", userRole);
        
        setTimeout(() => {
          onClose();
          
          if (userRole === 'job_seeker') {
            navigate('/job-seeker/dashboard');
          } else if (userRole === 'company_admin') {
            navigate('/company/dashboard');
          } else if (userRole === 'recruiter') {
            navigate('/recruiter/dashboard');
          } else {
            // Default redirect
            navigate('/');
          }
        }, 1000);
      } else {
        // Signup
        const userData = {
          name,
          role: userType,
        };
        
        console.log(`Signing up user with role: ${userType}`);
        
        const { data, error } = await signUpWithEmail(email, password, userData);
        
        if (error) {
          throw error;
        }
        
        setSuccess('Account created successfully! Please check your email for verification.');
        
        // Automatically sign in after signup
        const { data: signInData, error: signInError } = await signInWithEmail(email, password);
        
        if (signInError) {
          console.warn("Auto sign-in failed, but account was created:", signInError);
          // Continue with redirect even if auto sign-in fails
        }
        
        // Redirect based on user type after signup
        setTimeout(() => {
          onClose();
          
          if (userType === 'job_seeker') {
            navigate('/job-seeker/register');
          } else if (userType === 'company_admin') {
            navigate('/company/register');
          } else if (userType === 'recruiter') {
            navigate('/recruiter/register');
          } else {
            // Default redirect
            navigate('/');
          }
        }, 1500);
      }
    } catch (err: any) {
      console.error('Authentication error:', err);
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'login' 
              ? 'Sign in to your account to continue' 
              : `Sign up as a ${userType.replace('_', ' ')}`}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {mode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    disabled={isLoading}
                    required
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  disabled={isLoading}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'signup' ? 'Create a password' : 'Enter your password'}
                  disabled={isLoading}
                  required
                />
              </div>
              
              {mode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    disabled={isLoading}
                    required
                  />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          
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
          
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between sm:space-x-2">
            <Button
              type="button"
              variant="ghost"
              onClick={toggleMode}
              disabled={isLoading}
              className="mb-2 sm:mb-0"
            >
              {mode === 'login' ? 'Need an account? Sign up' : 'Already have an account? Log in'}
            </Button>
            
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                mode === 'login' ? 'Sign in' : 'Create account'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
