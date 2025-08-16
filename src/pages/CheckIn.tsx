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
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import { supabase } from "@/integrations/supabase/client";
interface StepData {
  notes?: string;
  media: MediaItem[];
  checklistMedia?: Record<number, MediaItem[]>;
  checklistService?: Record<number, boolean>;
}
const getStepsConfig = (t: (key: string) => string) => [{
  key: "vehicle",
  title: t('vehicle.details'),
  checklist: []
}, {
  key: "exterior",
  title: t('exterior.condition'),
  checklist: [
    t('check.scratches.dents'),
    t('inspect.bumpers.panels'),
    t('examine.lights'),
    t('look.rust.corrosion'),
    t('check.mirrors.glass'),
    t('document.existing.damage')
  ]
}, {
  key: "interior",
  title: t('interior.condition'),
  checklist: [
    t('test.seats.adjustments'),
    t('check.dashboard.cluster'),
    t('verify.ac.heating'),
    t('test.radio.infotainment'),
    t('inspect.upholstery'),
    t('check.seatbelts.safety')
  ]
}, {
  key: "engine",
  title: t('engine.bay'),
  checklist: [
    t('check.fluid.levels'),
    t('inspect.belts.hoses'),
    t('look.leaks.corrosion'),
    t('check.battery.terminals'),
    t('examine.air.filter'),
    t('note.unusual.sounds')
  ]
}, {
  key: "wheels",
  title: t('wheels.tires'),
  checklist: [
    t('check.tire.tread'),
    t('inspect.cuts.bulges'),
    t('verify.tire.pressure'),
    t('examine.wheel.rims'),
    t('check.spare.tire'),
    t('look.alignment.issues')
  ]
}, {
  key: "warnings",
  title: t('dash.warning.lights'),
  checklist: [
    t('check.engine.light'),
    t('verify.dashboard.lights'),
    t('note.active.warnings'),
    t('test.hazard.indicators'),
    t('check.fuel.gauges'),
    t('document.error.codes')
  ]
}, {
  key: "final",
  title: t('final.notes'),
  checklist: [
    t('overall.vehicle.assessment'),
    t('additional.concerns'),
    t('customer.specific.requests'),
    t('recommended.maintenance'),
    t('schedule.followup')
  ]
}] as const;
type StepKey = "vehicle" | "exterior" | "interior" | "engine" | "wheels" | "warnings" | "final";
const CheckIn = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const stepsConfig = getStepsConfig(t);
  const [stepIndex, setStepIndex] = useState(0);
  
  // Client and check-in state
  const [clientNumber, setClientNumber] = useState<string | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);

  // Vehicle fields
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [plate, setPlate] = useState("");
  const [vin, setVin] = useState("");
  const [mileage, setMileage] = useState("");
  const [carModel, setCarModel] = useState("");
  const [carYear, setCarYear] = useState("");
  const [entryDate, setEntryDate] = useState(new Date().toISOString().split('T')[0]);
  const [data, setData] = useState<Record<StepKey, StepData | any>>({
    vehicle: {},
    exterior: {
      media: [],
      notes: "",
      checklistMedia: {},
      checklistService: {}
    },
    interior: {
      media: [],
      notes: "",
      checklistMedia: {},
      checklistService: {}
    },
    engine: {
      media: [],
      notes: "",
      checklistMedia: {},
      checklistService: {}
    },
    wheels: {
      media: [],
      notes: "",
      checklistMedia: {},
      checklistService: {}
    },
    warnings: {
      media: [],
      notes: "",
      checklistMedia: {},
      checklistService: {}
    },
    final: {
      media: [],
      notes: "",
      checklistMedia: {},
      checklistService: {}
    }
  });
  const currentStep = stepsConfig[stepIndex];
  const progress = Math.round((stepIndex + 1) / stepsConfig.length * 100);
  const containerRef = useRef<HTMLDivElement>(null);
  // Generate client ID immediately when component loads
  useEffect(() => {
    generateClientAndId();
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--x", `${(e.clientX - rect.left) / rect.width * 100}%`);
      el.style.setProperty("--y", `${(e.clientY - rect.top) / rect.height * 100}%`);
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, []);
  const canNext = useMemo(() => {
    if (currentStep.key === "vehicle") {
      return Boolean(customerName && customerPhone && customerEmail && plate && vin && mileage && carModel && carYear && entryDate);
    }
    return true;
  }, [currentStep.key, customerName, customerPhone, customerEmail, plate, vin, mileage, carModel, carYear, entryDate]);
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
        carYear,
        entryDate
      },
      steps: data,
      timestamp: new Date().toISOString(),
      checkInId: `checkin-${Date.now()}`
    };
    const dataStr = JSON.stringify(checkInData, null, 2);
    const dataBlob = new Blob([dataStr], {
      type: "application/json"
    });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `car-checkin-${plate || "unknown"}-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  const generateClientAndId = async () => {
    try {
      // First generate the client number
      const generatedNumber = await generateClientNumber();
      
      // Create a client record with the generated number
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .insert({
          client_number: generatedNumber,
          customer_name: 'Pending',
          customer_phone: '',
          customer_email: ''
        })
        .select()
        .single();

      if (clientError) throw clientError;

      setClientId(clientData.id);
      setClientNumber(generatedNumber);
    } catch (error) {
      console.error('Error generating client ID:', error);
      toast.error('Failed to generate client ID');
      // Retry once more in case of conflict
      setTimeout(() => {
        generateClientAndId();
      }, 1000);
    }
  };

  const generateClientNumber = async (): Promise<string> => {
    const { data, error } = await supabase.rpc('generate_client_number');
    if (error) throw error;
    return data;
  };

  const handleFinish = async () => {
    if (!clientId || !clientNumber) {
      toast.error('Client ID not generated. Please try again.');
      return;
    }

    try {
      // Update the client with complete customer information
      const { error: clientUpdateError } = await supabase
        .from('clients')
        .update({
          customer_name: customerName,
          customer_phone: customerPhone,
          customer_email: customerEmail
        })
        .eq('id', clientId);

      if (clientUpdateError) throw clientUpdateError;

      // Create the check-in record
      const { error: checkinError } = await supabase
        .from('checkins')
        .insert({
          client_id: clientId,
          mechanic_id: '00000000-0000-0000-0000-000000000000', // Placeholder
          vehicle_vin: vin,
          plate: plate,
          mileage: parseInt(mileage) || 0,
          status: 'submitted'
        });

      if (checkinError) throw checkinError;

      // Navigate to completion screen
      navigate(`/check-in-complete/${clientNumber}`);
    } catch (error) {
      console.error('Error completing check-in:', error);
      toast.error('Failed to complete check-in');
    }
  };
  const stepTitle = stepsConfig[stepIndex].title;
  return <div className="min-h-screen bg-background">
      <Seo title="Check-In | Guided Car Checklist" description="Step-by-step car check-in with photos, videos, and notes." canonical="/check-in" />
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto flex items-center justify-between py-4">
          <h1 className="text-lg font-semibold">{t('car.checkin')}</h1>
          <div className="flex items-center gap-4">
            {clientNumber && (
              <div className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20">
                {t('client.id')}: <span className="font-mono font-semibold">{clientNumber}</span>
              </div>
            )}
            <div className="text-sm text-muted-foreground">{t('progress')}: {progress}%</div>
            <LanguageToggle />
          </div>
        </div>
      </header>
      <main>
        <section ref={containerRef} className="bg-hero-gradient">
          <div className="container mx-auto py-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-slate-50">{stepTitle}</h2>
              <div className="h-2 w-48 overflow-hidden rounded-full bg-muted">
                <div className="h-full bg-primary transition-all" style={{
                width: `${progress}%`
              }} />
              </div>
            </div>

            <div className="rounded-lg border bg-card p-5 shadow-sm">
              {currentStep.key === "vehicle" ? <div className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="customer">{t('customer.name')} *</Label>
                      <Input id="customer" value={customerName} onChange={e => setCustomerName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t('phone.number')} *</Label>
                      <Input id="phone" type="tel" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">{t('email.address')} *</Label>
                      <Input id="email" type="email" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="plate">{t('license.plate')} *</Label>
                      <Input id="plate" value={plate} onChange={e => setPlate(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="model">{t('car.model')} *</Label>
                      <Input id="model" placeholder="e.g., Honda Civic" value={carModel} onChange={e => setCarModel(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="year">{t('car.year')} *</Label>
                      <Input id="year" placeholder="e.g., 2020" value={carYear} onChange={e => setCarYear(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vin">{t('vin')} *</Label>
                      <Input id="vin" value={vin} onChange={e => setVin(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mileage">{t('mileage')} *</Label>
                      <Input id="mileage" value={mileage} onChange={e => setMileage(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="entryDate">{t('entry.date')} *</Label>
                      <Input id="entryDate" type="date" value={entryDate} onChange={e => setEntryDate(e.target.value)} />
                    </div>
                  </div>
                  
                    <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>{t('vehicle.documentation')}</Label>
                      <div className="rounded-lg border border-dashed bg-muted/30 p-4">
                        <div className="mb-3 text-sm text-muted-foreground">
                          <p className="font-medium mb-2">{t('required.media.intake')}</p>
                          <ul className="list-disc list-inside space-y-1 text-xs">
                            <li><strong>{t('360.video.instruction')}</strong></li>
                            <li><strong>{t('interior.video.instruction')}</strong></li>
                            <li><strong>{t('documentation.photos.instruction')}</strong></li>
                          </ul>
                        </div>
                        <MediaUploader title={t('upload.vehicle.documentation')} value={data.vehicle?.media || []} onChange={items => setData(prev => ({
                      ...prev,
                      vehicle: {
                        ...prev.vehicle,
                        media: items
                      }
                    }))} />
                      </div>
                    </div>
                  </div>
                </div> : <div className="space-y-6">
                  {currentStep.checklist.length > 0 && <div className="space-y-3">
                      <Label>{t('inspection.checklist')}</Label>
                      <div className="space-y-2">
                        {currentStep.checklist.map((item, index) => <ChecklistItemUploader key={index} item={item} index={index} media={data[currentStep.key]?.checklistMedia?.[index] || []} serviceNeeded={data[currentStep.key]?.checklistService?.[index] || false} onMediaChange={media => setData(prev => ({
                    ...prev,
                    [currentStep.key]: {
                      ...prev[currentStep.key],
                      checklistMedia: {
                        ...prev[currentStep.key]?.checklistMedia,
                        [index]: media
                      }
                    }
                  }))} onServiceChange={serviceNeeded => setData(prev => ({
                    ...prev,
                    [currentStep.key]: {
                      ...prev[currentStep.key],
                      checklistService: {
                        ...prev[currentStep.key]?.checklistService,
                        [index]: serviceNeeded
                      }
                    }
                  }))} />)}
                      </div>
                    </div>}
                  <MediaUploader title={t('upload.photos.videos')} value={data[currentStep.key]?.media || []} onChange={items => setData(prev => ({
                ...prev,
                [currentStep.key]: {
                  ...prev[currentStep.key],
                  media: items
                }
              }))} />
                  <div className="space-y-2">
                    <Label htmlFor="notes">{t('notes')}</Label>
                    <Textarea id="notes" placeholder={t('add.specifics.technician')} value={data[currentStep.key]?.notes || ""} onChange={e => setData(prev => ({
                  ...prev,
                  [currentStep.key]: {
                    ...prev[currentStep.key],
                    notes: e.target.value
                  }
                }))} rows={5} />
                  </div>
                </div>}
              <Separator className="my-6" />
              <div className="flex items-center justify-between">
                <Button variant="ghost" type="button" onClick={() => {
                if (stepIndex === 0) {
                  navigate("/");
                } else {
                  setStepIndex(i => Math.max(0, i - 1));
                }
              }}>
                  {t('back')}
                </Button>
                {stepIndex < stepsConfig.length - 1 ? <Button onClick={() => canNext && setStepIndex(i => Math.min(stepsConfig.length - 1, i + 1))} disabled={!canNext}>
                    {t('next')}
                  </Button> : <div className="flex gap-2">
                    <Button variant="outline" onClick={exportCheckInData}>
                      {t('export.data')}
                    </Button>
                    <Button variant="default" onClick={handleFinish}>
                      {t('finish.checkin')}
                    </Button>
                  </div>}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>;
};
export default CheckIn;