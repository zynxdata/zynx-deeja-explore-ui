
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, Sparkles, Zap, BookOpen, Network, Heart } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="min-h-screen bg-hero-gradient flex items-center justify-center relative overflow-hidden">
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
              ZYNX
              <br />
              <span className="text-agi-yellow">CONTEXT</span>
              <br />
              <span className="text-agi-orange">AGI</span>
            </h1>
            
            <p className="text-xl text-white/90 mb-8 max-w-lg">
              ระบบ AGI ที่เข้าใจบริบทลึกซึ้ง พร้อมความชาญฉลาดทางอารมณ์และความตระหนักทางวัฒนธรรม
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
                <a href="/research">
                  <BookOpen className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                  ศึกษา AGI Research
                </a>
              </Button>
            </div>

            {/* Interactive Cards */}
            <div className="grid sm:grid-cols-3 gap-4 mt-8">
              <Card className="p-4 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 group cursor-pointer">
                <Network className="h-8 w-8 text-agi-yellow mb-2 group-hover:animate-pulse" />
                <h3 className="text-white font-semibold mb-1">Modular AGI</h3>
                <p className="text-white/70 text-sm">เครือข่าย AI Agent แบบกระจาย</p>
              </Card>
              
              <Card className="p-4 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 group cursor-pointer">
                <Heart className="h-8 w-8 text-agi-orange mb-2 group-hover:animate-spin" />
                <h3 className="text-white font-semibold mb-1">Deeja AI</h3>
                <p className="text-white/70 text-sm">ผู้ช่วย AI ที่เข้าใจอารมณ์และวัฒนธรรม</p>
              </Card>
              
              <Card className="p-4 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 group cursor-pointer">
                <Brain className="h-8 w-8 text-primary mb-2 group-hover:animate-bounce" />
                <h3 className="text-white font-semibold mb-1">Context-as-a-Service</h3>
                <p className="text-white/70 text-sm">เข้าใจบริบทในทุกมิติการสื่อสาร</p>
              </Card>
            </div>
          </div>

          {/* Right side - Deeja Character visualization */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              {/* Deeja character representation */}
              <div className="w-80 h-80 bg-gradient-to-br from-agi-yellow/20 to-agi-orange/20 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-white/30 animate-float">
                <div className="text-center">
                  <Brain className="h-20 w-20 text-white mb-4 animate-pulse mx-auto" />
                  <p className="text-white font-semibold text-lg">Deeja AI</p>
                  <p className="text-white/70">Cultural AGI Assistant</p>
                  <div className="flex justify-center gap-2 mt-4">
                    <div className="w-2 h-2 bg-agi-yellow rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-agi-orange rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements around character */}
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-agi-yellow rounded-full flex items-center justify-center animate-bounce">
                <Sparkles className="h-6 w-6 text-foreground" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-10 h-10 bg-agi-orange rounded-full flex items-center justify-center animate-pulse">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <div className="absolute top-1/2 -left-6 w-8 h-8 bg-primary rounded-full flex items-center justify-center animate-bounce" style={{ animationDelay: '0.8s' }}>
                <Network className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
