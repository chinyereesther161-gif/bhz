import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import MarketTicker from "@/components/landing/MarketTicker";
import StatsGrid from "@/components/landing/StatsGrid";
import FeaturesSection from "@/components/landing/FeaturesSection";
import ComparisonSection from "@/components/landing/ComparisonSection";
import PackagesPreview from "@/components/landing/PackagesPreview";
import FAQSection from "@/components/landing/FAQSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <MarketTicker />
      <StatsGrid />
      <FeaturesSection />
      <ComparisonSection />
      <PackagesPreview />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
