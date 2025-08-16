import { useState } from "react";
import Seo from "@/components/Seo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  async function handleSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 600));
      toast.success(t('signed.in.demo'));
      navigate("/check-in");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 600));
      toast.success(t('account.created.demo'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <Seo title="Sign in | Car Check-In" description="Secure login to start the car check-in checklist" canonical="/auth" />
      
      {/* Language Toggle */}
      <div className="absolute top-6 right-6">
        <LanguageToggle />
      </div>
      
      <div className="w-full max-w-md rounded-lg border bg-card p-6 shadow-sm">
        <h1 className="mb-2 text-2xl font-semibold">{t('welcome.back')}</h1>
        <p className="mb-6 text-muted-foreground">{t('sign.in.create.account')}</p>
        <Tabs defaultValue="signin">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">{t('sign.in')}</TabsTrigger>
            <TabsTrigger value="signup">{t('sign.up')}</TabsTrigger>
          </TabsList>
          <TabsContent value="signin" className="mt-4">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t('email')}</Label>
                <Input id="email" name="email" type="email" required autoComplete="email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t('password')}</Label>
                <Input id="password" name="password" type="password" required autoComplete="current-password" />
              </div>
              <Button type="submit" className="w-full" disabled={loading} variant="default">
                {loading ? t('please.wait') : t('sign.in')}
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="signup" className="mt-4">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-su">{t('email')}</Label>
                <Input id="email-su" name="email" type="email" required autoComplete="email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-su">{t('password')}</Label>
                <Input id="password-su" name="password" type="password" required autoComplete="new-password" />
              </div>
              <Button type="submit" className="w-full" disabled={loading} variant="secondary">
                {loading ? t('please.wait') : t('create.account')}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;
