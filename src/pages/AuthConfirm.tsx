import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Seo } from '@/components/Seo';
import { useAuth } from '@/contexts/AuthContext';

const AuthConfirm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');
    
    if (error) {
      setStatus('error');
      setMessage(errorDescription || 'An error occurred during authentication');
    } else if (user) {
      setStatus('success');
      setMessage('Your email has been confirmed successfully!');
      // Redirect to login page after confirmation
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } else {
      setStatus('success');
      setMessage('Email confirmed! You can now sign in to your account.');
    }
  }, [searchParams, user, navigate]);

  const handleContinue = () => {
    navigate(user ? '/' : '/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-primary-foreground flex items-center justify-center p-4">
      <Seo 
        title="Email Confirmation | AutoCheck Pro" 
        description="Confirm your email address to complete registration" 
        canonical="/auth/confirm" 
      />
      
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            {status === 'loading' && (
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            )}
            {status === 'success' && (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            )}
            {status === 'error' && (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            )}
          </div>
          
          <CardTitle className="text-2xl">
            {status === 'loading' && 'Confirming Email...'}
            {status === 'success' && 'Email Confirmed!'}
            {status === 'error' && 'Confirmation Failed'}
          </CardTitle>
          
          <CardDescription>
            {message}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="text-center space-y-4">
          {status === 'success' && user && (
            <p className="text-sm text-muted-foreground">
              Redirecting you to the login page in a few seconds...
            </p>
          )}
          
          {status !== 'loading' && (
            <Button onClick={handleContinue} className="w-full">
              {user ? 'Continue to Dashboard' : 'Continue to Sign In'}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthConfirm;