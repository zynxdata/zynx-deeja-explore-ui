
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, Heart, Globe, Clock, User, Zap } from "lucide-react";

interface ContextData {
  emotional: {
    mood: string;
    energy: number;
    confidence: number;
  };
  cultural: {
    language: string;
    formality: string;
    style: string;
  };
  temporal: {
    timeOfDay: string;
    urgency: string;
  };
  personal: {
    expertise: string[];
    preferences: string[];
  };
}

const ContextEngine = () => {
  const [contextData, setContextData] = useState<ContextData>({
    emotional: {
      mood: "curious",
      energy: 85,
      confidence: 92
    },
    cultural: {
      language: "Thai-English Mix",
      formality: "Polite",
      style: "Technical-Friendly"
    },
    temporal: {
      timeOfDay: "Evening",
      urgency: "Normal"
    },
    personal: {
      expertise: ["AI/ML", "Software Development", "Research"],
      preferences: ["Direct Communication", "Visual Learning", "Step-by-step"]
    }
  });

  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Simulate real-time context updates
    const interval = setInterval(() => {
      setIsProcessing(true);
      setTimeout(() => {
        setContextData(prev => ({
          ...prev,
          emotional: {
            ...prev.emotional,
            energy: Math.max(60, Math.min(100, prev.emotional.energy + (Math.random() - 0.5) * 10)),
            confidence: Math.max(70, Math.min(100, prev.emotional.confidence + (Math.random() - 0.5) * 5))
          }
        }));
        setIsProcessing(false);
      }, 1000);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Emotional Context */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Heart className="w-4 h-4 text-agi-orange" />
            Emotional Context
            {isProcessing && <Zap className="w-3 h-3 text-agi-yellow animate-pulse" />}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">Mood</span>
            <Badge variant="secondary" className="bg-agi-orange/20 text-agi-orange">
              {contextData.emotional.mood}
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Energy Level</span>
              <span>{contextData.emotional.energy}%</span>
            </div>
            <Progress value={contextData.emotional.energy} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Confidence</span>
              <span>{contextData.emotional.confidence}%</span>
            </div>
            <Progress value={contextData.emotional.confidence} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Cultural Context */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Globe className="w-4 h-4 text-agi-yellow" />
            Cultural Context
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">Language</span>
            <Badge variant="outline">{contextData.cultural.language}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Formality</span>
            <Badge variant="outline">{contextData.cultural.formality}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Style</span>
            <Badge variant="outline">{contextData.cultural.style}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Temporal Context */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-primary" />
            Temporal Context
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">Time of Day</span>
            <Badge variant="secondary">{contextData.temporal.timeOfDay}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Urgency</span>
            <Badge variant={contextData.temporal.urgency === "High" ? "destructive" : "secondary"}>
              {contextData.temporal.urgency}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Personal Context */}
      <Card className="hover:shadow-lg transition-shadow md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4 text-agi-yellow" />
            Personal Context & Preferences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2 text-sm">Expertise Areas</h4>
              <div className="flex flex-wrap gap-2">
                {contextData.personal.expertise.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="bg-primary/20 text-primary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2 text-sm">Communication Preferences</h4>
              <div className="flex flex-wrap gap-2">
                {contextData.personal.preferences.map((pref, index) => (
                  <Badge key={index} variant="outline">
                    {pref}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Context Synthesis */}
      <Card className="md:col-span-2 lg:col-span-3 bg-gradient-to-r from-primary/5 to-agi-yellow/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Brain className="w-4 h-4 text-primary" />
            Context Synthesis & AI Response Strategy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-secondary/20 rounded-lg p-4 text-sm">
            <p className="mb-2">
              <strong>Recommended Response Style:</strong> เนื่องจากผู้ใช้มีพื้นฐานด้านเทคนิคและชอบการสื่อสารแบบตรงไปตรงมา 
              ระบบจึงแนะนำให้ใช้ภาษาไทย-อังกฤษผสม โดยเน้นคำอธิบายที่ชัดเจนและมีขั้นตอน
            </p>
            <p className="mb-2">
              <strong>Energy Adaptation:</strong> ผู้ใช้มีระดับพลังงานสูง ({contextData.emotional.energy}%) 
              เหมาะสำหรับการแลกเปลี่ยนความคิดเห็นและการเรียนรู้สิ่งใหม่ๆ
            </p>
            <p>
              <strong>Cultural Consideration:</strong> ใช้ระดับความสุภาพแบบไทยผสมกับความเป็นกันเองแบบตะวันตก 
              เหมาะสำหรับการสื่อสารเชิงเทคนิค
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContextEngine;
