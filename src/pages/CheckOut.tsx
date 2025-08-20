import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Download, ArrowLeft } from "lucide-react";
import Seo from "@/components/Seo";
import CheckoutItemUploader from "@/components/checkout/CheckoutItemUploader";
import MediaUploader, { MediaItem } from "@/components/checkin/MediaUploader";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";

interface CheckoutItemData {
  media: MediaItem[];
  approved: boolean;
}

interface VehicleDetails {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  carModel: string;
  carYear: string;
  checkoutDate: string;
  licensePlate: string;
  mileage: string;
}

const getCheckoutItems = (t: (key: string) => string) => [
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
];

const CheckOut = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [clientIdInput, setClientIdInput] = useState(searchParams.get('clientId') || '');
  const clientId = searchParams.get('clientId');
  const { t } = useLanguage();
  
  // ALL HOOKS MUST BE DECLARED BEFORE ANY CONDITIONAL RETURNS
  const checkoutItems = getCheckoutItems(t);
  const [vehicleDetails, setVehicleDetails] = useState<VehicleDetails>({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    carModel: "",
    carYear: "",
    checkoutDate: new Date().toISOString().split('T')[0],
    licensePlate: "",
    mileage: "",
  });

  const [generalMedia, setGeneralMedia] = useState<MediaItem[]>([]);
  const [checkoutData, setCheckoutData] = useState<Record<number, CheckoutItemData>>({});
  
  // Load client data when clientId is available - MOVED BEFORE CONDITIONAL RETURN
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
        .maybeSingle();

      if (clientError) throw clientError;
      
      if (clientData) {
        // Load existing check-in data
        const { data: checkinData } = await supabase
          .from('checkins')
          .select('*')
          .eq('client_id', clientData.id)
          .maybeSingle();
        
        // Pre-populate vehicle details from client and check-in data
        setVehicleDetails({
          customerName: clientData.customer_name || "",
          customerPhone: clientData.customer_phone || "",
          customerEmail: clientData.customer_email || "",
          carModel: checkinData?.car_model || "",
          carYear: checkinData?.car_year || "",
          checkoutDate: new Date().toISOString().split('T')[0],
          licensePlate: checkinData?.plate || "",
          mileage: checkinData?.mileage?.toString() || "",
        });
        
        // Load existing checkout session if exists
        const { data: sessionData } = await supabase
          .from('checkout_sessions')
          .select('*')
          .eq('client_id', clientData.id)
          .maybeSingle();
          
        if (sessionData) {
          setGeneralMedia((sessionData.general_media as unknown as MediaItem[]) || []);
          setCheckoutData((sessionData.checkout_items as unknown as Record<number, CheckoutItemData>) || {});
        }
      }
    } catch (error) {
      console.error('Error loading client data:', error);
      toast({
        title: 'Error loading client data',
        description: 'Could not load existing client information.',
      });
    }
  };
  
  const handleClientIdSubmit = () => {
    if (clientIdInput.trim()) {
      setSearchParams({ clientId: clientIdInput.trim() });
    }
  };
  
  // Show client ID input if not provided
  if (!clientId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">
              {t('vehicle.checkout.page')}
            </CardTitle>
            <CardDescription className="text-center">
              {t('enter.client.id.continue')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="clientId">{t('client.id')}</Label>
              <Input
                id="clientId"
                value={clientIdInput}
                onChange={(e) => setClientIdInput(e.target.value)}
                placeholder="CLT-2025-0001"
                onKeyPress={(e) => e.key === 'Enter' && handleClientIdSubmit()}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleClientIdSubmit} className="flex-1">
                {t('continue')}
              </Button>
              <Button onClick={() => window.history.back()} variant="outline">
                {t('back')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const handleCheckoutDataChange = (index: number, field: keyof CheckoutItemData, value: any) => {
    setCheckoutData(prev => ({
      ...prev,
      [index]: {
        ...prev[index],
        [field]: value
      }
    }));
  };

  const getCheckoutItemData = (index: number): CheckoutItemData => {
    return checkoutData[index] || { media: [], approved: false };
  };

  const handleSave = async () => {
    try {
      if (!clientId) return;
      
      // Find client by client number
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id')
        .eq('client_number', clientId)
        .single();

      if (clientError) throw clientError;

      // Save or update checkout session
      const { error: sessionError } = await supabase
        .from('checkout_sessions')
        .upsert({
          client_id: clientData.id,
          vehicle_details: vehicleDetails as any,
          general_media: generalMedia as any,
          checkout_items: checkoutData as any,
          status: 'completed'
        }, {
          onConflict: 'client_id'
        });

      if (sessionError) throw sessionError;

      toast({
        title: t('data.saved.successfully'),
        description: t('checkout.data.saved'),
      });
    } catch (error) {
      console.error('Error saving checkout data:', error);
      toast({
        title: 'Error saving data',
        description: 'Could not save checkout information.',
      });
    }
  };

  const handleExport = () => {
    const exportData = {
      clientId,
      vehicleDetails,
      generalMedia: generalMedia.map(item => ({ url: item.url, type: item.type })),
      checkoutItems: checkoutItems.map((item, index) => ({
        item,
        ...getCheckoutItemData(index),
        media: getCheckoutItemData(index).media.map(mediaItem => ({ url: mediaItem.url, type: mediaItem.type }))
      })),
      exportDate: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `checkout-${clientId}-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    toast({
      title: t('checkout.data.exported'),
      description: t('vehicle.checkout.downloaded'),
    });
  };

  const approvedCount = Object.values(checkoutData).filter(item => item.approved).length;
  const totalItems = checkoutItems.length;

  return (
    <div className="min-h-screen bg-background">
      <Seo 
        title="Vehicle Check-Out | Customer Approval"
        description="Complete vehicle checkout process with customer approval for each inspection item."
        canonical="/check-out"
      />
      
      <header className="container mx-auto flex items-center justify-between py-6">
        <div className="flex items-center gap-4">
          <a href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('back')}
            </Button>
          </a>
          <h1 className="text-2xl font-semibold">{t('vehicle.checkout.page')}</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20">
            {t('client.id')}: <span className="font-mono font-semibold">{clientId}</span>
          </div>
          <Button onClick={handleSave} variant="default" className="gap-2">
            <Download className="h-4 w-4" />
            {t('save.data')}
          </Button>
          <Button onClick={handleExport} variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            {t('export.data')}
          </Button>
          <LanguageToggle />
        </div>
      </header>

      <main className="container mx-auto space-y-8 pb-8">
        {/* Vehicle Details */}
        <Card>
          <CardHeader>
            <CardTitle>{t('vehicle.details')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="space-y-1">
                <Label htmlFor="customerName" className="text-xs sm:text-sm">{t('customer.name')}</Label>
                <Input
                  id="customerName"
                  value={vehicleDetails.customerName}
                  onChange={(e) => setVehicleDetails({...vehicleDetails, customerName: e.target.value})}
                  placeholder={t('enter.customer.name')}
                  className="text-sm"
                />
              </div>
              <div>
                <Label htmlFor="customerPhone">{t('phone.number')}</Label>
                <Input
                  id="customerPhone"
                  value={vehicleDetails.customerPhone}
                  onChange={(e) => setVehicleDetails({...vehicleDetails, customerPhone: e.target.value})}
                  placeholder={t('enter.phone.number')}
                />
              </div>
              <div>
                <Label htmlFor="customerEmail">{t('email')}</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={vehicleDetails.customerEmail}
                  onChange={(e) => setVehicleDetails({...vehicleDetails, customerEmail: e.target.value})}
                  placeholder={t('enter.email.address')}
                />
              </div>
              <div>
                <Label htmlFor="carModel">{t('car.model')}</Label>
                <Input
                  id="carModel"
                  value={vehicleDetails.carModel}
                  onChange={(e) => setVehicleDetails({...vehicleDetails, carModel: e.target.value})}
                  placeholder={t('enter.car.model')}
                />
              </div>
              <div>
                <Label htmlFor="carYear">{t('year')}</Label>
                <Input
                  id="carYear"
                  value={vehicleDetails.carYear}
                  onChange={(e) => setVehicleDetails({...vehicleDetails, carYear: e.target.value})}
                  placeholder={t('enter.year')}
                />
              </div>
              <div>
                <Label htmlFor="checkoutDate">{t('checkout.date')}</Label>
                <Input
                  id="checkoutDate"
                  type="date"
                  value={vehicleDetails.checkoutDate}
                  onChange={(e) => setVehicleDetails({...vehicleDetails, checkoutDate: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="licensePlate">{t('license.plate')}</Label>
                <Input
                  id="licensePlate"
                  value={vehicleDetails.licensePlate}
                  onChange={(e) => setVehicleDetails({...vehicleDetails, licensePlate: e.target.value})}
                  placeholder={t('enter.license.plate')}
                />
              </div>
              <div>
                <Label htmlFor="mileage">{t('final.mileage')}</Label>
                <Input
                  id="mileage"
                  value={vehicleDetails.mileage}
                  onChange={(e) => setVehicleDetails({...vehicleDetails, mileage: e.target.value})}
                  placeholder={t('enter.final.mileage')}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* General Checkout Documentation */}
        <Card>
          <CardHeader>
            <CardTitle>{t('general.checkout.documentation')}</CardTitle>
          </CardHeader>
          <CardContent>
            <MediaUploader
              title={t('upload.final.inspection')}
              value={generalMedia}
              onChange={setGeneralMedia}
            />
          </CardContent>
        </Card>

        {/* Checkout Progress */}
        <Card>
          <CardHeader>
            <CardTitle>
              {t('customer.approval.progress')}: {approvedCount}/{totalItems} {t('items.approved')}
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Checkout Checklist */}
        <Card>
          <CardHeader>
            <CardTitle>{t('customer.approval.checklist')}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {t('each.item.reviewed')}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {checkoutItems.map((item, index) => (
              <CheckoutItemUploader
                key={index}
                item={item}
                index={index}
                media={getCheckoutItemData(index).media}
                onMediaChange={(media) => handleCheckoutDataChange(index, 'media', media)}
                approved={getCheckoutItemData(index).approved}
                onApprovalChange={(approved) => handleCheckoutDataChange(index, 'approved', approved)}
              />
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CheckOut;