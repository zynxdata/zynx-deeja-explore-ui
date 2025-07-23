import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, Sparkles, Zap } from "lucide-react";
const HeroSection = () => {
  return <section className="min-h-screen bg-hero-gradient flex items-center justify-center relative overflow-hidden">
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
              Discover the future of artificial general intelligence with cultural awareness and ethical considerations at its core.
            </p>

            {/* Interactive Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <Button variant="hero" size="lg" className="group" asChild>
                <a href="/chat">
                  <Sparkles className="mr-2 h-5 w-5 group-hover:animate-spin" />
                  เริ่มต้น AI Chat
                </a>
              </Button>
              <Button variant="explore" size="lg" className="group" asChild>
                <a href="/image-generator">
                  <Brain className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                  สร้างรูปภาพ AI
                </a>
              </Button>
            </div>

            {/* Interactive Cards */}
            <div className="grid sm:grid-cols-3 gap-4 mt-8">
              <Card className="p-4 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 group cursor-pointer">
                <Brain className="h-8 w-8 text-agi-yellow mb-2 group-hover:animate-pulse" />
                <h3 className="text-white font-semibold mb-1">AI Research</h3>
                <p className="text-white/70 text-sm">Advanced research in AGI development</p>
              </Card>
              
              <Card className="p-4 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 group cursor-pointer">
                <Sparkles className="h-8 w-8 text-agi-orange mb-2 group-hover:animate-spin" />
                <h3 className="text-white font-semibold mb-1">Cultural AI</h3>
                <p className="text-white/70 text-sm">Culturally aware intelligence systems</p>
              </Card>
              
              <Card className="p-4 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 group cursor-pointer">
                <Zap className="h-8 w-8 text-primary mb-2 group-hover:animate-bounce" />
                <h3 className="text-white font-semibold mb-1">Innovation</h3>
                <p className="text-white/70 text-sm">Cutting-edge AI solutions</p>
              </Card>
            </div>
          </div>

          {/* Right side - Character illustration area */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              {/* Placeholder for character - could be replaced with actual Deeja character */}
              <div className="w-80 h-80 bg-gradient-to-br from-agi-yellow/20 to-agi-orange/20 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-white/30 animate-float">
                <div className="text-center">
                  <Brain className="h-20 w-20 text-white mb-4 animate-pulse mx-[256px] px-0 my-[198px]" />
                  <p className="text-white font-semibold text-lg">Deeja Character</p>
                  <p className="text-white/70">Cultural AGI Assistant</p>
                </div>
              </div>
              
              {/* Floating elements around character */}
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-agi-yellow rounded-full flex items-center justify-center animate-bounce">
                <Sparkles className="h-6 w-6 text-foreground" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-10 h-10 bg-agi-orange rounded-full flex items-center justify-center animate-pulse">
                <Zap className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default HeroSection;