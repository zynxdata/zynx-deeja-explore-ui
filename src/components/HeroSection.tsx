import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, Sparkles, Zap, Server, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { apiService, type AGIResponse, type DeejaResponse } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const HeroSection = () => {
  const [agiInfo, setAgiInfo] = useState<AGIResponse | null>(null);
  const [deejaInfo, setDeejaInfo] = useState<DeejaResponse | null>(null);
  const [backendStatus, setBackendStatus] = useState<'loading' | 'connected' | 'disconnected'>('loading');
  const { toast } = useToast();

  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        const isAvailable = await apiService.isBackendAvailable();
        setBackendStatus(isAvailable ? 'connected' : 'disconnected');
        
        if (isAvailable) {
          // Load AGI info
          const agiData = await apiService.getAGIInfo();
          setAgiInfo(agiData);
          
          // Load Deeja info
          const deejaData = await apiService.meetDeeja();
          setDeejaInfo(deejaData);
        }
      } catch (error) {
        console.error('Failed to connect to backend:', error);
        setBackendStatus('disconnected');
        toast({
          title: "Backend Connection",
          description: "Unable to connect to Zynx AGI backend. Running in offline mode.",
          variant: "destructive",
        });
      }
    };

    checkBackendStatus();
  }, [toast]);

  const handleMeetDeeja = async () => {
    try {
      if (!deejaInfo) {
        const deejaData = await apiService.meetDeeja();
        setDeejaInfo(deejaData);
      }
      
      toast({
        title: "Meet Deeja",
        description: deejaInfo?.greeting.english || "Hello! Nice to meet you",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect with Deeja. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleExploreAGI = async () => {
    try {
      if (!agiInfo) {
        const agiData = await apiService.getAGIInfo();
        setAgiInfo(agiData);
      }
      
      toast({
        title: "AGI Exploration",
        description: agiInfo?.message || "Welcome to Zynx AGI - Culturally Aware Intelligence",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load AGI information. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <section className="min-h-screen bg-hero-gradient flex items-center justify-center relative overflow-hidden">
      {/* Backend Status Indicator */}
      <div className="absolute top-4 right-4 z-20">
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
          backendStatus === 'connected' 
            ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
            : backendStatus === 'disconnected'
            ? 'bg-red-500/20 text-red-300 border border-red-500/30'
            : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
        }`}>
          {backendStatus === 'connected' ? (
            <Server className="h-4 w-4" />
          ) : backendStatus === 'disconnected' ? (
            <AlertCircle className="h-4 w-4" />
          ) : (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          )}
          <span className="hidden sm:inline">
            {backendStatus === 'connected' ? 'Backend Connected' : 
             backendStatus === 'disconnected' ? 'Backend Offline' : 'Connecting...'}
          </span>
        </div>
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-agi-yellow/20 rounded-full animate-float"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-agi-orange/20 rounded-full animate-pulse-soft"></div>
        <div className="absolute bottom-32 left-32 w-20 h-20 bg-primary/20 rounded-full animate-float"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-agi-yellow/20 rounded-full animate-pulse-soft"></div>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
              CULTURALLY
              <br />
              AWARE
              <br />
              <span className="text-agi-yellow">AGI</span>
            </h1>
            
            <p className="text-xl text-white/90 mb-8 max-w-lg">
              {agiInfo?.message || "Discover the future of artificial general intelligence with cultural awareness and ethical considerations at its core."}
            </p>

            {/* Interactive Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <Button 
                variant="hero" 
                size="lg" 
                className="group"
                onClick={handleMeetDeeja}
                disabled={backendStatus === 'loading'}
              >
                <Sparkles className="mr-2 h-5 w-5 group-hover:animate-spin" />
                Meet Deeja
              </Button>
              <Button 
                variant="explore" 
                size="lg" 
                className="group"
                onClick={handleExploreAGI}
                disabled={backendStatus === 'loading'}
              >
                <Brain className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                Explore AGI
              </Button>
            </div>

            {/* Interactive Cards */}
            <div className="grid sm:grid-cols-3 gap-4 mt-8">
              <Card className="p-4 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 group cursor-pointer">
                <Brain className="h-8 w-8 text-agi-yellow mb-2 group-hover:animate-pulse" />
                <h3 className="text-white font-semibold mb-1">AI Research</h3>
                <p className="text-white/70 text-sm">
                  {agiInfo?.cultural_context.global_perspectives[0] || "Advanced research in AGI development"}
                </p>
              </Card>
              
              <Card className="p-4 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 group cursor-pointer">
                <Sparkles className="h-8 w-8 text-agi-orange mb-2 group-hover:animate-spin" />
                <h3 className="text-white font-semibold mb-1">Cultural AI</h3>
                <p className="text-white/70 text-sm">
                  {agiInfo?.cultural_context.thai_culture.harmony || "Culturally aware intelligence systems"}
                </p>
              </Card>
              
              <Card className="p-4 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 group cursor-pointer">
                <Zap className="h-8 w-8 text-primary mb-2 group-hover:animate-bounce" />
                <h3 className="text-white font-semibold mb-1">Innovation</h3>
                <p className="text-white/70 text-sm">
                  {agiInfo?.ethical_considerations.fairness || "Cutting-edge AI solutions"}
                </p>
              </Card>
            </div>
          </div>

          {/* Right side - Character illustration area */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              {/* Deeja Character */}
              <div className="w-80 h-80 bg-gradient-to-br from-agi-yellow/20 to-agi-orange/20 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-white/30 animate-float">
                <img 
                  src="/lovable-uploads/5eec2c28-0329-4a1d-a76d-a0aa9ccec7ed.png" 
                  alt="Deeja - Cultural AGI Assistant" 
                  className="w-64 h-64 object-contain animate-pulse"
                />
              </div>
              
              {/* Floating elements around character */}
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-agi-yellow rounded-full flex items-center justify-center animate-bounce">
                <Sparkles className="h-6 w-6 text-foreground" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-10 h-10 bg-agi-orange rounded-full flex items-center justify-center animate-pulse">
                <Zap className="h-5 w-5 text-white" />
              </div>
              
              {/* Deeja Status */}
              {deejaInfo && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-white">
                  {deejaInfo.greeting.thai}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;