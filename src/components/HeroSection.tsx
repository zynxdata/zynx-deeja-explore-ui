
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, Sparkles, Zap, BookOpen, Network, Heart, ArrowRight, Code, Users, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { ValueBanner } from "./enhanced/ValueBanner";
import { MVPWorkspaces } from "./enhanced/MVPWorkspaces";
import { TestimonialsSection } from "./enhanced/TestimonialsSection";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";

const HeroSection = () => {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen bg-hero-gradient">
      {/* Language Switcher - Fixed Position */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
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
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
                <Heart className="h-4 w-4 text-agi-orange animate-pulse" />
                <span className="text-white/90 text-sm font-medium">{t('hero.partnership')}</span>
                <Heart className="h-4 w-4 text-agi-orange animate-pulse" />
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-fade-in leading-tight">
                ZYNX
                <br />
                <span className="text-agi-yellow">CONTEXT</span>
                <br />
                <span className="text-agi-orange">AGI</span>
              </h1>
              
              <div className="inline-block bg-gradient-to-r from-agi-yellow/20 to-agi-orange/20 backdrop-blur-sm rounded-full px-6 py-3 mb-4">
                <span className="text-white font-semibold text-lg">{t('hero.tagline')}</span>
              </div>
            </div>
            
            <p className="text-xl text-white/90 mb-6 max-w-lg font-medium">
              {t('hero.subtitle')}
            </p>

            <p className="text-lg text-white/70 mb-8 max-w-lg leading-relaxed">
              {t('hero.description')}
            </p>

            {/* Main CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <Button variant="hero" size="lg" className="group shadow-2xl" asChild>
                <Link to="/admin-setup">
                  <Sparkles className="mr-2 h-5 w-5 group-hover:animate-spin" />
                  {t('hero.cta.try')}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button variant="explore" size="lg" className="group" asChild>
                <Link to="/chat">
                  <Brain className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                  {t('hero.cta.meet')}
                </Link>
              </Button>
            </div>
            
            <div className="text-sm text-white/60 mb-8">
              {t('hero.disclaimer')}
            </div>

            {/* Value Props */}
            <div className="grid sm:grid-cols-3 gap-4 mt-8">
              <Card className="p-4 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 group cursor-pointer">
                <Network className="h-8 w-8 text-agi-yellow mb-2 group-hover:animate-pulse" />
                <h3 className="text-white font-semibold mb-1">{t('value.context.title')}</h3>
                <p className="text-white/60 text-xs">{t('value.context.desc')}</p>
              </Card>
              
              <Card className="p-4 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 group cursor-pointer">
                <Heart className="h-8 w-8 text-agi-orange mb-2 group-hover:animate-pulse" />
                <h3 className="text-white font-semibold mb-1">{t('value.emotion.title')}</h3>
                <p className="text-white/60 text-xs">{t('value.emotion.desc')}</p>
              </Card>
              
              <Card className="p-4 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 group cursor-pointer">
                <Brain className="h-8 w-8 text-primary mb-2 group-hover:animate-bounce" />
                <h3 className="text-white font-semibold mb-1">{t('value.learning.title')}</h3>
                <p className="text-white/60 text-xs">{t('value.learning.desc')}</p>
              </Card>
            </div>
          </div>

          {/* Right side - Deeja Character visualization */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              {/* Deeja character representation */}
              <div className="w-80 h-80 bg-gradient-to-br from-agi-yellow/20 to-agi-orange/20 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-white/30 animate-float">
                <div className="text-center">
                  <Heart className="h-16 w-16 text-agi-orange mb-2 animate-pulse mx-auto" />
                  <Brain className="h-16 w-16 text-white mb-4 animate-pulse mx-auto" />
                  <p className="text-white font-bold text-xl">Deeja AI</p>
                  <p className="text-agi-yellow font-semibold">ดีจา เอไอ</p>
                  <p className="text-white/80 text-sm mt-2">Your Empathetic AI Partner</p>
                  <p className="text-white/70 text-xs">พาร์ทเนอร์ AI ที่เข้าอกเข้าใจ</p>
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

        {/* Features Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            {t('features.title')}
          </h2>
          <p className="text-white/70 mb-12 max-w-2xl mx-auto">
            {t('features.subtitle')}
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/20 hover:bg-white/10 transition-all duration-300">
              <Code className="h-12 w-12 text-agi-yellow mb-4 mx-auto" />
              <h3 className="text-white font-semibold mb-2">Developer APIs</h3>
              <p className="text-white/70 text-sm mb-4">
                RESTful APIs, WebSocket streams, GraphQL queries. One SDK, infinite possibilities.
              </p>
              <div className="text-xs text-agi-yellow">
                &lt; 200ms response time
              </div>
            </Card>

            <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/20 hover:bg-white/10 transition-all duration-300">
              <Users className="h-12 w-12 text-agi-orange mb-4 mx-auto" />
              <h3 className="text-white font-semibold mb-2">Enterprise Ready</h3>
              <p className="text-white/70 text-sm mb-4">
                SOC 2 Type II compliant, end-to-end encryption, on-premise deployment options.
              </p>
              <div className="text-xs text-agi-orange">
                99.9% uptime SLA
              </div>
            </Card>

            <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/20 hover:bg-white/10 transition-all duration-300">
              <Globe className="h-12 w-12 text-primary mb-4 mx-auto" />
              <h3 className="text-white font-semibold mb-2">Global Scale</h3>
              <p className="text-white/70 text-sm mb-4">
                Native Thai-English hybrid processing with cultural context awareness.
              </p>
              <div className="text-xs text-primary">
                15+ markets globally
              </div>
            </Card>
          </div>
        </div>

        {/* Social Proof */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-white/70">
            <div>
              <div className="text-2xl font-bold text-agi-yellow">500+</div>
              <div className="text-sm">Development Teams</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-agi-orange">10M+</div>
              <div className="text-sm">API Calls Monthly</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">85%</div>
              <div className="text-sm">Accuracy Rate</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">99.9%</div>
              <div className="text-sm">Uptime SLA</div>
            </div>
          </div>
        </div>
      </div>
      </section>

      {/* Value Banner */}
      <ValueBanner />

      {/* MVP Workspaces */}
      <MVPWorkspaces />

      {/* Testimonials */}
      <TestimonialsSection />
    </div>
  );
};

export default HeroSection;
