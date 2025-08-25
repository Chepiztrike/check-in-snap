import hero from "@/assets/hero-garage.jpg";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Seo from "@/components/Seo";
import { CheckCircle, Wrench, Car, Search, LogOut } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [clientId, setClientId] = useState("");
  
  const features = [
    {
      icon: CheckCircle,
      title: t('checkin.process'),
      description: t('checkin.description'),
      href: "/check-in",
      variant: "default" as const
    },
    {
      icon: Wrench,
      title: t('parts.service'),
      description: t('parts.description'),
      href: "/parts-service",
      variant: "default" as const
    },
    {
      icon: Car,
      title: t('vehicle.checkout'),
      description: t('checkout.description'),
      href: "/check-out",
      variant: "default" as const
    }
  ];

  const handleTrackService = () => {
    if (clientId.trim()) {
      navigate(`/client/${clientId.trim()}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-muted/50">
      <Seo 
        title="Car Check-In Checklist | Fast shop intake" 
        description="Guided car check-in with photos, videos, and notes for efficient service intake." 
        canonical="/" 
      />
      
      {/* Header */}
      <header className="container mx-auto flex items-center justify-between py-6 backdrop-blur-sm">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {t('autocheck.pro')}
        </h1>
        <div className="flex items-center gap-4">
          <LanguageToggle />
          {user ? (
            <Button
              onClick={signOut}
              variant="outline"
              size="sm"
              className="text-sm"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          ) : (
            <a href="/auth" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t('sign.in')}
            </a>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="container relative z-10 mx-auto py-20">
            <div className="text-center space-y-8 max-w-4xl mx-auto px-4">
              <div className="bg-gradient-to-br from-primary to-accent p-6 sm:p-12 md:p-16 rounded-2xl shadow-2xl">
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
                  {t('streamlined.car.service')}
                  <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl mt-2 font-semibold">
                    {t('every.time')}
                  </span>
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed mt-4 sm:mt-6 px-2">
                  {t('professional.vehicle.description')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mechanic Workflow - Only show if authenticated */}
        {user && (
          <section className="container mx-auto py-16 px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center space-y-4 mb-12">
                <h3 className="text-3xl font-bold text-foreground">
                  {t('mechanic.workflow')}
                </h3>
                <p className="text-lg text-muted-foreground">
                  {t('mechanic.next.steps')}
                </p>
              </div>
              <div className="grid gap-6 md:grid-cols-3">
                {features.map((feature) => (
                  <Card key={feature.title} className="border-2 border-primary/20 shadow-lg hover:shadow-xl transition-shadow">
                    <CardContent className="p-6 text-center space-y-4">
                      <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <feature.icon className="w-8 h-8 text-primary-foreground" />
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-xl font-semibold text-foreground">
                          {feature.title}
                        </h4>
                        <p className="text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                      <Button 
                        onClick={() => navigate(feature.href)}
                        className="w-full font-medium"
                        variant={feature.variant}
                      >
                        {t('get.started')}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Access Portal - Only show if not authenticated */}
        {!user && (
          <section className="container mx-auto py-16 px-4">
            <div className="max-w-2xl mx-auto text-center">
              <Card className="border-2 border-primary/20 shadow-lg">
                <CardContent className="p-8 space-y-6">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-semibold text-foreground">
                      {t('access.system')}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {t('access.system.description')}
                    </p>
                  </div>
                  <Button 
                    onClick={() => navigate('/login')}
                    className="w-full font-medium"
                    size="lg"
                  >
                    {t('access.portal')}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* Client Tracking Section */}
        <section className="container mx-auto py-16 px-4">
          <div className="max-w-md mx-auto">
            <Card className="border-2 border-accent/20 shadow-lg">
              <CardContent className="p-8 text-center space-y-6">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                  <Search className="w-8 h-8 text-primary-foreground" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-foreground">
                    {t('client.tracking')}
                  </h3>
                  <p className="text-muted-foreground">
                    {t('track.service.progress')}
                  </p>
                </div>
                <div className="space-y-3">
                  <Input
                    placeholder={`${t('client.id')} (e.g., CLT-2024-0001)`}
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleTrackService()}
                  />
                  <Button 
                    onClick={handleTrackService}
                    disabled={!clientId.trim()}
                    className="w-full font-medium"
                    size="lg"
                  >
                    {t('track.service')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto py-16 text-center">
          <div className="space-y-6 max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold text-foreground">
              {t('ready.transform')}
            </h3>
            <p className="text-lg text-muted-foreground">
              {t('start.workflow')}
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};
export default Index;