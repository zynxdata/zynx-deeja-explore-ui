import HeroSection from "@/components/HeroSection";
import AGIInteraction from "@/components/AGIInteraction";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <div className="container mx-auto px-4 py-12">
        <AGIInteraction />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
