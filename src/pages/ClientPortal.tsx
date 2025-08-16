import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, AlertCircle, Car, Phone, Mail, Home, Image, Video, FileText, Wrench } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";

const SUPABASE_URL = "https://fdrqyrbxajmptwlbnhet.supabase.co";

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

interface CheckinItem {
  id: string;
  item_key: string;
  notes: string;
  result: string;
  service_needed: boolean;
  checkin_id: string;
}

interface CheckinMedia {
  id: string;
  file_path: string;
  media_type: string;
  checkin_id: string;
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
  const [checkinItems, setCheckinItems] = useState<CheckinItem[]>([]);
  const [checkinMedia, setCheckinMedia] = useState<CheckinMedia[]>([]);
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

        // Load checkin items
        const { data: itemsData, error: itemsError } = await supabase
          .from('checkin_items')
          .select('*')
          .eq('checkin_id', checkinData.id);

        if (itemsData) setCheckinItems(itemsData);

        // Load checkin media
        const { data: mediaData, error: mediaError } = await supabase
          .from('checkin_media')
          .select('*')
          .eq('checkin_id', checkinData.id);

        if (mediaData) setCheckinMedia(mediaData);

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

  const getItemName = (itemKey: string) => {
    const itemMap: Record<string, string> = {
      'scratches_dents': t('check.scratches.dents'),
      'bumpers_panels': t('inspect.bumpers.panels'),
      'lights': t('examine.lights'),
      'rust_corrosion': t('look.rust.corrosion'),
      'mirrors_glass': t('check.mirrors.glass'),
      'existing_damage': t('document.existing.damage'),
      'seats_adjustments': t('test.seats.adjustments'),
      'dashboard_cluster': t('check.dashboard.cluster'),
      'ac_heating': t('verify.ac.heating'),
      'radio_infotainment': t('test.radio.infotainment'),
      'upholstery': t('inspect.upholstery'),
      'seatbelts_safety': t('check.seatbelts.safety'),
      'fluid_levels': t('check.fluid.levels'),
      'belts_hoses': t('inspect.belts.hoses'),
      'leaks_corrosion': t('look.leaks.corrosion'),
      'battery_terminals': t('check.battery.terminals'),
      'air_filter': t('examine.air.filter'),
      'unusual_sounds': t('note.unusual.sounds'),
      'tire_tread': t('check.tire.tread'),
      'cuts_bulges': t('inspect.cuts.bulges'),
      'tire_pressure': t('verify.tire.pressure'),
      'wheel_rims': t('examine.wheel.rims'),
      'spare_tire': t('check.spare.tire'),
      'alignment_issues': t('look.alignment.issues'),
      'engine_light': t('check.engine.light'),
      'dashboard_lights': t('verify.dashboard.lights'),
      'active_warnings': t('note.active.warnings'),
      'hazard_indicators': t('test.hazard.indicators'),
      'fuel_gauges': t('check.fuel.gauges'),
      'error_codes': t('document.error.codes')
    };
    return itemMap[itemKey] || itemKey;
  };

