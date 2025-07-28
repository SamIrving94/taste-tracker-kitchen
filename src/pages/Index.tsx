import HeroSection from "@/components/HeroSection";
import FeatureShowcase from "@/components/FeatureShowcase";
import RecipeShowcase from "@/components/RecipeShowcase";
import MobilePreview from "@/components/MobilePreview";
import CTASection from "@/components/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeatureShowcase />
      <RecipeShowcase />
      <MobilePreview />
      <CTASection />
    </div>
  );
};

export default Index;
