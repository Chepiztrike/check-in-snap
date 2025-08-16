import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Seo from "@/components/Seo";
import { Wrench, User, Home } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [clientId, setClientId] = useState("");

  const handleClientAccess = () => {
    if (clientId.trim()) {
      navigate(`/client/${clientId.trim()}`);
    }
  };

  const mechanicOptions = [
    {
      title: t('checkin.process'),
      description: t('checkin.description'),
      href: "/check-in",
      icon: Wrench
    },
    {
      title: t('parts.service'),
      description: t('parts.description'),
      href: "/parts-service",
      icon: Wrench
    },
    {
      title: t('vehicle.checkout'),
      description: t('checkout.description'),
      href: "/check-out",
      icon: Wrench
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-muted/50">
      <Seo 
        title="Access Portal | AutoCheck Pro" 
        description="Access your role-specific portal - Mechanic or Client access" 
        canonical="/login" 
      />
      
      {/* Header */}
      <header className="container mx-auto flex items-center justify-between py-6 backdrop-blur-sm">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {t('autocheck.pro')}
        </h1>
        <div className="flex items-center gap-4">
          <LanguageToggle />
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            {t('home')}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-16 px-4">
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* Page Title */}
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-foreground">
              {t('access.portal')}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t('select.access.type')}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            
            {/* Mechanic Access */}
            <Card className="border-2 border-primary/20 shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4">
                  <Wrench className="w-8 h-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl break-words">{t('mechanic.access')}</CardTitle>
                <CardDescription className="break-words leading-relaxed">
                  {t('mechanic.access.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mechanicOptions.map((option, index) => (
                   <Button
                     key={index}
                     variant="outline"
                     className="w-full justify-start h-auto p-4 min-h-[100px] overflow-hidden"
                     onClick={() => navigate(option.href)}
                   >
                     <div className="text-left w-full pr-2">
                       <div className="font-medium text-base mb-2 line-clamp-1">{option.title}</div>
                       <div className="text-sm text-muted-foreground leading-tight line-clamp-2">
                         {option.description}
                       </div>
                     </div>
                   </Button>
                ))}
              </CardContent>
            </Card>

            {/* Client Access */}
            <Card className="border-2 border-accent/20 shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center mb-4">
                  <User className="w-8 h-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl break-words">{t('client.access')}</CardTitle>
                <CardDescription className="break-words leading-relaxed">
                  {t('client.access.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Input
                    placeholder={`${t('client.id')} (e.g., CLT-2024-0001)`}
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleClientAccess()}
                    className="text-center"
                  />
                  <Button 
                    onClick={handleClientAccess}
                    disabled={!clientId.trim()}
                    className="w-full font-medium"
                    size="lg"
                  >
                    {t('access.portal.button')}
                  </Button>
                </div>
                <Separator />
                <div className="px-2 py-3 bg-muted/30 rounded-lg">
                  <p className="text-sm font-medium text-center mb-3 text-foreground">{t('client.portal.features')}</p>
                  <ul className="text-xs space-y-2 max-w-full">
                    <li className="flex items-start gap-2">
                      <span className="text-accent flex-shrink-0">•</span>
                      <span className="break-words">{t('view.inspection.results')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent flex-shrink-0">•</span>
                      <span className="break-words">{t('approve.services')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent flex-shrink-0">•</span>
                      <span className="break-words">{t('track.real.time')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent flex-shrink-0">•</span>
                      <span className="break-words">{t('approve.checkout')}</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;