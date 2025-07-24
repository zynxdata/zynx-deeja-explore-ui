
import HeroSection from "@/components/HeroSection";
import ContextEngine from "@/components/ContextEngine";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        <HeroSection />
        <ContextEngine />
      </div>
    </div>
  );
};

export default Index;
