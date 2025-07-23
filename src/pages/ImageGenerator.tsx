import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Image, Download, Settings, Sparkles } from "lucide-react";
import { toast } from "sonner";

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [apiKey, setApiKey] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast.error("กรุณาใส่คำอธิบายรูปภาพ");
      return;
    }

    if (!apiKey) {
      toast.error("กรุณาใส่ OpenAI API Key ในการตั้งค่า");
      setShowSettings(true);
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt: prompt,
          n: 1,
          size: "1024x1024",
          quality: "standard",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate image");
      }

      const data = await response.json();
      const imageUrl = data.data[0].url;
      
      setGeneratedImages(prev => [imageUrl, ...prev]);
      toast.success("สร้างรูปภาพสำเร็จ!");
    } catch (error) {
      console.error("Error:", error);
      toast.error("เกิดข้อผิดพลาดในการสร้างรูปภาพ");
    } finally {
      setIsGenerating(false);
    }
  };

  const saveApiKey = () => {
    if (!apiKey.trim()) {
      toast.error("กรุณาใส่ API Key");
      return;
    }
    localStorage.setItem("openai-api-key", apiKey);
    setShowSettings(false);
    toast.success("บันทึก API Key แล้ว");
  };

  const downloadImage = async (imageUrl: string, index: number) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ai-generated-image-${index + 1}.png`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("ดาวน์โหลดรูปภาพแล้ว");
    } catch (error) {
      toast.error("เกิดข้อผิดพลาดในการดาวน์โหลด");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Image className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-foreground">AI Image Generator</h1>
                <p className="text-muted-foreground">สร้างรูปภาพด้วย AI จากคำอธิบาย</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowSettings(!showSettings)}>
              <Settings className="h-4 w-4" />
            </Button>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <Card className="p-4 mb-6 border-primary/20">
              <h3 className="font-semibold mb-3">การตั้งค่า OpenAI API</h3>
              <div className="flex gap-2">
                <Input
                  type="password"
                  placeholder="ใส่ OpenAI API Key ของคุณ"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={saveApiKey}>บันทึก</Button>
              </div>
            </Card>
          )}

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div>
              <Card className="p-6 border-primary/20">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  อธิบายรูปภาพที่ต้องการ
                </h2>
                
                <div className="space-y-4">
                  <Textarea
                    placeholder="อธิบายรูปภาพที่คุณต้องการให้ AI สร้าง เช่น 'วาดภาพการ์ตูนของแมวน้อยสีขาวนั่งอยู่บนหญ้าเขียว ใต้แสงแดดยามบ่าย'"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={6}
                    className="resize-none"
                  />
                  
                  <div className="flex items-center gap-2">
                    <Badge variant={apiKey ? "default" : "destructive"} className="text-xs">
                      {apiKey ? "API Key ตั้งค่าแล้ว" : "ยังไม่ได้ตั้งค่า API Key"}
                    </Badge>
                  </div>

                  <Button 
                    onClick={generateImage} 
                    disabled={isGenerating || !prompt.trim()}
                    className="w-full"
                    size="lg"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                        กำลังสร้างรูปภาพ...
                      </>
                    ) : (
                      <>
                        <Image className="h-4 w-4 mr-2" />
                        สร้างรูปภาพ
                      </>
                    )}
                  </Button>
                </div>

                {/* Sample Prompts */}
                <div className="mt-6 pt-6 border-t border-border">
                  <h3 className="font-medium text-sm text-muted-foreground mb-3">ตัวอย่างคำสั่ง:</h3>
                  <div className="space-y-2">
                    {[
                      "วาดภาพการ์ตูนของเด็กไทยใส่ชุดนักเรียน ยิ้มแย้มแจ่มใส",
                      "ภาพวิวทิวทัศน์ภูเขาไทย เช้าตรู่ มีเมฆหมอก",
                      "อาหารไทยจานโปรด ต้มยำกุ้ง ถ่ายภาพสวยๆ",
                      "แมวเหมียวน้อยใส่ชุดไทย นั่งในสวนดอกไม้"
                    ].map((example, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        className="text-left justify-start h-auto p-2 text-xs text-muted-foreground hover:text-foreground"
                        onClick={() => setPrompt(example)}
                      >
                        "{example}"
                      </Button>
                    ))}
                  </div>
                </div>
              </Card>
            </div>

            {/* Generated Images */}
            <div>
              <Card className="p-6 border-primary/20">
                <h2 className="text-xl font-semibold mb-4">รูปภาพที่สร้างแล้ว</h2>
                
                {generatedImages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-12">
                    <Image className="h-12 w-12 mx-auto mb-4 text-primary/50" />
                    <p>รูปภาพที่สร้างจะแสดงที่นี่</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {generatedImages.map((imageUrl, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={imageUrl}
                          alt={`Generated image ${index + 1}`}
                          className="w-full rounded-lg border border-border"
                        />
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => downloadImage(imageUrl, index)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;