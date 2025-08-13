import { useEffect, useMemo, useRef, useState } from "react";
import Seo from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import MediaUploader, { MediaItem } from "@/components/checkin/MediaUploader";
import ChecklistItemUploader from "@/components/checkin/ChecklistItemUploader";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface StepData {
  notes?: string;
  media: MediaItem[];
  checklistMedia?: Record<number, MediaItem[]>;
}

const stepsConfig = [
  { 
    key: "vehicle", 
    title: "Vehicle details",
    checklist: []
  },
  { 
    key: "exterior", 
    title: "Exterior condition",
    checklist: [
      "Check for scratches, dents, or paint damage",
      "Inspect bumpers and body panels",
      "Examine lights (headlights, taillights, indicators)",
      "Look for rust or corrosion",
      "Check mirrors and glass condition",
      "Document any existing damage"
    ]
  },
  { 
    key: "interior", 
    title: "Interior condition",
    checklist: [
      "Test all seats and adjustments",
      "Check dashboard and instrument cluster",
      "Verify air conditioning/heating works",
      "Test radio, infotainment system",
      "Inspect upholstery for tears or stains",
      "Check seatbelts and safety features"
    ]
  },
  { 
    key: "engine", 
    title: "Engine bay",
    checklist: [
      "Check fluid levels (oil, coolant, brake fluid)",
      "Inspect belts and hoses for wear",
      "Look for leaks or corrosion",
      "Check battery terminals and condition",
      "Examine air filter condition",
      "Note any unusual sounds or smells"
    ]
  },
  { 
    key: "wheels", 
    title: "Wheels & Tires",
    checklist: [
      "Check tire tread depth and wear patterns",
      "Inspect for cuts, bulges, or damage",
      "Verify proper tire pressure",
      "Examine wheel rims for damage",
      "Check spare tire condition",
      "Look for any signs of alignment issues"
    ]
  },
  { 
    key: "warnings", 
    title: "Dash/Warning lights",
    checklist: [
      "Check engine light status",
      "Verify all dashboard lights function",
      "Note any active warning lights",
      "Test hazard lights and indicators",
      "Check fuel gauge and other gauges",
      "Document any error codes or messages"
    ]
  },
  { 
    key: "final", 
    title: "Final notes",
    checklist: [
      "Overall vehicle condition assessment",
      "Any additional concerns or observations",
      "Customer-specific requests or notes",
      "Recommended maintenance or repairs",
      "Schedule follow-up if needed"
    ]
  },
] as const;

type StepKey = typeof stepsConfig[number]["key"];

