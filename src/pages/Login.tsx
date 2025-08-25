import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Wrench, Car, Cog, User, CheckCircle, Eye, Clock4, ThumbsUp, Home, Loader2, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useClientAuth } from "@/contexts/ClientAuthContext";
import Seo from "@/components/Seo";
import LanguageToggle from "@/components/LanguageToggle";

const Login = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { signIn, loading } = useClientAuth();
  const [clientId, setClientId] = useState("");
  const [clientPassword, setClientPassword] = useState("");

  const handleClientAccess = async () => {
    if (clientId.trim() && clientPassword.trim()) {
      const { error } = await signIn(clientId.trim(), clientPassword.trim());
      if (!error) {
        navigate(`/client/${clientId.trim()}`);
      }
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
      icon: Cog
    },
    {
      title: t('vehicle.checkout'),
      description: t('checkout.description'),
      href: "/check-out",
      icon: Car
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
            onClick={() => navigate('/dashboard')}
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
                <div className="space-y-4">
                  <Button
                    onClick={() => navigate("/auth")}
                    variant="secondary"
                    className="w-full flex items-center gap-3 h-auto p-4 justify-center bg-white/10 hover:bg-white/20 border-white/20 text-white hover:text-white"
                  >
                    <User className="h-5 w-5" />
                    <div className="text-center">
                      <div className="font-medium">{t('mechanic.login')}</div>
                      <div className="text-sm opacity-90">{t('mechanic.login.description')}</div>
                    </div>
                  </Button>
                  <Separator className="bg-white/20" />
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground mb-3">Workflow Access:</p>
                    <div className="grid gap-2">
                      {mechanicOptions.map((option) => (
                        <Button
                          key={option.title}
                          onClick={() => navigate(option.href)}
                          variant="outline"
                          className="flex items-center gap-3 h-auto p-3 justify-start"
                        >
                          <option.icon className="h-4 w-4" />
                          <div className="text-left">
                            <div className="text-sm font-medium">{option.title}</div>
                            <div className="text-xs text-muted-foreground">{option.description}</div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
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
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="clientId" className="text-sm font-medium text-foreground">
                      {t('client.id')}
                    </label>
                    <Input
                      id="clientId"
                      type="text"
                      placeholder={t('enter.client.id')}
                      value={clientId}
                      onChange={(e) => setClientId(e.target.value)}
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="clientPassword" className="text-sm font-medium text-foreground">
                      {t('client.password')}
                    </label>
                    <Input
                      id="clientPassword"
                      type="password"
                      placeholder={t('enter.client.password')}
                      value={clientPassword}
                      onChange={(e) => setClientPassword(e.target.value)}
                      className="bg-background"
                    />
                  </div>
                  <Button 
                    onClick={handleClientAccess}
                    className="w-full gap-2"
                    disabled={!clientId.trim() || !clientPassword.trim() || loading}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ArrowRight className="h-4 w-4" />
                    )}
                    {loading ? t('authenticating') : t('access.client.portal')}
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