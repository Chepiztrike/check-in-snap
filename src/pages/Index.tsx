import { Helmet } from "react-helmet-async";
import hero from "@/assets/hero-garage.jpg";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Car Check-In Checklist | Fast shop intake</title>
        <meta name="description" content="Guided car check-in with photos, videos, and notes for efficient service intake." />
        <link rel="canonical" href="/" />
      </Helmet>
      <header className="container mx-auto flex items-center justify-between py-6">
        <h1 className="text-2xl font-semibold">Car Check-In</h1>
        <a href="/auth" className="text-sm text-muted-foreground hover:underline">Sign in</a>
      </header>
      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-hero-gradient" aria-hidden="true" />
          <div className="container relative z-10 mx-auto grid gap-8 py-16 md:grid-cols-2 md:items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold leading-tight">Streamlined car check-in, every time</h2>
              <p className="text-lg text-muted-foreground max-w-prose">
                Start a guided checklist that captures photos, videos, and technician notes at each step. Faster intake,
                fewer surprises, better documentation.
              </p>
              <div className="flex gap-3">
                <a href="/check-in">
                  <Button variant="hero" className="px-6">Start Check-In</Button>
                </a>
                <a href="/check-in">
                  <Button variant="outline">Try the demo</Button>
                </a>
              </div>
            </div>
            <div className="relative">
              <img
                src={hero}
                alt="Professional auto repair shop check-in visual"
                className="w-full rounded-xl border shadow-md"
                loading="lazy"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
