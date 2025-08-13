import { useState } from "react";
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

interface PartEntry {
  id: string;
  serialNumber: string;
  partName: string;
  media: MediaItem[];
  justification: string;
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

  const addPart = () => {
    const newPart: PartEntry = {
      id: `part-${Date.now()}`,
      serialNumber: "",
      partName: "",
      media: [],
      justification: "",
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
      title: "Data exported successfully",
      description: "Parts service data has been downloaded as JSON file.",
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
              Back
            </Button>
          </a>
          <h1 className="text-2xl font-semibold">Parts & Service Documentation</h1>
        </div>
        <Button onClick={handleExport} className="gap-2">
          <Download className="h-4 w-4" />
          Export Data
        </Button>
      </header>

      <main className="container mx-auto space-y-8 pb-8">
        {/* Vehicle Details */}
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customerName">Customer Name</Label>
                <Input
                  id="customerName"
                  value={vehicleDetails.customerName}
                  onChange={(e) => setVehicleDetails({...vehicleDetails, customerName: e.target.value})}
                  placeholder="Enter customer name"
                />
              </div>
              <div>
                <Label htmlFor="customerPhone">Phone Number</Label>
                <Input
                  id="customerPhone"
                  value={vehicleDetails.customerPhone}
                  onChange={(e) => setVehicleDetails({...vehicleDetails, customerPhone: e.target.value})}
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <Label htmlFor="customerEmail">Email</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={vehicleDetails.customerEmail}
                  onChange={(e) => setVehicleDetails({...vehicleDetails, customerEmail: e.target.value})}
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <Label htmlFor="carModel">Car Model</Label>
                <Input
                  id="carModel"
                  value={vehicleDetails.carModel}
                  onChange={(e) => setVehicleDetails({...vehicleDetails, carModel: e.target.value})}
                  placeholder="Enter car model"
                />
              </div>
              <div>
                <Label htmlFor="carYear">Year</Label>
                <Input
                  id="carYear"
                  value={vehicleDetails.carYear}
                  onChange={(e) => setVehicleDetails({...vehicleDetails, carYear: e.target.value})}
                  placeholder="Enter year"
                />
              </div>
              <div>
                <Label htmlFor="entryDate">Service Date</Label>
                <Input
                  id="entryDate"
                  type="date"
                  value={vehicleDetails.entryDate}
                  onChange={(e) => setVehicleDetails({...vehicleDetails, entryDate: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="licensePlate">License Plate</Label>
                <Input
                  id="licensePlate"
                  value={vehicleDetails.licensePlate}
                  onChange={(e) => setVehicleDetails({...vehicleDetails, licensePlate: e.target.value})}
                  placeholder="Enter license plate"
                />
              </div>
              <div>
                <Label htmlFor="mileage">Mileage</Label>
                <Input
                  id="mileage"
                  value={vehicleDetails.mileage}
                  onChange={(e) => setVehicleDetails({...vehicleDetails, mileage: e.target.value})}
                  placeholder="Enter current mileage"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* General Service Documentation */}
        <Card>
          <CardHeader>
            <CardTitle>General Service Documentation</CardTitle>
          </CardHeader>
          <CardContent>
            <MediaUploader
              title="Upload general service photos/videos"
              value={generalMedia}
              onChange={setGeneralMedia}
            />
          </CardContent>
        </Card>

        {/* Parts Used */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Parts Used in Service
              <Button onClick={addPart} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Part
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {parts.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No parts added yet. Click "Add Part" to document parts used in this service.
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