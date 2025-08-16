import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, AlertCircle, Car, Phone, Mail } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";

interface Client {
  id: string;
  client_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
}

interface Checkin {
  id: string;
  status: string;
  checkin_approved: boolean;
  checkout_approved: boolean;
  client_notes: string;
  mileage: number;
  vehicle_vin: string;
  plate: string;
  created_at: string;
}

interface ServiceApproval {
  id: string;
  service_description: string;
  estimated_cost: number;
  approved: boolean;
  client_notes: string;
}

const ClientPortal = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [client, setClient] = useState<Client | null>(null);
  const [checkin, setCheckin] = useState<Checkin | null>(null);
  const [serviceApprovals, setServiceApprovals] = useState<ServiceApproval[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (clientId) {
      loadClientData();
    }
  }, [clientId]);

  const loadClientData = async () => {
    try {
      // Load client info
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('client_number', clientId)
        .single();

      if (clientError) throw clientError;
      setClient(clientData);

      // Load checkin data
      const { data: checkinData, error: checkinError } = await supabase
        .from('checkins')
        .select('*')
        .eq('client_id', clientData.id)
        .single();

      if (checkinData) {
        setCheckin(checkinData);

        // Load service approvals
        const { data: approvalsData, error: approvalsError } = await supabase
          .from('service_approvals')
          .select('*')
          .eq('checkin_id', checkinData.id);

        if (approvalsData) setServiceApprovals(approvalsData);
      }
    } catch (error) {
      console.error('Error loading client data:', error);
      toast.error('Client not found');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveCheckin = async () => {
    if (!checkin) return;

    try {
      const { error } = await supabase
        .from('checkins')
        .update({ checkin_approved: true })
        .eq('id', checkin.id);

      if (error) throw error;

      setCheckin({ ...checkin, checkin_approved: true });
      toast.success(t('checkin.approved'));
    } catch (error) {
      console.error('Error approving checkin:', error);
      toast.error('Failed to approve check-in');
    }
  };

  const handleApproveCheckout = async () => {
    if (!checkin) return;

    try {
      const { error } = await supabase
        .from('checkins')
        .update({ checkout_approved: true })
        .eq('id', checkin.id);

      if (error) throw error;

      setCheckin({ ...checkin, checkout_approved: true });
      toast.success(t('checkout.approved'));
    } catch (error) {
      console.error('Error approving checkout:', error);
      toast.error('Failed to approve check-out');
    }
  };

  const handleApproveService = async (approvalId: string, notes: string = '') => {
    try {
      const { error } = await supabase
        .from('service_approvals')
        .update({ 
          approved: true, 
          approved_at: new Date().toISOString(),
          client_notes: notes
        })
        .eq('id', approvalId);

      if (error) throw error;

      setServiceApprovals(prev => 
        prev.map(approval => 
          approval.id === approvalId 
            ? { ...approval, approved: true, client_notes: notes }
            : approval
        )
      );
      toast.success(t('service.approved'));
    } catch (error) {
      console.error('Error approving service:', error);
      toast.error('Failed to approve service');
    }
  };

  const getProgressPercentage = () => {
    if (!checkin) return 0;
    
    let progress = 25; // Base progress for checkin creation
    if (checkin.checkin_approved) progress += 25;
    if (serviceApprovals.length > 0) {
      const approvedServices = serviceApprovals.filter(s => s.approved).length;
      progress += (approvedServices / serviceApprovals.length) * 25;
    } else {
      progress += 25; // No services needed
    }
    if (checkin.checkout_approved) progress += 25;
    
    return Math.min(progress, 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t('loading.client.data')}</p>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-destructive">
              {t('client.not.found')}
            </CardTitle>
            <CardDescription className="text-center">
              {t('invalid.client.id')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/')} className="w-full">
              {t('return.home')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">{t('client.portal')}</h1>
            <p className="text-muted-foreground">{t('track.service.progress')}</p>
          </div>
          <LanguageToggle />
        </div>

        {/* Client Info Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              {t('client.information')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">{t('client.id')}: {client.client_number}</p>
                <p className="text-muted-foreground">{client.customer_name}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>{client.customer_phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>{client.customer_email}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Overview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t('service.progress')}</CardTitle>
            <CardDescription>{t('current.status.vehicle')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={getProgressPercentage()} className="w-full" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className={`h-5 w-5 ${checkin ? 'text-green-500' : 'text-muted-foreground'}`} />
                  <span className="text-sm">{t('vehicle.received')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className={`h-5 w-5 ${checkin?.checkin_approved ? 'text-green-500' : 'text-muted-foreground'}`} />
                  <span className="text-sm">{t('checkin.approved.text')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className={`h-5 w-5 ${serviceApprovals.length === 0 || serviceApprovals.every(s => s.approved) ? 'text-green-500' : 'text-muted-foreground'}`} />
                  <span className="text-sm">{t('services.approved')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className={`h-5 w-5 ${checkin?.checkout_approved ? 'text-green-500' : 'text-muted-foreground'}`} />
                  <span className="text-sm">{t('checkout.approved.text')}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Check-in Approval */}
        {checkin && !checkin.checkin_approved && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                {t('checkin.approval.required')}
              </CardTitle>
              <CardDescription>
                {t('review.approve.vehicle.inspection')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">{t('license.plate')}</p>
                    <p className="text-muted-foreground">{checkin.plate}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t('mileage')}</p>
                    <p className="text-muted-foreground">{checkin.mileage}</p>
                  </div>
                </div>
                <Button onClick={handleApproveCheckin} className="w-full">
                  {t('approve.checkin')}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Service Approvals */}
        {serviceApprovals.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{t('service.approvals.required')}</CardTitle>
              <CardDescription>
                {t('review.approve.each.service')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {serviceApprovals.map((approval) => (
                  <div key={approval.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{approval.service_description}</h4>
                      <Badge variant={approval.approved ? "default" : "secondary"}>
                        {approval.approved ? t('approved') : t('pending.approval')}
                      </Badge>
                    </div>
                    {approval.estimated_cost > 0 && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {t('estimated.cost')}: ${approval.estimated_cost}
                      </p>
                    )}
                    {!approval.approved && (
                      <div className="space-y-2">
                        <Textarea 
                          placeholder={t('add.notes.optional')}
                          id={`notes-${approval.id}`}
                        />
                        <Button 
                          onClick={() => {
                            const notes = (document.getElementById(`notes-${approval.id}`) as HTMLTextAreaElement)?.value || '';
                            handleApproveService(approval.id, notes);
                          }}
                          size="sm"
                        >
                          {t('approve.service')}
                        </Button>
                      </div>
                    )}
                    {approval.approved && approval.client_notes && (
                      <div className="mt-2 p-2 bg-muted rounded">
                        <p className="text-sm">{t('your.notes')}: {approval.client_notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Checkout Approval */}
        {checkin && checkin.checkin_approved && 
         (serviceApprovals.length === 0 || serviceApprovals.every(s => s.approved)) && 
         !checkin.checkout_approved && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                {t('checkout.approval.required')}
              </CardTitle>
              <CardDescription>
                {t('final.inspection.complete')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleApproveCheckout} className="w-full">
                {t('approve.checkout')}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Completed */}
        {checkin?.checkout_approved && (
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <CheckCircle className="h-5 w-5" />
                {t('service.completed')}
              </CardTitle>
              <CardDescription className="text-green-600">
                {t('vehicle.ready.pickup')}
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ClientPortal;