import { useEffect } from "react";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import MarketTicker from "@/components/landing/MarketTicker";
import StatsGrid from "@/components/landing/StatsGrid";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import VisualGuideSection from "@/components/landing/VisualGuideSection";
import ComparisonSection from "@/components/landing/ComparisonSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import PackagesPreview from "@/components/landing/PackagesPreview";
import FAQSection from "@/components/landing/FAQSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  useEffect(() => {
    const trackVisit = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const device = /Mobile|Android|iPhone/i.test(navigator.userAgent) ? "Mobile" : "Desktop";
        await supabase.functions.invoke("track-visit", {
          body: {
            user_id: session?.user?.id || null,
            page: "/",
            device,
          },
        });
      } catch {}
    };
    trackVisit();
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <MarketTicker />
      <StatsGrid />
      <FeaturesSection />
      <HowItWorksSection />
      <VisualGuideSection />
      <ComparisonSection />
      <TestimonialsSection />
      <PackagesPreview />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
