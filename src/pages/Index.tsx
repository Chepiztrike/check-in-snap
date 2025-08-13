import hero from "@/assets/hero-garage.jpg";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Seo from "@/components/Seo";
import { CheckCircle, Wrench, Car } from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: CheckCircle,
      title: "Check-In Process",
      description: "Complete vehicle inspection with photo documentation",
      href: "/check-in",
      variant: "premium" as const
    },
    {
      icon: Wrench,
      title: "Parts & Service",
      description: "Document parts usage and service procedures",
      href: "/parts-service",
      variant: "glass" as const
    },
    {
      icon: Car,
      title: "Vehicle Check-Out",
      description: "Customer approval and quality verification",
      href: "/check-out",
      variant: "glass" as const
    }
  ];

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
          AutoCheck Pro
        </h1>
        <a href="/auth" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          Sign in
        </a>
      </header>

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-hero-gradient opacity-60" aria-hidden="true" />
          <div className="container relative z-10 mx-auto py-20">
            <div className="text-center space-y-8 max-w-4xl mx-auto">
              <h2 className="text-5xl md:text-6xl font-bold leading-tight bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
                Streamlined Car Service
                <span className="block text-4xl md:text-5xl mt-2 font-semibold">
                  Every Time
                </span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Professional vehicle documentation system with guided checklists, media capture, 
                and comprehensive reporting for modern auto service centers.
              </p>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto py-16 px-4">
          <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index} 
                  className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 glass-effect"
                >
                  <CardContent className="p-8 text-center space-y-6">
                    <div className="relative">
                      <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center glow">
                        <Icon className="w-8 h-8 text-primary-foreground" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-xl font-semibold text-foreground">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                    <a href={feature.href} className="block">
                      <Button 
                        variant={feature.variant}
                        className="w-full font-medium"
                        size="lg"
                      >
                        Get Started
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto py-16 text-center">
          <div className="space-y-6 max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold text-foreground">
              Ready to Transform Your Service Process?
            </h3>
            <p className="text-lg text-muted-foreground">
              Start with any workflow that fits your current needs.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};
export default Index;