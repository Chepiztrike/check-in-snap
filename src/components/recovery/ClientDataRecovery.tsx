import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle, User } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useClientData } from '@/hooks/useClientData';

interface ClientDataRecoveryProps {
  clientId: string;
  clientNumber?: string;
  onRecoveryComplete: (clientData: any) => void;
  onSkip?: () => void;
}

export const ClientDataRecovery: React.FC<ClientDataRecoveryProps> = ({
  clientId,
  clientNumber,
  onRecoveryComplete,
  onSkip
}) => {
  const { t } = useLanguage();
  const { recoverIncompleteClient, loading } = useClientData();
  
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleRecover = async () => {
    setError(null);
    
    if (!customerName.trim() || !customerPhone.trim() || !customerEmail.trim()) {
      setError('Please fill in all customer information fields');
      return;
    }

    const success = await recoverIncompleteClient(clientId, {
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_email: customerEmail
    });

    if (success) {
      onRecoveryComplete({
        id: clientId,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail,
        client_number: clientNumber
      });
    } else {
      setError('Failed to recover client data. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-warning" />
          </div>
          <CardTitle className="flex items-center justify-center gap-2">
            <User className="w-5 h-5" />
            Complete Client Information
          </CardTitle>
          <CardDescription>
            {clientNumber && (
              <span className="font-mono text-sm bg-muted px-2 py-1 rounded">
                {clientNumber}
              </span>
            )}
            <div className="mt-2">
              This client record is incomplete. Please provide the missing customer information to continue.
            </div>
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="customerName">Customer Name *</Label>
              <Input
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer name"
                disabled={loading}
              />
            </div>
            
            <div>
              <Label htmlFor="customerPhone">Phone Number *</Label>
              <Input
                id="customerPhone"
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Enter phone number"
                disabled={loading}
              />
            </div>
            
            <div>
              <Label htmlFor="customerEmail">Email Address *</Label>
              <Input
                id="customerEmail"
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="Enter email address"
                disabled={loading}
              />
            </div>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button 
              onClick={handleRecover} 
              className="flex-1"
              disabled={loading}
            >
              {loading ? (
                'Completing...'
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Complete Client Info
                </>
              )}
            </Button>
            
            {onSkip && (
              <Button 
                variant="outline"
                onClick={onSkip}
                disabled={loading}
              >
                Skip
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};