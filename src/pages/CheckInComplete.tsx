import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Copy, Phone, Mail, Car, QrCode } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";

const CheckInComplete = () => {
  const { clientNumber } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const clientPortalUrl = `${window.location.origin}/client/${clientNumber}`;

  const handleCopyClientId = () => {
    if (clientNumber) {
      navigator.clipboard.writeText(clientNumber);
      setCopied(true);
      toast.success(t('client.id.copied'));
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(clientPortalUrl);
    toast.success(t('tracking.url.copied'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-green-700 dark:text-green-300">
              {t('checkin.completed')}
            </h1>
            <p className="text-green-600 dark:text-green-400">
              {t('vehicle.successfully.registered')}
            </p>
          </div>
          <LanguageToggle />
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Success Card */}
          <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
            <CardHeader className="text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-green-500 flex items-center justify-center mb-4">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl text-green-700 dark:text-green-300">
                {t('check.in.successful')}
              </CardTitle>
              <CardDescription className="text-green-600 dark:text-green-400">
                {t('client.id.generated.instructions')}
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Client ID Card */}
          <Card className="border-2 border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                {t('your.client.id')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{t('client.id')}</p>
                  <p className="text-2xl font-bold font-mono">{clientNumber}</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleCopyClientId}
                  className="flex items-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  {copied ? t('copied') : t('copy')}
                </Button>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">{t('tracking.url')}</p>
                <div className="flex items-center gap-2 p-3 bg-muted rounded border text-sm break-all">
                  <span className="flex-1">{clientPortalUrl}</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleCopyUrl}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Instructions Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                {t('next.steps')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="mt-1">1</Badge>
                  <div>
                    <p className="font-medium">{t('save.client.id')}</p>
                    <p className="text-sm text-muted-foreground">{t('save.client.id.description')}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="mt-1">2</Badge>
                  <div>
                    <p className="font-medium">{t('track.progress')}</p>
                    <p className="text-sm text-muted-foreground">{t('track.progress.description')}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="mt-1">3</Badge>
                  <div>
                    <p className="font-medium">{t('approve.services')}</p>
                    <p className="text-sm text-muted-foreground">{t('approve.services.description')}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={() => navigate(`/client/${clientNumber}`)}
              className="flex-1"
              size="lg"
            >
              {t('view.service.status')}
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/')}
              className="flex-1"
              size="lg"
            >
              {t('back.to.home')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckInComplete;