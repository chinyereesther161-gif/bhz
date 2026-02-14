import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import MarketTicker from "@/components/landing/MarketTicker";
import StatsGrid from "@/components/landing/StatsGrid";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import ComparisonSection from "@/components/landing/ComparisonSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import PackagesPreview from "@/components/landing/PackagesPreview";
import FAQSection from "@/components/landing/FAQSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <HeroSection />
    <MarketTicker />
    <StatsGrid />
    <FeaturesSection />
    <HowItWorksSection />
    <ComparisonSection />
    <TestimonialsSection />
    <PackagesPreview />
    <FAQSection />
    <CTASection />
    <Footer />
  </div>
);

export default Index;
