import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Seo } from "@/components/Seo";
import LanguageToggle from "@/components/LanguageToggle";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp, resetPassword, user } = useAuth();
  const { t } = useLanguage();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || "/login";
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    const { error } = await signIn(email, password);
    
    if (!error) {
      const from = location.state?.from?.pathname || "/login";
      navigate(from, { replace: true });
    }
    
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const skipVerification = formData.get('skipVerification') === 'on';
    
    await signUp(email, password, skipVerification);
    setLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('resetEmail') as string;
    
    const { error } = await resetPassword(email);
    if (!error) {
      setResetEmailSent(true);
    }
    setLoading(false);
  };

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
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  required 
                  autoComplete="email"
                  placeholder="Enter your email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t('password')}</Label>
                <Input 
                  id="password" 
                  name="password" 
                  type="password" 
                  required 
                  autoComplete="current-password"
                  placeholder="Enter your password"
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading} variant="default">
                {loading ? t('please.wait') : t('sign.in')}
              </Button>
              <div className="text-center">
                <Button 
                  type="button" 
                  variant="link" 
                  className="text-sm text-muted-foreground" 
                  onClick={() => setShowForgotPassword(true)}
                >
                  Forgot your password?
                </Button>
              </div>
            </form>
          </TabsContent>
          <TabsContent value="signup" className="mt-4">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-su">{t('email')}</Label>
                <Input 
                  id="email-su" 
                  name="email" 
                  type="email" 
                  required 
                  autoComplete="email"
                  placeholder="Enter your email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-su">{t('password')}</Label>
                <Input 
                  id="password-su" 
                  name="password" 
                  type="password" 
                  required 
                  autoComplete="new-password"
                  minLength={6}
                  placeholder="Create a password (min 6 characters)"
                />
              </div>
              <Alert className="border-amber-200 bg-amber-50">
                <AlertDescription className="text-sm">
                  <strong>Having trouble receiving verification emails?</strong> Check the box below to create your account immediately without email verification. You can always verify your email later.
                </AlertDescription>
              </Alert>
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="skipVerification" 
                  name="skipVerification" 
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="skipVerification" className="text-sm">
                  Skip email verification (for testing)
                </Label>
              </div>
              <Button type="submit" className="w-full" disabled={loading} variant="secondary">
                {loading ? t('please.wait') : t('create.account')}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Reset Password</CardTitle>
              <CardDescription>
                {resetEmailSent 
                  ? "Check your email for a password reset link."
                  : "Enter your email address and we'll send you a link to reset your password."
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!resetEmailSent ? (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="resetEmail">Email</Label>
                    <Input 
                      id="resetEmail" 
                      name="resetEmail" 
                      type="email" 
                      required 
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button type="submit" disabled={loading} className="flex-1">
                      {loading ? 'Sending...' : 'Send Reset Link'}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowForgotPassword(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    If you don't see the email in your inbox within a few minutes, please check your spam folder.
                  </p>
                  <Button 
                    onClick={() => {
                      setShowForgotPassword(false);
                      setResetEmailSent(false);
                    }}
                    className="w-full"
                  >
                    Close
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Auth;