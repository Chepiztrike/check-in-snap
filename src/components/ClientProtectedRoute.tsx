import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useClientAuth } from '@/contexts/ClientAuthContext';
import { Skeleton } from '@/components/ui/skeleton';

interface ClientProtectedRouteProps {
  children: React.ReactNode;
}

export const ClientProtectedRoute: React.FC<ClientProtectedRouteProps> = ({ children }) => {
  const { clientData, loading } = useClientAuth();
  const { clientId } = useParams();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-primary-foreground p-8">
        <div className="max-w-md mx-auto space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-8 w-3/4" />
        </div>
      </div>
    );
  }

  if (!clientData) {
    // Redirect to login page
    return <Navigate to="/" replace />;
  }

  // Check if the authenticated client matches the requested client ID
  if (clientId && clientData.client_number !== clientId) {
    // Redirect to login if trying to access a different client's data
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};