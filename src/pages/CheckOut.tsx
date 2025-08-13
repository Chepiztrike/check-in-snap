import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Download, ArrowLeft } from "lucide-react";
import Seo from "@/components/Seo";
import CheckoutItemUploader from "@/components/checkout/CheckoutItemUploader";
import MediaUploader, { MediaItem } from "@/components/checkin/MediaUploader";

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

const checkoutItems = [
  "Exterior condition - no new damage",
  "Interior cleanliness and condition", 
  "All lights functioning properly",
  "Engine compartment inspection",
  "Fluid levels checked",
  "Tire condition and pressure",
  "Battery terminals and connections",
  "Windshield and mirrors clean",
  "Service work completed as requested",
  "All tools and equipment removed",
  "Test drive completed successfully",
  "Customer walkthrough completed"
];

const CheckOut = () => {
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

  const handleExport = () => {
    const exportData = {
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
    
    const exportFileDefaultName = `checkout-${vehicleDetails.licensePlate || 'unknown'}-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    toast({
      title: "Checkout data exported successfully",
      description: "Vehicle checkout data has been downloaded as JSON file.",
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
              Back
            </Button>
          </a>
          <h1 className="text-2xl font-semibold">Vehicle Check-Out</h1>
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
                <Label htmlFor="checkoutDate">Checkout Date</Label>
                <Input
                  id="checkoutDate"
                  type="date"
                  value={vehicleDetails.checkoutDate}
                  onChange={(e) => setVehicleDetails({...vehicleDetails, checkoutDate: e.target.value})}
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
                <Label htmlFor="mileage">Final Mileage</Label>
                <Input
                  id="mileage"
                  value={vehicleDetails.mileage}
                  onChange={(e) => setVehicleDetails({...vehicleDetails, mileage: e.target.value})}
                  placeholder="Enter final mileage"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* General Checkout Documentation */}
        <Card>
          <CardHeader>
            <CardTitle>General Checkout Documentation</CardTitle>
          </CardHeader>
          <CardContent>
            <MediaUploader
              title="Upload final inspection photos/videos"
              value={generalMedia}
              onChange={setGeneralMedia}
            />
          </CardContent>
        </Card>

        {/* Checkout Progress */}
        <Card>
          <CardHeader>
            <CardTitle>
              Customer Approval Progress: {approvedCount}/{totalItems} items approved
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Checkout Checklist */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Approval Checklist</CardTitle>
            <p className="text-sm text-muted-foreground">
              Each item must be reviewed with the customer and approved before vehicle pickup.
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