const CheckIn = () => {
  const navigate = useNavigate();
  const [stepIndex, setStepIndex] = useState(0);

  // Vehicle fields
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [plate, setPlate] = useState("");
  const [vin, setVin] = useState("");
  const [mileage, setMileage] = useState("");
  const [carModel, setCarModel] = useState("");
  const [carYear, setCarYear] = useState("");

  const [data, setData] = useState<Record<StepKey, StepData | any>>({
    vehicle: {},
    exterior: { media: [], notes: "", checklistMedia: {} },
    interior: { media: [], notes: "", checklistMedia: {} },
    engine: { media: [], notes: "", checklistMedia: {} },
    wheels: { media: [], notes: "", checklistMedia: {} },
    warnings: { media: [], notes: "", checklistMedia: {} },
    final: { media: [], notes: "", checklistMedia: {} },
  });

  const currentStep = stepsConfig[stepIndex];
  const progress = Math.round(((stepIndex + 1) / stepsConfig.length) * 100);

  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--x", `${((e.clientX - rect.left) / rect.width) * 100}%`);
      el.style.setProperty("--y", `${((e.clientY - rect.top) / rect.height) * 100}%`);
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, []);

  const canNext = useMemo(() => {
    if (currentStep.key === "vehicle") {
      return Boolean(customerName && customerPhone && customerEmail && plate && vin && mileage && carModel && carYear);
    }
    return true;
  }, [currentStep.key, customerName, customerPhone, customerEmail, plate, vin, mileage, carModel, carYear]);

  const exportCheckInData = () => {
    const checkInData = {
      vehicle: { 
        customerName, 
        customerPhone, 
        customerEmail, 
        plate, 
        vin, 
        mileage, 
        carModel, 
        carYear 
      },
      steps: data,
      timestamp: new Date().toISOString(),
      checkInId: `checkin-${Date.now()}`,
    };
    
    const dataStr = JSON.stringify(checkInData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = `car-checkin-${plate || "unknown"}-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFinish = () => {
    console.log("Check-in payload", {
      vehicle: { customerName, plate, vin, mileage },
      steps: data,
    });
    toast.success("Check-in completed!");
    navigate("/");
  };

  const stepTitle = stepsConfig[stepIndex].title;

  return (
    <div className="min-h-screen bg-background">
      <Seo title="Check-In | Guided Car Checklist" description="Step-by-step car check-in with photos, videos, and notes." canonical="/check-in" />
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto flex items-center justify-between py-4">
          <h1 className="text-lg font-semibold">Car Check-In</h1>
          <div className="text-sm text-muted-foreground">Progress: {progress}%</div>
        </div>
      </header>
      <main>
        <section ref={containerRef} className="bg-hero-gradient">
          <div className="container mx-auto py-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold">{stepTitle}</h2>
              <div className="h-2 w-48 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="rounded-lg border bg-card p-5 shadow-sm">
              {currentStep.key === "vehicle" ? (
                <div className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="customer">Customer name *</Label>
                      <Input id="customer" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone number *</Label>
                      <Input id="phone" type="tel" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email address *</Label>
                      <Input id="email" type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="plate">License plate *</Label>
                      <Input id="plate" value={plate} onChange={(e) => setPlate(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="model">Car model *</Label>
                      <Input id="model" placeholder="e.g., Honda Civic" value={carModel} onChange={(e) => setCarModel(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="year">Car year *</Label>
                      <Input id="year" placeholder="e.g., 2020" value={carYear} onChange={(e) => setCarYear(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vin">VIN *</Label>
                      <Input id="vin" value={vin} onChange={(e) => setVin(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mileage">Mileage *</Label>
                      <Input id="mileage" value={mileage} onChange={(e) => setMileage(e.target.value)} />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Vehicle Documentation</Label>
                      <div className="rounded-lg border border-dashed bg-muted/30 p-4">
                        <div className="mb-3 text-sm text-muted-foreground">
                          <p className="font-medium mb-2">Required media for vehicle intake:</p>
                          <ul className="list-disc list-inside space-y-1 text-xs">
                            <li><strong>360° video:</strong> Walk around the entire vehicle recording exterior</li>
                            <li><strong>Interior video:</strong> Record dashboard, seats, and all interior areas</li>
                            <li><strong>Documentation photos:</strong> License plate, VIN plate, odometer</li>
                          </ul>
                        </div>
                        <MediaUploader
                          title="Upload vehicle documentation"
                          value={data.vehicle?.media || []}
                          onChange={(items) =>
                            setData((prev) => ({ ...prev, vehicle: { ...prev.vehicle, media: items } }))
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {currentStep.checklist.length > 0 && (
                    <div className="space-y-3">
                      <Label>Inspection Checklist</Label>
                      <div className="space-y-2">
                        {currentStep.checklist.map((item, index) => (
                          <ChecklistItemUploader
                            key={index}
                            item={item}
                            index={index}
                            media={data[currentStep.key]?.checklistMedia?.[index] || []}
                            onMediaChange={(media) =>
                              setData((prev) => ({
                                ...prev,
                                [currentStep.key]: {
                                  ...prev[currentStep.key],
                                  checklistMedia: {
                                    ...prev[currentStep.key]?.checklistMedia,
                                    [index]: media,
                                  },
                                },
                              }))
                            }
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  <MediaUploader
                    title="Upload photos/videos"
                    value={data[currentStep.key]?.media || []}
                    onChange={(items) =>
                      setData((prev) => ({ ...prev, [currentStep.key]: { ...prev[currentStep.key], media: items } }))
                    }
                  />
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Add any specifics the technician should know..."
                      value={data[currentStep.key]?.notes || ""}
                      onChange={(e) =>
                        setData((prev) => ({ ...prev, [currentStep.key]: { ...prev[currentStep.key], notes: e.target.value } }))
                      }
                      rows={5}
                    />
                  </div>
                </div>
              )}
              <Separator className="my-6" />
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => {
                    if (stepIndex === 0) {
                      navigate("/");
                    } else {
                      setStepIndex((i) => Math.max(0, i - 1));
                    }
                  }}
                >
                  Back
                </Button>
                {stepIndex < stepsConfig.length - 1 ? (
                  <Button onClick={() => canNext && setStepIndex((i) => Math.min(stepsConfig.length - 1, i + 1))} disabled={!canNext}>
                    Next
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={exportCheckInData}>
                      Export Data
                    </Button>
                    <Button variant="default" onClick={handleFinish}>
                      Finish check-in
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CheckIn;
