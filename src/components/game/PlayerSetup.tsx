import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { User, Bot, Sparkles } from 'lucide-react';

interface PlayerSetupProps {
  onPlayerCreated: (displayName: string, isAi: boolean, aiDescription?: string) => void;
  loading: boolean;
}

export const PlayerSetup = ({ onPlayerCreated, loading }: PlayerSetupProps) => {
  const [displayName, setDisplayName] = useState('');
  const [isAi, setIsAi] = useState(false);
  const [aiDescription, setAiDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (displayName.trim()) {
      onPlayerCreated(displayName.trim(), isAi, aiDescription.trim() || undefined);
    }
  };

  const aiSuggestions = [
    'GPT-4 + Claude 3.5 Sonnet + Gemini Pro',
    'Custom fine-tuned model สำหรับ Zynx',
    'Ensemble ของ OpenAI + Anthropic + Google',
    'Local LLaMA2 + RAG system',
    'Multi-agent system with specialized models'
  ];

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Sparkles className="h-5 w-5" />
          เข้าร่วมเกม Algorithm
        </CardTitle>
        <CardDescription>
          สร้างโปรไฟล์ของคุณเพื่อเริ่มต้นการแข่งขัน
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="displayName">ชื่อที่แสดง</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="กรอกชื่อของคุณ"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isAi"
                checked={isAi}
                onCheckedChange={(checked) => setIsAi(checked as boolean)}
                disabled={loading}
              />
              <Label htmlFor="isAi" className="flex items-center gap-2">
                <Bot className="h-4 w-4" />
                ใช้ AI ช่วยตอบคำถาม
              </Label>
            </div>

            {isAi && (
              <div className="space-y-3 pl-6 border-l-2 border-primary/20">
                <Label htmlFor="aiDescription">อธิบายระบบ AI ที่ใช้</Label>
                <Textarea
                  id="aiDescription"
                  value={aiDescription}
                  onChange={(e) => setAiDescription(e.target.value)}
                  placeholder="เช่น GPT-4 + Claude 3.5 Sonnet สำหรับวิเคราะห์อัลกอริทึม"
                  rows={3}
                  disabled={loading}
                />
                
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">ตัวอย่างการใช้ AI:</Label>
                  <div className="space-y-1">
                    {aiSuggestions.map((suggestion, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="cursor-pointer text-xs"
                        onClick={() => setAiDescription(suggestion)}
                      >
                        {suggestion}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
                  <strong>หมายเหตุ:</strong> การใช้ AI ไม่ได้ถูกห้าม แต่จะมีการแยกประเภทในการแข่งขัน 
                  และคะแนน AGI Similarity จะถูกคำนวณแยกต่างหาก
                </div>
              </div>
            )}
          </div>

          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={!displayName.trim() || loading}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  กำลังสร้างโปรไฟล์...
                </>
              ) : (
                <>
                  {isAi ? <Bot className="h-4 w-4 mr-2" /> : <User className="h-4 w-4 mr-2" />}
                  เริ่มเล่นเกม
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};