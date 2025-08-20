import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const [callbackHandled, setCallbackHandled] = useState(false);

  // Watch for successful authentication and redirect
  useEffect(() => {
    if (!loading && user && callbackHandled) {
      console.log('AuthCallback: User authenticated, redirecting to main app');
      navigate('/', { replace: true });
    }
  }, [user, loading, callbackHandled, navigate]);

  useEffect(() => {
    const handleAuthCallback = async () => {
      if (callbackHandled) return;
      
      console.log('AuthCallback: Starting auth callback process');
      try {
        // Check if we already have a session
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('AuthCallback: Session check result:', { hasSession: !!session, error });
        
        if (session?.user) {
          console.log('AuthCallback: User already authenticated');
          setCallbackHandled(true);
          return;
        }
        
        if (error) {
          console.error('AuthCallback: Session error:', error);
          navigate('/auth', { replace: true });
          return;
        }
        
        // Try to exchange code for session
        console.log('AuthCallback: No session found, attempting code exchange');
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(window.location.href);
        
        if (exchangeError) {
          console.error('AuthCallback: Code exchange error:', exchangeError);
          navigate('/auth', { replace: true });
        } else {
          console.log('AuthCallback: Code exchange successful, waiting for auth state change');
          setCallbackHandled(true);
          // Auth state change will handle the redirect
        }
      } catch (error) {
        console.error('AuthCallback: Unexpected error:', error);
        navigate('/auth', { replace: true });
      }
    };

    handleAuthCallback();
  }, [navigate, callbackHandled]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Signing you in...</h2>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-1/2 mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;