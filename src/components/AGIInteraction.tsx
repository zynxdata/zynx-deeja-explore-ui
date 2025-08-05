import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Brain, MessageSquare, Globe, Shield } from "lucide-react";
import { apiService, type AGIResponse, type CulturalContext } from "@/lib/api";
import { toast } from "sonner";

interface AGIInteractionProps {
  className?: string;
}

export default function AGIInteraction({ className }: AGIInteractionProps) {
  const [message, setMessage] = useState("");
  const [culturalContext, setCulturalContext] = useState("global");
  const [language, setLanguage] = useState("en");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<AGIResponse | null>(null);
  const [culturalData, setCulturalData] = useState<CulturalContext | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await apiService.interactWithAGI({
        message: message.trim(),
        cultural_context: culturalContext,
        language,
      });
      
      setResponse(result);
      toast.success("AGI interaction successful!");
    } catch (error) {
      console.error("AGI interaction failed:", error);
      toast.error("Failed to interact with AGI. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadCulturalContext = async () => {
    try {
      const context = await apiService.getCulturalContext();
      setCulturalData(context);
      toast.success("Cultural context loaded!");
    } catch (error) {
      console.error("Failed to load cultural context:", error);
      toast.error("Failed to load cultural context");
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Cultural Context Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Globe className="h-5 w-5 text-agi-orange" />
            Cultural Context
          </h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={loadCulturalContext}
            disabled={isLoading}
          >
            Load Context
          </Button>
        </div>
        
        {culturalData && (
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Thai Culture</h4>
              <div className="space-y-1">
                <Badge variant="secondary">{culturalData.thai_culture.greeting}</Badge>
                <div className="flex flex-wrap gap-1">
                  {culturalData.thai_culture.respect_levels.map((level, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {level}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Global Culture</h4>
              <div className="space-y-1">
                {Object.entries(culturalData.global_culture).map(([key, value]) => (
                  <Badge key={key} variant={value ? "default" : "secondary"}>
                    {key}: {value ? "✓" : "✗"}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm">AGI Considerations</h4>
              <div className="space-y-1">
                {Object.entries(culturalData.agi_considerations).map(([key, value]) => (
                  <Badge key={key} variant={value ? "default" : "secondary"}>
                    {key}: {value ? "✓" : "✗"}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* AGI Interaction Form */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Brain className="h-5 w-5 text-agi-yellow" />
          AGI Interaction
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Enter your message for the AGI..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              required
            />
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cultural-context">Cultural Context</Label>
              <Select value={culturalContext} onValueChange={setCulturalContext}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="global">Global</SelectItem>
                  <SelectItem value="thai">Thai</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="th">Thai</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button 
            type="submit" 
            disabled={isLoading || !message.trim()}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Brain className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <MessageSquare className="mr-2 h-4 w-4" />
                Send to AGI
              </>
            )}
          </Button>
        </form>
      </Card>

      {/* Response Section */}
      {response && (
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            AGI Response
          </h3>
          
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Message</Label>
              <p className="mt-1 p-3 bg-muted rounded-md">{response.message}</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Cultural Context</Label>
                <div className="mt-1 p-3 bg-muted rounded-md">
                  <pre className="text-xs overflow-auto">
                    {JSON.stringify(response.cultural_context, null, 2)}
                  </pre>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Ethical Considerations</Label>
                <div className="mt-1 p-3 bg-muted rounded-md">
                  <pre className="text-xs overflow-auto">
                    {JSON.stringify(response.ethical_considerations, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}