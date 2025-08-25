import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface ClientData {
  id: string;
  client_number: string;
  customer_name: string;
}

interface ClientAuthContextType {
  clientData: ClientData | null;
  loading: boolean;
  signIn: (clientNumber: string, password: string) => Promise<{ error: any }>;
  signOut: () => void;
  isAuthenticated: boolean;
}

interface VerifyCredentialsResponse {
  success: boolean;
  client_id?: string;
  client_number?: string;
  customer_name?: string;
  error?: string;
}

const ClientAuthContext = createContext<ClientAuthContextType | undefined>(undefined);

export const useClientAuth = () => {
  const context = useContext(ClientAuthContext);
  if (context === undefined) {
    throw new Error('useClientAuth must be used within a ClientAuthProvider');
  }
  return context;
};

export const ClientAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing client session in localStorage
    const storedClientData = localStorage.getItem('client_session');
    if (storedClientData) {
      try {
        const parsed = JSON.parse(storedClientData);
        // Verify the session is still valid (you might want to add expiry logic here)
        setClientData(parsed);
      } catch (error) {
        localStorage.removeItem('client_session');
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (clientNumber: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('verify_client_credentials', {
        client_number_input: clientNumber,
        password_input: password
      });

      if (error) {
        toast({
          title: "Sign In Error",
          description: "Failed to verify credentials",
          variant: "destructive",
        });
        return { error };
      }

      const response = data as unknown as VerifyCredentialsResponse;

      if (response.success) {
        const clientSession = {
          id: response.client_id!,
          client_number: response.client_number!,
          customer_name: response.customer_name!
        };
        
        setClientData(clientSession);
        localStorage.setItem('client_session', JSON.stringify(clientSession));
        
        toast({
          title: "Welcome back!",
          description: `Signed in as ${response.customer_name}`,
        });
        
        return { error: null };
      } else {
        toast({
          title: "Sign In Failed",
          description: response.error || "Invalid credentials",
          variant: "destructive",
        });
        return { error: { message: response.error } };
      }
    } catch (error) {
      toast({
        title: "Sign In Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    setClientData(null);
    localStorage.removeItem('client_session');
    toast({
      title: "Signed out",
      description: "You have been signed out successfully",
    });
  };

  const value = {
    clientData,
    loading,
    signIn,
    signOut,
    isAuthenticated: !!clientData,
  };

  return (
    <ClientAuthContext.Provider value={value}>
      {children}
    </ClientAuthContext.Provider>
  );
};