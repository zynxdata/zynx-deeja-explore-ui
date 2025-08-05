import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export const ValueBanner = () => {
  return (
    <div className="bg-gradient-to-r from-primary/10 via-agi-yellow/10 to-agi-orange/10 border-y border-primary/20">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/20 to-agi-yellow/20 backdrop-blur-sm rounded-full px-6 py-2 mb-4">
            <Sparkles className="h-4 w-4 text-agi-yellow animate-pulse" />
            <span className="text-sm font-semibold bg-gradient-to-r from-primary to-agi-yellow bg-clip-text text-transparent">
              AGI-First Context-as-a-Service
            </span>
            <Sparkles className="h-4 w-4 text-agi-yellow animate-pulse" />
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            The Future of Human-AI Collaboration
          </h2>
          <h3 className="text-lg md:text-xl text-muted-foreground mb-6">
            อนาคตของการทำงานร่วมกันระหว่างมนุษย์และ AI
          </h3>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button variant="hero" size="lg" className="group" asChild>
              <Link to="/admin-setup">
                <Sparkles className="mr-2 h-5 w-5 group-hover:animate-spin" />
                Try Now - Start Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            
            <div className="text-xs text-muted-foreground">
              ✨ No credit card required • 5-minute setup
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};