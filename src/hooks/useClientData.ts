import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ClientData {
  id: string;
  client_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
}

export interface VehicleData {
  plate: string;
  vin: string;
  mileage: string;
  carModel: string;
  carYear: string;
}

interface GenerateCredentialsResponse {
  success: boolean;
  password?: string;
}

export const useClientData = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const generateClientNumber = async (): Promise<string> => {
    const { data, error } = await supabase.rpc('generate_client_number');
    if (error) throw error;
    return data;
  };

  const createOrUpdateClient = useCallback(async (
    clientData: Partial<ClientData>,
    vehicleData?: VehicleData
  ): Promise<ClientData> => {
    setLoading(true);
    try {
      let client: ClientData;

      if (clientData.id) {
        // Update existing client
        const { data, error } = await supabase
          .from('clients')
          .update({
            customer_name: clientData.customer_name,
            customer_phone: clientData.customer_phone,
            customer_email: clientData.customer_email
          })
          .eq('id', clientData.id)
          .select()
          .single();

        if (error) throw error;
        client = data;

        // Generate client credentials if customer name is not "Pending"
        if (client.customer_name !== 'Pending') {
          const { data: credentialsData, error: credentialsError } = await supabase
            .rpc('generate_client_credentials', { client_id_input: client.id });
          
          if (credentialsError) {
            console.error('Error generating client credentials:', credentialsError);
          } else if (credentialsData) {
            const response = credentialsData as unknown as GenerateCredentialsResponse;
            if (response.success) {
              console.log('Client password generated:', response.password);
              // You might want to return this password to display to the user
            }
          }
        }
      } else {
        // Create new client with complete data
        if (!clientData.customer_name || !clientData.customer_phone || !clientData.customer_email) {
          throw new Error('Complete customer information required');
        }

        const clientNumber = await generateClientNumber();
        const { data, error } = await supabase
          .from('clients')
          .insert({
            client_number: clientNumber,
            customer_name: clientData.customer_name,
            customer_phone: clientData.customer_phone,
            customer_email: clientData.customer_email
          })
          .select()
          .single();

        if (error) throw error;
        client = data;

        // Generate client credentials if customer name is not "Pending"
        if (client.customer_name !== 'Pending') {
          const { data: credentialsData, error: credentialsError } = await supabase
            .rpc('generate_client_credentials', { client_id_input: client.id });
          
          if (credentialsError) {
            console.error('Error generating client credentials:', credentialsError);
          } else if (credentialsData) {
            const response = credentialsData as unknown as GenerateCredentialsResponse;
            if (response.success) {
              console.log('Client password generated:', response.password);
              // You might want to return this password to display to the user
            }
          }
        }
      }

      return client;
    } catch (error) {
      console.error('Error creating/updating client:', error);
      toast({
        title: "Error",
        description: "Failed to save client information",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const validateClientData = useCallback((clientData: Partial<ClientData>): boolean => {
    return !!(
      clientData.customer_name?.trim() &&
      clientData.customer_phone?.trim() &&
      clientData.customer_email?.trim()
    );
  }, []);

  const recoverIncompleteClient = useCallback(async (clientId: string, clientData: Partial<ClientData>): Promise<boolean> => {
    try {
      if (!validateClientData(clientData)) {
        return false;
      }

      await createOrUpdateClient({ ...clientData, id: clientId });
      toast({
        title: "Success",
        description: "Client information completed successfully",
        variant: "default"
      });
      return true;
    } catch (error) {
      console.error('Error recovering client:', error);
      return false;
    }
  }, [createOrUpdateClient, validateClientData, toast]);

  return {
    createOrUpdateClient,
    validateClientData,
    recoverIncompleteClient,
    loading
  };
};