  const getMediaIcon = (mediaType: string) => {
    if (mediaType.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (mediaType.startsWith('video/')) return <Video className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
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
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/')} className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              {t('home')}
            </Button>
            <LanguageToggle />
          </div>
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
            
            {checkin && (
              <div className="mt-4 pt-4 border-t">
                <h4 className="font-medium mb-2">{t('vehicle.details')}</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">{t('license.plate')}: </span>
                    <span className="font-medium">{checkin.plate}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">{t('mileage')}: </span>
                    <span className="font-medium">{checkin.mileage}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground">{t('vin')}: </span>
                    <span className="font-medium font-mono text-xs">{checkin.vehicle_vin}</span>
                  </div>
                </div>
              </div>
            )}
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

        {/* Inspection Results with Service Requirements */}
        {checkinItems.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                {t('inspection.results')}
              </CardTitle>
              <CardDescription>
                {t('detailed.inspection.findings')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {checkinItems.map((item) => {
                  const itemMedia = checkinMedia.filter(m => m.checkin_id === item.checkin_id);
                  const needsService = item.result === 'service_needed' || item.service_needed;
                  const isPassed = !needsService;
                  
                  return (
                    <div key={item.id} className={`border rounded-lg p-4 ${needsService ? 'border-amber-200 bg-amber-50' : 'border-green-200 bg-green-50'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          {isPassed ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-amber-600" />
                          )}
                          <h4 className="font-medium">{getItemName(item.item_key)}</h4>
                        </div>
                        <div className="flex items-center gap-2">
                          {needsService ? (
                            <Badge variant="destructive" className="flex items-center gap-1">
                              <Wrench className="h-3 w-3" />
                              {t('service.required')}
                            </Badge>
                          ) : (
                            <Badge variant="default" className="flex items-center gap-1 bg-green-600">
                              <CheckCircle className="h-3 w-3" />
                              {t('inspection.passed')}
                            </Badge>
                          )}
                          {itemMedia.length > 0 && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                              {getMediaIcon(itemMedia[0].media_type)}
                              {itemMedia.length} {itemMedia.length === 1 ? t('file') : t('files')}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {item.notes && (
                        <div className={`p-3 rounded mb-3 ${needsService ? 'bg-amber-100' : 'bg-green-100'}`}>
                          <p className="text-sm font-medium mb-1">{t('inspection.notes')}:</p>
                          <p className="text-sm">{item.notes}</p>
                        </div>
                      )}
                      
                      {needsService && (
                        <div className="mb-3 p-3 bg-amber-100 rounded border border-amber-200">
                          <p className="text-sm font-medium text-amber-800 mb-1">
                            {t('action.required')}:
                          </p>
                          <p className="text-sm text-amber-700">
                            {t('service.recommendation.for')} {getItemName(item.item_key).toLowerCase()}
                          </p>
                        </div>
                      )}
                      
                      {itemMedia.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm font-medium mb-2">{t('inspection.evidence')}:</p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {itemMedia.map((media) => (
                              <div key={media.id} className="relative group">
                                {media.media_type.startsWith('image/') ? (
                                  <img
                                    src={`${SUPABASE_URL}/storage/v1/object/public/checkins/${media.file_path}`}
                                    alt="Inspection media"
                                    className="w-full h-20 object-cover rounded border cursor-pointer hover:opacity-80"
                                    onClick={() => window.open(`${SUPABASE_URL}/storage/v1/object/public/checkins/${media.file_path}`, '_blank')}
                                  />
                                ) : (
                                  <div className="w-full h-20 bg-muted rounded border flex items-center justify-center cursor-pointer hover:bg-muted/80"
                                       onClick={() => window.open(`${SUPABASE_URL}/storage/v1/object/public/checkins/${media.file_path}`, '_blank')}>
                                    {getMediaIcon(media.media_type)}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Mechanic Actions - Only shown after checkin is approved */}
        {checkin?.checkin_approved && !checkin?.checkout_approved && (
          <Card className="mb-6 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Wrench className="h-5 w-5" />
                {t('mechanic.workflow')}
              </CardTitle>
              <CardDescription className="text-blue-600">
                {t('mechanic.next.steps')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button 
                  variant="outline"
                  onClick={() => window.open(`/parts-service?clientId=${client?.client_number}`, '_blank')}
                  className="flex items-center gap-2 border-blue-200 text-blue-700 hover:bg-blue-100"
                >
                  <Wrench className="h-4 w-4" />
                  {t('parts.service')}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.open(`/check-out?clientId=${client?.client_number}`, '_blank')}
                  className="flex items-center gap-2 border-blue-200 text-blue-700 hover:bg-blue-100"
                >
                  <Car className="h-4 w-4" />
                  {t('vehicle.checkout')}
                </Button>
              </div>
              <p className="text-xs text-blue-600">
                {t('mechanic.workflow.note')}
              </p>
            </CardContent>
          </Card>
        )}

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