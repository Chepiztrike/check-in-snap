import { useEffect, useMemo, useRef, useState } from "react";
import Seo from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import MediaUploader, { MediaItem } from "@/components/checkin/MediaUploader";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface StepData {
  notes?: string;
  media: MediaItem[];
}

const stepsConfig = [
  { key: "vehicle", title: "Vehicle details" },
  { key: "exterior", title: "Exterior condition" },
  { key: "interior", title: "Interior condition" },
  { key: "engine", title: "Engine bay" },
  { key: "wheels", title: "Wheels & Tires" },
  { key: "warnings", title: "Dash/Warning lights" },
  { key: "final", title: "Final notes" },
] as const;

type StepKey = typeof stepsConfig[number]["key"];

const CheckIn = () => {
  const navigate = useNavigate();
  const [stepIndex, setStepIndex] = useState(0);

  // Vehicle fields
  const [customerName, setCustomerName] = useState("");
  const [plate, setPlate] = useState("");
  const [vin, setVin] = useState("");
  const [mileage, setMileage] = useState("");

  const [data, setData] = useState<Record<StepKey, StepData | any>>({
    vehicle: {},
    exterior: { media: [], notes: "" },
    interior: { media: [], notes: "" },
    engine: { media: [], notes: "" },
    wheels: { media: [], notes: "" },
    warnings: { media: [], notes: "" },
    final: { media: [], notes: "" },
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
      return Boolean(customerName && plate && vin && mileage);
    }
    return true;
  }, [currentStep.key, customerName, plate, vin, mileage]);

  const handleFinish = () => {
    console.log("Check-in payload", {
      vehicle: { customerName, plate, vin, mileage },
      steps: data,
    });
    toast.success("Check-in completed and saved (demo mode)");
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
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="customer">Customer name</Label>
                    <Input id="customer" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="plate">License plate</Label>
                    <Input id="plate" value={plate} onChange={(e) => setPlate(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vin">VIN</Label>
                    <Input id="vin" value={vin} onChange={(e) => setVin(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mileage">Mileage</Label>
                    <Input id="mileage" value={mileage} onChange={(e) => setMileage(e.target.value)} />
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
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
                  <Button variant="default" onClick={handleFinish}>
                    Finish check-in
                  </Button>
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
