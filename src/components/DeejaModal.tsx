import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Brain, Heart, Globe, MessageCircle } from "lucide-react";
import { DeejaResponse } from "@/lib/api";

interface DeejaModalProps {
  isOpen: boolean;
  onClose: () => void;
  deejaData?: DeejaResponse;
  isLoading: boolean;
}

const DeejaModal = ({ isOpen, onClose, deejaData, isLoading }: DeejaModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gradient-to-br from-agi-yellow/10 to-agi-orange/10 backdrop-blur-sm border-white/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-agi-yellow" />
            Meet Deeja
            <span className="text-agi-orange">Cultural AGI Assistant</span>
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-agi-yellow"></div>
            <span className="ml-2 text-white">Loading Deeja...</span>
          </div>
        ) : deejaData ? (
          <div className="space-y-6">
            {/* Character Image */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-br from-agi-yellow/20 to-agi-orange/20 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-white/30 animate-float">
                  <img 
                    src="/lovable-uploads/5eec2c28-0329-4a1d-a76d-a0aa9ccec7ed.png" 
                    alt="Deeja - Cultural AGI Assistant" 
                    className="w-24 h-24 object-contain animate-pulse"
                  />
                </div>
              </div>
            </div>

            {/* Greeting */}
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold text-white">
                {deejaData.greeting.english}
              </h3>
              <p className="text-agi-yellow font-medium">
                {deejaData.greeting.thai}
              </p>
              <p className="text-white/70 text-sm">
                {deejaData.greeting.meaning}
              </p>
            </div>

            {/* Personality Traits */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 bg-white/10 backdrop-blur-sm border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="h-5 w-5 text-agi-yellow" />
                  <h4 className="font-semibold text-white">Personality</h4>
                </div>
                <div className="space-y-2">
                  {Object.entries(deejaData.personality).map(([trait, value]) => (
                    <div key={trait} className="flex items-center justify-between">
                      <span className="text-white/80 text-sm capitalize">
                        {trait.replace('_', ' ')}
                      </span>
                      <Badge variant={value ? "default" : "secondary"} className="text-xs">
                        {value ? "✓" : "✗"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-4 bg-white/10 backdrop-blur-sm border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="h-5 w-5 text-agi-orange" />
                  <h4 className="font-semibold text-white">Capabilities</h4>
                </div>
                <div className="space-y-1">
                  {deejaData.capabilities.map((capability, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Sparkles className="h-3 w-3 text-agi-yellow" />
                      <span className="text-white/80 text-xs">{capability}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Cultural Context */}
            <Card className="p-4 bg-white/10 backdrop-blur-sm border-white/20">
              <div className="flex items-center gap-2 mb-3">
                <Heart className="h-5 w-5 text-primary" />
                <h4 className="font-semibold text-white">Cultural Awareness</h4>
              </div>
              <p className="text-white/80 text-sm">
                Deeja is designed with deep understanding of cultural contexts, 
                ensuring respectful and appropriate interactions across different 
                cultural backgrounds and languages.
              </p>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={onClose}
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Start Conversation
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={onClose}
              >
                Learn More
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-white/70">Failed to load Deeja information</p>
            <Button 
              variant="outline" 
              className="mt-4 bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DeejaModal;