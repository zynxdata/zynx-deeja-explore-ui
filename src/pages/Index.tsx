
import HeroSection from "@/components/HeroSection";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import DebugPanel from "@/components/debug/DebugPanel";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        {/* Debug Panel - only show in development or when needed */}
        {process.env.NODE_ENV === 'development' && <DebugPanel />}
        <HeroSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
