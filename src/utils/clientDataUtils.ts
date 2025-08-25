import { supabase } from '@/integrations/supabase/client';

export interface ClientSummary {
  id: string;
  client_number: string;
  customer_name: string;
  created_at: string;
  has_checkin: boolean;
}

/**
 * Retrieves all incomplete client records from the database
 */
export const getIncompleteClients = async (): Promise<ClientSummary[]> => {
  try {
    const { data, error } = await supabase.rpc('get_incomplete_clients');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching incomplete clients:', error);
    throw error;
  }
};

/**
 * Cleans up old pending client records (older than 24 hours with no checkins)
 */
export const cleanupPendingClients = async (): Promise<number> => {
  try {
    const { data, error } = await supabase.rpc('cleanup_pending_clients');
    
    if (error) throw error;
    return data?.[0]?.cleaned_count || 0;
  } catch (error) {
    console.error('Error cleaning up pending clients:', error);
    throw error;
  }
};

/**
 * Validates if client data is complete
 */
export const isClientDataComplete = (clientData: any): boolean => {
  return !!(
    clientData?.customer_name &&
    clientData.customer_name !== 'Pending' &&
    clientData?.customer_phone &&
    clientData?.customer_email
  );
};

/**
 * Updates a client record with complete information
 */
export const updateClientData = async (
  clientId: string,
  updateData: {
    customer_name: string;
    customer_phone: string;
    customer_email: string;
  }
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('clients')
      .update(updateData)
      .eq('id', clientId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating client data:', error);
    throw error;
  }
};

/**
 * Gets client statistics for monitoring data quality
 */
export const getClientStats = async () => {
  try {
    const { data: totalClients, error: totalError } = await supabase
      .from('clients')
      .select('id', { count: 'exact', head: true });

    if (totalError) throw totalError;

    const { data: pendingClients, error: pendingError } = await supabase
      .from('clients')
      .select('id', { count: 'exact', head: true })
      .or('customer_name.eq.Pending,customer_name.is.null,customer_name.eq.');

    if (pendingError) throw pendingError;

    const { data: completeClients, error: completeError } = await supabase
      .from('clients')
      .select('id', { count: 'exact', head: true })
      .neq('customer_name', 'Pending')
      .not('customer_name', 'is', null)
      .neq('customer_name', '');

    if (completeError) throw completeError;

    return {
      total: totalClients.length,
      pending: pendingClients.length,
      complete: completeClients.length,
      completionRate: totalClients.length > 0 ? (completeClients.length / totalClients.length) * 100 : 0
    };
  } catch (error) {
    console.error('Error getting client stats:', error);
    throw error;
  }
};