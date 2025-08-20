import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (session) {
          // Successfully authenticated, redirect to main app
          navigate('/', { replace: true });
        } else if (error) {
          console.error('Auth callback error:', error);
          navigate('/auth', { replace: true });
        } else {
          // If session isn't ready yet, try to recover from URL params
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(window.location.href);
          if (exchangeError) {
            console.error('Code exchange error:', exchangeError);
            navigate('/auth', { replace: true });
          } else {
            navigate('/', { replace: true });
          }
        }
      } catch (error) {
        console.error('Unexpected error in auth callback:', error);
        navigate('/auth', { replace: true });
      }
    };

    handleAuthCallback();
  }, [navigate]);

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