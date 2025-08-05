import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Send, Brain, Globe, Shield } from "lucide-react";
import { apiService, AGIRequest, AGIResponse } from "@/lib/api";
import { toast } from "sonner";

const AGIInteraction = () => {
  const [prompt, setPrompt] = useState("");
  const [culturalContext, setCulturalContext] = useState("global");
  const [ethicalFramework, setEthicalFramework] = useState("utilitarian");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<AGIResponse | null>(null);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  // Test API connection on component mount
  useState(() => {
    const testConnection = async () => {
      try {
        const connected = await apiService.testConnection();
        setIsConnected(connected);
        if (!connected) {
          toast.error("ไม่สามารถเชื่อมต่อกับ API ได้", {
            description: "ตรวจสอบว่า backend กำลังทำงานอยู่"
          });
        }
      } catch (error) {
        setIsConnected(false);
        toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อ API");
      }
    };
    
    testConnection();
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error("กรุณาใส่ข้อความที่ต้องการถาม");
      return;
    }

    setIsLoading(true);
    
    try {
      const request: AGIRequest = {
        prompt: prompt.trim(),
        cultural_context: culturalContext,
        ethical_framework: ethicalFramework,
      };

      const result = await apiService.processAGIRequest(request);
      setResponse(result);
      
      toast.success("ประมวลผลสำเร็จ!", {
        description: "AGI ได้ตอบกลับแล้ว"
      });
    } catch (error) {
      console.error("AGI request failed:", error);
      toast.error("เกิดข้อผิดพลาดในการประมวลผล", {
        description: "ลองใหม่อีกครั้ง"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const culturalContexts = [
    { value: "global", label: "Global", icon: "🌍" },
    { value: "Thai", label: "Thai", icon: "🇹🇭" },
    { value: "Chinese", label: "Chinese", icon: "🇨🇳" },
    { value: "Japanese", label: "Japanese", icon: "🇯🇵" },
    { value: "Korean", label: "Korean", icon: "🇰🇷" },
    { value: "Arabic", label: "Arabic", icon: "🇸🇦" },
    { value: "Spanish", label: "Spanish", icon: "🇪🇸" },
    { value: "French", label: "French", icon: "🇫🇷" },
  ];

  const ethicalFrameworks = [
    { value: "utilitarian", label: "Utilitarian", description: "Greatest good for greatest number" },
    { value: "deontological", label: "Deontological", description: "Duty-based ethics" },
    { value: "virtue_ethics", label: "Virtue Ethics", description: "Character-based ethics" },
    { value: "care_ethics", label: "Care Ethics", description: "Relationship-focused ethics" },
    { value: "justice_ethics", label: "Justice Ethics", description: "Fairness and equality" },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Connection Status */}
      <div className="flex items-center gap-2">
        <Badge variant={isConnected ? "default" : "destructive"}>
          {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
        </Badge>
        <span className="text-sm text-muted-foreground">
          {isConnected ? "API เชื่อมต่อสำเร็จ" : "ไม่สามารถเชื่อมต่อ API ได้"}
        </span>
      </div>

      {/* AGI Interaction Form */}
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prompt">คำถามหรือข้อความที่ต้องการถาม AGI</Label>
            <Textarea
              id="prompt"
              placeholder="บอก AGI ว่าคุณต้องการอะไร..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[100px]"
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cultural-context">
                <Globe className="inline w-4 h-4 mr-2" />
                Cultural Context
              </Label>
              <Select
                value={culturalContext}
                onValueChange={setCulturalContext}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="เลือก cultural context" />
                </SelectTrigger>
                <SelectContent>
                  {culturalContexts.map((context) => (
                    <SelectItem key={context.value} value={context.value}>
                      <span className="mr-2">{context.icon}</span>
                      {context.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ethical-framework">
                <Shield className="inline w-4 h-4 mr-2" />
                Ethical Framework
              </Label>
              <Select
                value={ethicalFramework}
                onValueChange={setEthicalFramework}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="เลือก ethical framework" />
                </SelectTrigger>
                <SelectContent>
                  {ethicalFrameworks.map((framework) => (
                    <SelectItem key={framework.value} value={framework.value}>
                      <div>
                        <div className="font-medium">{framework.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {framework.description}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading || !isConnected}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                กำลังประมวลผล...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                ส่งคำถามไปยัง AGI
              </>
            )}
          </Button>
        </form>
      </Card>

      {/* AGI Response */}
      {response && (
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">AGI Response</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Response:</Label>
              <p className="mt-1 p-3 bg-muted rounded-md">
                {response.response}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Cultural Notes:</Label>
                <p className="mt-1 p-3 bg-muted rounded-md text-sm">
                  {response.cultural_notes}
                </p>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Ethical Considerations:</Label>
                <p className="mt-1 p-3 bg-muted rounded-md text-sm">
                  {response.ethical_considerations}
                </p>
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-medium">Confidence Score:</Label>
              <div className="mt-1 flex items-center gap-2">
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${response.confidence_score * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium">
                  {(response.confidence_score * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AGIInteraction;