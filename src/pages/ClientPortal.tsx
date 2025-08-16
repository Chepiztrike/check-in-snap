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
  car_model?: string;
  car_year?: string;
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

interface PartsServiceSession {
  id: string;
  vehicle_details: any;
  general_media: any;
  parts_data: any;
  status: string;
  created_at: string;
}

interface CheckoutSession {
  id: string;
  vehicle_details: any;
  general_media: any;
  checkout_items: any;
  status: string;
  created_at: string;
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
  const [partsServiceSession, setPartsServiceSession] = useState<PartsServiceSession | null>(null);
  const [checkoutSession, setCheckoutSession] = useState<CheckoutSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (clientId) {
      loadClientData();
    }
  }, [clientId]);

  const loadClientData = async () => {
    try {
      console.log('Loading client data for:', clientId);
      
      // Prevent multiple simultaneous loads
      if (loading) return;
      
      // Load client info
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('client_number', clientId)
        .single();

      console.log('Raw client response:', { clientData, clientError });

      if (clientError) {
        console.error('Client error:', clientError);
        throw clientError;
      }
      
      if (!clientData) {
        console.log('No client found for ID:', clientId);
        setClient(null);
        setLoading(false);
        return;
      }
      
      console.log('Client data loaded:', clientData);
      setClient(clientData);

      // Load checkin data - handle multiple records by taking the most recent
      const { data: checkinData, error: checkinError } = await supabase
        .from('checkins')
        .select('*')
        .eq('client_id', clientData.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (checkinError) {
        console.error('Checkin error:', checkinError);
        // Don't throw, just log - client might not have checkin yet
      }

      if (checkinData) {
        console.log('Checkin data loaded:', checkinData);
        setCheckin(checkinData);

        // Load checkin items
        const { data: itemsData, error: itemsError } = await supabase
          .from('checkin_items')
          .select('*')
          .eq('checkin_id', checkinData.id);

        if (itemsError) {
          console.error('Items error:', itemsError);
        } else if (itemsData) {
          console.log('Checkin items loaded:', itemsData);
          setCheckinItems(itemsData);
        }

        // Load checkin media
        const { data: mediaData, error: mediaError } = await supabase
          .from('checkin_media')
          .select('*')
          .eq('checkin_id', checkinData.id);

        if (mediaError) {
          console.error('Media error:', mediaError);
        } else if (mediaData) {
          console.log('Media data loaded:', mediaData);
          setCheckinMedia(mediaData);
        }

        // Load service approvals
        const { data: approvalsData, error: approvalsError } = await supabase
          .from('service_approvals')
          .select('*')
          .eq('checkin_id', checkinData.id);

        if (approvalsError) {
          console.error('Approvals error:', approvalsError);
        } else if (approvalsData) {
          console.log('Service approvals loaded:', approvalsData);
          setServiceApprovals(approvalsData);
        }

        // Load parts & service session
        const { data: partsData, error: partsError } = await supabase
          .from('parts_service_sessions')
          .select('*')
          .eq('client_id', clientData.id)
          .maybeSingle();

        if (partsError) {
          console.error('Parts service error:', partsError);
        } else if (partsData) {
          console.log('Parts service session loaded:', partsData);
          setPartsServiceSession(partsData as PartsServiceSession);
        }

        // Load checkout session
        const { data: checkoutData, error: checkoutError } = await supabase
          .from('checkout_sessions')
          .select('*')
          .eq('client_id', clientData.id)
          .maybeSingle();

        if (checkoutError) {
          console.error('Checkout session error:', checkoutError);
        } else if (checkoutData) {
          console.log('Checkout session loaded:', checkoutData);
          setCheckoutSession(checkoutData as CheckoutSession);
        }
      } else {
        console.log('No checkin data found for client');
      }
    } catch (error) {
      console.error('Error loading client data:', error);
      // Prevent infinite re-renders by not calling navigate on every error
      if (!client) {
        toast.error('Client not found');
        setTimeout(() => navigate('/'), 100); // Delay navigation to prevent render loop
      }
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

        {/* Client Overview Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Client Info Card */}
          <Card className="lg:col-span-2">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">{t('car.model')}: </span>
                      <span className="font-medium">{checkin.car_model || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">{t('year')}: </span>
                      <span className="font-medium">{checkin.car_year || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">{t('license.plate')}: </span>
                      <span className="font-medium">{checkin.plate}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">{t('mileage')}: </span>
                      <span className="font-medium">{checkin.mileage}</span>
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-muted-foreground">{t('vin')}: </span>
                      <span className="font-medium font-mono text-xs">{checkin.vehicle_vin}</span>
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-muted-foreground">{t('checkin.date')}: </span>
                      <span className="font-medium">{new Date(checkin.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Service Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                {t('service.summary')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{checkinItems.length}</div>
                <div className="text-sm text-muted-foreground">{t('inspection.items')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600">
                  {checkinItems.filter(item => item.service_needed || item.result === 'service_needed').length}
                </div>
                <div className="text-sm text-muted-foreground">{t('items.need.service')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {checkinItems.filter(item => !item.service_needed && item.result !== 'service_needed').length}
                </div>
                <div className="text-sm text-muted-foreground">{t('items.passed')}</div>
              </div>
              {serviceApprovals.length > 0 && (
                <div className="text-center pt-2 border-t">
                  <div className="text-lg font-semibold">
                    ${serviceApprovals.reduce((sum, approval) => sum + (approval.estimated_cost || 0), 0).toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">{t('estimated.cost')}</div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

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

        {/* Parts & Service Information */}
        {partsServiceSession && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                {t('parts.service.information')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">{t('service.date')}</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(partsServiceSession.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">{t('status')}</h4>
                    <Badge variant={partsServiceSession.status === 'completed' ? 'default' : 'secondary'}>
                      {partsServiceSession.status}
                    </Badge>
                  </div>
                </div>
                
                {Array.isArray(partsServiceSession.parts_data) && partsServiceSession.parts_data.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">{t('parts.used')}</h4>
                    <div className="space-y-2">
                      {partsServiceSession.parts_data.map((part: any, index: number) => (
                        <div key={index} className="border rounded p-3 bg-muted/50">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{part.partName}</p>
                              <p className="text-sm text-muted-foreground">S/N: {part.serialNumber}</p>
                            </div>
                          </div>
                          {part.justification && (
                            <p className="text-sm mt-2">{part.justification}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Checkout Information */}
        {checkoutSession && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                {t('checkout.information')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">{t('checkout.date')}</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(checkoutSession.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">{t('status')}</h4>
                    <Badge variant={checkoutSession.status === 'completed' ? 'default' : 'secondary'}>
                      {checkoutSession.status}
                    </Badge>
                  </div>
                </div>
                
                {checkoutSession.checkout_items && Object.keys(checkoutSession.checkout_items).length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">{t('checkout.items.completed')}</h4>
                    <div className="text-sm text-muted-foreground">
                      {Object.values(checkoutSession.checkout_items).filter((item: any) => item.approved).length} / {Object.keys(checkoutSession.checkout_items).length} {t('items.approved')}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Media Gallery */}
        {checkinMedia.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5" />
                {t('inspection.media')} ({checkinMedia.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {checkinMedia.slice(0, 8).map((media) => (
                  <div key={media.id} className="border rounded-lg overflow-hidden">
                    {media.media_type.startsWith('image/') ? (
                      <img 
                        src={`${SUPABASE_URL}/storage/v1/object/public/checkins/${media.file_path}`}
                        alt="Inspection media"
                        className="w-full h-24 object-cover"
                      />
                    ) : (
                      <div className="w-full h-24 bg-muted flex items-center justify-center">
                        {getMediaIcon(media.media_type)}
                      </div>
                    )}
                  </div>
                ))}
                {checkinMedia.length > 8 && (
                  <div className="border rounded-lg border-dashed bg-muted/50 h-24 flex items-center justify-center text-sm text-muted-foreground">
                    +{checkinMedia.length - 8} more
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Check-in Approval */}
        {checkin && !checkin.checkin_approved && (
          <Card className="mb-6 border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                {t('checkin.approval.required')}
              </CardTitle>
              <CardDescription>
                {t('review.approve.vehicle.inspection')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Vehicle Information Summary */}
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-semibold mb-3 text-foreground">{t('vehicle.information')}</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">{t('license.plate')}</p>
                    <p className="font-medium">{checkin.plate || t('not.provided')}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">{t('mileage')}</p>
                    <p className="font-medium">{checkin.mileage ? `${checkin.mileage} km` : t('not.provided')}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">{t('car.model')}</p>
                    <p className="font-medium">{checkin.car_model || t('not.provided')}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">{t('year')}</p>
                    <p className="font-medium">{checkin.car_year || t('not.provided')}</p>
                  </div>
                </div>
                {checkin.vehicle_vin && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-sm font-medium text-muted-foreground mb-1">{t('vehicle.vin')}</p>
                    <p className="text-sm bg-background/60 p-2 rounded font-mono">{checkin.vehicle_vin}</p>
                  </div>
                )}
                {checkin.client_notes && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-sm font-medium text-muted-foreground mb-1">{t('client.notes')}</p>
                    <p className="text-sm bg-background/60 p-2 rounded">{checkin.client_notes}</p>
                  </div>
                )}
              </div>

              {/* Complete Inspection Results */}
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-semibold mb-3 text-foreground">{t('complete.inspection.results')}</h4>
                <div className="space-y-3">
                  {checkinItems.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic">{t('no.inspection.data')}</p>
                  ) : (
                    checkinItems.map((item) => {
                      const itemMedia = checkinMedia.filter(m => m.checkin_id === item.checkin_id);
                      const needsService = item.result === 'service_needed' || item.service_needed;
                      
                      return (
                        <div key={item.id} className={`border rounded p-3 ${needsService ? 'border-amber-300 bg-amber-50/50' : 'border-green-300 bg-green-50/50'}`}>
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2 flex-1">
                              {needsService ? (
                                <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0" />
                              ) : (
                                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                              )}
                              <h5 className="font-medium text-sm">{getItemName(item.item_key)}</h5>
                            </div>
                            <div className="flex items-center gap-2">
                              {needsService ? (
                                <Badge variant="destructive" className="text-xs">
                                  {t('service.required')}
                                </Badge>
                              ) : (
                                <Badge variant="default" className="text-xs bg-green-600">
                                  {t('passed')}
                                </Badge>
                              )}
                              {itemMedia.length > 0 && (
                                <Badge variant="secondary" className="text-xs">
                                  {itemMedia.length} {itemMedia.length === 1 ? t('file') : t('files')}
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          {item.notes && (
                            <div className="mb-2 p-2 bg-background/60 rounded text-xs">
                              <span className="font-medium">{t('notes')}: </span>
                              <span>{item.notes}</span>
                            </div>
                          )}
                          
                          {itemMedia.length > 0 && (
                            <div className="grid grid-cols-4 gap-1 mt-2">
                              {itemMedia.slice(0, 4).map((media) => (
                                <div key={media.id} className="relative">
                                  {media.media_type.startsWith('image/') ? (
                                    <img
                                      src={`${SUPABASE_URL}/storage/v1/object/public/checkins/${media.file_path}`}
                                      alt="Evidence"
                                      className="w-full h-12 object-cover rounded cursor-pointer hover:opacity-80"
                                      onClick={() => window.open(`${SUPABASE_URL}/storage/v1/object/public/checkins/${media.file_path}`, '_blank')}
                                    />
                                  ) : (
                                    <div className="w-full h-12 bg-muted rounded flex items-center justify-center cursor-pointer hover:bg-muted/80"
                                         onClick={() => window.open(`${SUPABASE_URL}/storage/v1/object/public/checkins/${media.file_path}`, '_blank')}>
                                      {getMediaIcon(media.media_type)}
                                    </div>
                                  )}
                                </div>
                              ))}
                              {itemMedia.length > 4 && (
                                <div className="w-full h-12 bg-muted rounded flex items-center justify-center text-xs font-medium">
                                  +{itemMedia.length - 4}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <Separator />
              
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  {t('review.all.information.approve')}
                </p>
                <Button onClick={handleApproveCheckin} className="w-full" size="lg">
                  {t('approve.checkin')}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Service Approvals */}
        {serviceApprovals.length > 0 && (
          <Card className="mb-6 border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-orange-500" />
                {t('service.approvals.required')}
              </CardTitle>
              <CardDescription>
                {t('review.approve.each.service')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {serviceApprovals.map((approval) => (
                  <div key={approval.id} className="border rounded-lg p-4 bg-orange-50/50">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-lg">{approval.service_description}</h4>
                        {approval.estimated_cost > 0 && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {t('estimated.cost')}: <span className="font-semibold">${approval.estimated_cost}</span>
                          </p>
                        )}
                      </div>
                      <Badge variant={approval.approved ? "default" : "secondary"} className={approval.approved ? "bg-green-600" : ""}>
                        {approval.approved ? t('approved') : t('pending.approval')}
                      </Badge>
                    </div>
                    
                    {/* Service Details */}
                    <div className="bg-background/60 rounded p-3 mb-3">
                      <p className="text-sm font-medium mb-1">{t('service.description')}:</p>
                      <p className="text-sm">{approval.service_description}</p>
                    </div>
                    
                    {!approval.approved && (
                      <div className="space-y-3 pt-3 border-t">
                        <Textarea 
                          placeholder={t('add.notes.optional')}
                          id={`notes-${approval.id}`}
                          className="min-h-[80px]"
                        />
                        <div className="flex justify-end">
                          <Button 
                            onClick={() => {
                              const notes = (document.getElementById(`notes-${approval.id}`) as HTMLTextAreaElement)?.value || '';
                              handleApproveService(approval.id, notes);
                            }}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            {t('approve.service')}
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {approval.approved && approval.client_notes && (
                      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
                        <p className="text-sm font-medium text-green-700 mb-1">{t('your.notes')}:</p>
                        <p className="text-sm text-green-600">{approval.client_notes}</p>
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
          <Card className="mb-6 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-blue-500" />
                {t('checkout.approval.required')}
              </CardTitle>
              <CardDescription>
                {t('final.inspection.complete')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Checkout Summary */}
              <div className="bg-blue-50/50 rounded-lg p-4">
                <h4 className="font-semibold mb-3 text-blue-700">{t('final.inspection.summary')}</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">{t('license.plate')}</p>
                    <p className="font-medium">{checkin.plate || t('not.provided')}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">{t('final.mileage')}</p>
                    <p className="font-medium">{checkin.mileage ? `${checkin.mileage} km` : t('not.provided')}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">{t('car.model')}</p>
                    <p className="font-medium">{checkin.car_model || t('not.provided')}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">{t('year')}</p>
                    <p className="font-medium">{checkin.car_year || t('not.provided')}</p>
                  </div>
                </div>
              </div>

              {/* Service Work Summary */}
              {serviceApprovals.length > 0 && (
                <div className="bg-green-50/50 rounded-lg p-4">
                  <h4 className="font-semibold mb-3 text-green-700">{t('completed.services')}</h4>
                  <div className="space-y-2">
                    {serviceApprovals.map((approval) => (
                      <div key={approval.id} className="flex justify-between items-center p-2 bg-background/60 rounded">
                        <span className="text-sm font-medium">{approval.service_description}</span>
                        <Badge variant="default" className="bg-green-600 text-xs">
                          {t('completed')}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quality Checks */}
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-semibold mb-3 text-foreground">{t('final.quality.checks')}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    t('exterior.no.damage'),
                    t('interior.cleanliness'),
                    t('lights.functioning'),
                    t('engine.compartment.inspection'),
                    t('fluid.levels.checked'),
                    t('tire.condition.pressure'),
                    t('battery.terminals.connections'),
                    t('windshield.mirrors.clean'),
                    t('service.work.completed'),
                    t('tools.equipment.removed'),
                    t('test.drive.completed'),
                    t('customer.walkthrough.completed')
                  ].map((check, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-background/60 rounded">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm">{check}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />
              
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  {t('confirm.vehicle.ready.pickup')}
                </p>
                <Button onClick={handleApproveCheckout} className="w-full" size="lg">
                  {t('approve.checkout')}
                </Button>
              </div>
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