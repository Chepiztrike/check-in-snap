import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Download, Plus, ArrowLeft } from "lucide-react";
import Seo from "@/components/Seo";
import PartsItemUploader from "@/components/service/PartsItemUploader";
import MediaUploader, { MediaItem } from "@/components/checkin/MediaUploader";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";

interface PartEntry {
  id: string;
  serialNumber: string;
  partName: string;
  media: MediaItem[];
  justification: string;
  serialPhoto?: MediaItem[];
}

interface VehicleDetails {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  carModel: string;
  carYear: string;
  entryDate: string;
  licensePlate: string;
  mileage: string;
}

const PartsService = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [clientIdInput, setClientIdInput] = useState(searchParams.get('clientId') || '');
  const clientId = searchParams.get('clientId');
  const { t } = useLanguage();
  
  // All hooks must be declared before any conditional returns
  const [vehicleDetails, setVehicleDetails] = useState<VehicleDetails>({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    carModel: "",
    carYear: "",
    entryDate: new Date().toISOString().split('T')[0],
    licensePlate: "",
    mileage: "",
  });
  
  const [generalMedia, setGeneralMedia] = useState<MediaItem[]>([]);
  const [parts, setParts] = useState<PartEntry[]>([]);
  
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
        // Handle case where client data might be incomplete (customer_name = "Pending")
        const isIncompleteClient = clientData.customer_name === 'Pending' || 
                                  !clientData.customer_name || 
                                  !clientData.customer_phone || 
                                  !clientData.customer_email;
        
        setVehicleDetails({
          customerName: isIncompleteClient ? "" : (clientData.customer_name || ""),
          customerPhone: isIncompleteClient ? "" : (clientData.customer_phone || ""),
          customerEmail: isIncompleteClient ? "" : (clientData.customer_email || ""),
          carModel: checkinData?.car_model || "",
          carYear: checkinData?.car_year || "",
          entryDate: new Date().toISOString().split('T')[0],
          licensePlate: checkinData?.plate || "",
          mileage: checkinData?.mileage?.toString() || "",
        });
        
        // Load existing parts service session if exists
        const { data: sessionData } = await supabase
          .from('parts_service_sessions')
          .select('*')
          .eq('client_id', clientData.id)
          .maybeSingle();
          
        if (sessionData) {
          setGeneralMedia((sessionData.general_media as unknown as MediaItem[]) || []);
          setParts((sessionData.parts_data as unknown as PartEntry[]) || []);
        }
        
        // Show a toast if client data is incomplete
        if (isIncompleteClient) {
          toast({
            title: 'Incomplete Client Information',
            description: 'Please fill in the customer details below as they were not completed during check-in.',
            variant: 'default'
          });
        }
      }
    } catch (error) {
      console.error('Error loading client data:', error);
      toast({
        title: 'Error loading client data',
        description: 'Could not load existing client information.',
        variant: 'destructive'
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
              {t('parts.service.documentation')}
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
  

  const addPart = () => {
    const newPart: PartEntry = {
      id: `part-${Date.now()}`,
      serialNumber: "",
      partName: "",
      media: [],
      justification: "",
      serialPhoto: [],
    };
    setParts([...parts, newPart]);
  };

  const updatePart = (id: string, field: keyof PartEntry, value: any) => {
    setParts(parts.map(part => 
      part.id === id ? { ...part, [field]: value } : part
    ));
  };

  const removePart = (id: string) => {
    setParts(parts.filter(part => part.id !== id));
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

      // Update client information if customer details have been filled in
      if (vehicleDetails.customerName && vehicleDetails.customerPhone && vehicleDetails.customerEmail) {
        const { error: clientUpdateError } = await supabase
          .from('clients')
          .update({
            customer_name: vehicleDetails.customerName,
            customer_phone: vehicleDetails.customerPhone,
            customer_email: vehicleDetails.customerEmail
          })
          .eq('id', clientData.id);

        if (clientUpdateError) {
          console.error('Error updating client:', clientUpdateError);
          // Don't throw here, just log - we can still save the service session
        }
      }

      // Save or update parts service session
      const { error: sessionError } = await supabase
        .from('parts_service_sessions')
        .upsert({
          client_id: clientData.id,
          vehicle_details: vehicleDetails as any,
          general_media: generalMedia as any,
          parts_data: parts as any,
          status: 'completed'
        }, {
          onConflict: 'client_id'
        });

      if (sessionError) throw sessionError;

      toast({
        title: t('data.saved.successfully'),
        description: t('parts.service.saved'),
      });
    } catch (error) {
      console.error('Error saving parts service data:', error);
      toast({
        title: 'Error saving data',
        description: 'Could not save parts service information.',
        variant: 'destructive'
      });
    }
  };

  const handleExport = () => {
    const exportData = {
      clientId,
      vehicleDetails,
      generalMedia: generalMedia.map(item => ({ url: item.url, type: item.type })),
      parts: parts.map(part => ({
        serialNumber: part.serialNumber,
        partName: part.partName,
        justification: part.justification,
        media: part.media.map(item => ({ url: item.url, type: item.type }))
      })),
      exportDate: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `parts-service-${clientId}-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    toast({
      title: t('data.exported.successfully'),
      description: t('parts.service.downloaded'),
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Seo 
        title="Parts & Service Documentation | Car Service"
        description="Document parts used during vehicle service with serial numbers, media proof, and justifications."
        canonical="/parts-service"
      />
      
      <header className="container mx-auto flex items-center justify-between py-6">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('back')}
            </Button>
          </Link>
          <h1 className="text-2xl font-semibold">{t('parts.service.documentation')}</h1>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customerName">{t('customer.name')}</Label>
                <Input
                  id="customerName"
                  value={vehicleDetails.customerName}
                  onChange={(e) => setVehicleDetails({...vehicleDetails, customerName: e.target.value})}
                  placeholder={t('enter.customer.name')}
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
                <Label htmlFor="entryDate">{t('service.date')}</Label>
                <Input
                  id="entryDate"
                  type="date"
                  value={vehicleDetails.entryDate}
                  onChange={(e) => setVehicleDetails({...vehicleDetails, entryDate: e.target.value})}
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
                <Label htmlFor="mileage">{t('mileage')}</Label>
                <Input
                  id="mileage"
                  value={vehicleDetails.mileage}
                  onChange={(e) => setVehicleDetails({...vehicleDetails, mileage: e.target.value})}
                  placeholder={t('current.mileage')}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* General Service Documentation */}
        <Card>
          <CardHeader>
            <CardTitle>{t('general.service.documentation')}</CardTitle>
          </CardHeader>
          <CardContent>
            <MediaUploader
              title={t('upload.general.service')}
              value={generalMedia}
              onChange={setGeneralMedia}
            />
          </CardContent>
        </Card>

        {/* Parts Used */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {t('parts.used.service')}
              <Button onClick={addPart} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                {t('add.part')}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {parts.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                {t('no.parts.added')}
              </p>
            ) : (
              parts.map((part) => (
                <PartsItemUploader
                  key={part.id}
                  part={part}
                  onUpdate={(field, value) => updatePart(part.id, field, value)}
                  onRemove={() => removePart(part.id)}
                />
              ))
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default PartsService;