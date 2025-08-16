import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Download, Plus, ArrowLeft } from "lucide-react";
import Seo from "@/components/Seo";
import PartsItemUploader from "@/components/service/PartsItemUploader";
import MediaUploader, { MediaItem } from "@/components/checkin/MediaUploader";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import { supabase } from "@/integrations/supabase/client";

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
  const [clientId, setClientId] = useState("");
  const { t } = useLanguage();
  
  // Load client ID from URL or prompt user to enter it
  useEffect(() => {
    const urlClientId = searchParams.get('clientId');
    if (urlClientId) {
      setClientId(urlClientId);
      loadClientData(urlClientId);
    }
  }, [searchParams]);

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
  const [loading, setLoading] = useState(false);

  const loadClientData = async (clientNumber: string) => {
    if (!clientNumber) return;
    
    setLoading(true);
    try {
      // Load client info
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('client_number', clientNumber)
        .maybeSingle();

      if (clientError) throw clientError;
      if (!clientData) {
        toast({
          title: "Client not found",
          description: "Please check the client ID and try again.",
          variant: "destructive"
        });
        return;
      }

      // Load checkin data for vehicle details
      const { data: checkinData, error: checkinError } = await supabase
        .from('checkins')
        .select('*')
        .eq('client_id', clientData.id)
        .maybeSingle();

      if (checkinData) {
        setVehicleDetails({
          customerName: clientData.customer_name,
          customerPhone: clientData.customer_phone,
          customerEmail: clientData.customer_email,
          carModel: checkinData.car_model || "",
          carYear: checkinData.car_year || "",
          entryDate: new Date().toISOString().split('T')[0],
          licensePlate: checkinData.plate || "",
          mileage: checkinData.mileage?.toString() || "",
        });
      }
    } catch (error) {
      console.error('Error loading client data:', error);
      toast({
        title: "Error loading data",
        description: "Failed to load client information.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClientIdSubmit = () => {
    if (clientId.trim()) {
      setSearchParams({ clientId: clientId.trim() });
      loadClientData(clientId.trim());
    }
  };

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

  const handleExport = () => {
    const exportData = {
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
    
    const exportFileDefaultName = `parts-service-${vehicleDetails.licensePlate || 'unknown'}-${new Date().toISOString().split('T')[0]}.json`;
    
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
          <a href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('back')}
            </Button>
          </a>
          <h1 className="text-2xl font-semibold">{t('parts.service.documentation')}</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button onClick={handleExport} className="gap-2" disabled={!clientId}>
            <Download className="h-4 w-4" />
            {t('export.data')}
          </Button>
          <LanguageToggle />
        </div>
      </header>

      <main className="container mx-auto space-y-8 pb-8">
        {!searchParams.get('clientId') && (
          <Card>
            <CardHeader>
              <CardTitle>Enter Client ID</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Input
                  placeholder="Enter client ID (e.g., CLT-2025-0001)"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleClientIdSubmit()}
                />
                <Button onClick={handleClientIdSubmit} disabled={!clientId.trim()}>
                  Load Client
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {searchParams.get('clientId') && (
          <>
            {loading && (
              <Card>
                <CardContent className="py-8">
                  <div className="text-center">Loading client data...</div>
                </CardContent>
              </Card>
            )}
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
                  disabled={loading}
                />
              </div>
              <div>
                <Label htmlFor="customerPhone">{t('phone.number')}</Label>
                <Input
                  id="customerPhone"
                  value={vehicleDetails.customerPhone}
                  onChange={(e) => setVehicleDetails({...vehicleDetails, customerPhone: e.target.value})}
                  placeholder={t('enter.phone.number')}
                  disabled={loading}
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
                  disabled={loading}
                />
              </div>
              <div>
                <Label htmlFor="carModel">{t('car.model')}</Label>
                <Input
                  id="carModel"
                  value={vehicleDetails.carModel}
                  onChange={(e) => setVehicleDetails({...vehicleDetails, carModel: e.target.value})}
                  placeholder={t('enter.car.model')}
                  disabled={loading}
                />
              </div>
              <div>
                <Label htmlFor="carYear">{t('year')}</Label>
                <Input
                  id="carYear"
                  value={vehicleDetails.carYear}
                  onChange={(e) => setVehicleDetails({...vehicleDetails, carYear: e.target.value})}
                  placeholder={t('enter.year')}
                  disabled={loading}
                />
              </div>
              <div>
                <Label htmlFor="entryDate">{t('service.date')}</Label>
                <Input
                  id="entryDate"
                  type="date"
                  value={vehicleDetails.entryDate}
                  onChange={(e) => setVehicleDetails({...vehicleDetails, entryDate: e.target.value})}
                  disabled={loading}
                />
              </div>
              <div>
                <Label htmlFor="licensePlate">{t('license.plate')}</Label>
                <Input
                  id="licensePlate"
                  value={vehicleDetails.licensePlate}
                  onChange={(e) => setVehicleDetails({...vehicleDetails, licensePlate: e.target.value})}
                  placeholder={t('enter.license.plate')}
                  disabled={loading}
                />
              </div>
              <div>
                <Label htmlFor="mileage">{t('mileage')}</Label>
                <Input
                  id="mileage"
                  value={vehicleDetails.mileage}
                  onChange={(e) => setVehicleDetails({...vehicleDetails, mileage: e.target.value})}
                  placeholder={t('current.mileage')}
                  disabled={loading}
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
        </>
        )}
      </main>
    </div>
  );
};

export default PartsService;