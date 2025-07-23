
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User, Settings, Trash2, Download } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/AuthProvider";
import { useInputValidation, textSchema, rateLimiter } from "@/components/security/InputValidator";
import { useSecureStorage } from "@/hooks/useSecureStorage";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const Chat = () => {
  const { user } = useAuth();
  const { validateInput, sanitizeInput } = useInputValidation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Use secure storage for API key
  const { 
    value: apiKey, 
    setValue: setApiKey, 
    loading: storageLoading 
  } = useSecureStorage("openai-api-key", "", { 
    encrypt: true, 
    expiry: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  // Load messages from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem(`ai-chat-messages-${user?.id}`);
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        setMessages(parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    }
  }, [user?.id]);

  // Save messages to localStorage
  useEffect(() => {
    if (user?.id && messages.length > 0) {
      localStorage.setItem(`ai-chat-messages-${user.id}`, JSON.stringify(messages));
    }
  }, [messages, user?.id]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Validate input
    const { isValid, error } = validateInput(textSchema, input);
    if (!isValid) {
      toast.error(error || 'ข้อมูลไม่ถูกต้อง');
      return;
    }

    // Check rate limiting (max 10 requests per minute)
    if (!rateLimiter.checkRate(user?.id || 'anonymous', 10, 60000)) {
      toast.error('คุณส่งข้อความเร็วเกินไป กรุณารอสักครู่');
      return;
    }
    
    if (!apiKey) {
      toast.error("กรุณาใส่ OpenAI API Key ในการตั้งค่า");
      setShowSettings(true);
      return;
    }

    const sanitizedInput = sanitizeInput(input);
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: sanitizedInput,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are Deeja, a helpful AI assistant that specializes in Thai culture and AGI technology. Always respond in Thai language. Be helpful and respectful."
            },
            ...messages.slice(-10).map(m => ({ role: m.role, content: m.content })), // Limit context
            { role: "user", content: sanitizedInput }
          ],
          max_tokens: 1000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("API Key ไม่ถูกต้อง");
        } else if (response.status === 429) {
          throw new Error("มีการใช้งานเกินขีดจำกัด กรุณาลองใหม่ภายหลัง");
        } else {
          throw new Error("เกิดข้อผิดพลาดในการติดต่อ AI");
        }
      }

      const data = await response.json();
      
      if (!data.choices?.[0]?.message?.content) {
        throw new Error("ไม่ได้รับการตอบกลับจาก AI");
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: sanitizeInput(data.choices[0].message.content),
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      toast.success("ได้รับการตอบกลับจาก AI แล้ว");
    } catch (error: any) {
      console.error("Chat error:", error);
      toast.error(error.message || "เกิดข้อผิดพลาดในการติดต่อ AI");
    } finally {
      setIsLoading(false);
    }
  };

  const saveApiKey = () => {
    const { isValid, error } = validateInput(textSchema, apiKey);
    if (!isValid) {
      toast.error(error || 'API Key ไม่ถูกต้อง');
      return;
    }
    
    if (!apiKey.trim()) {
      toast.error("กรุณาใส่ API Key");
      return;
    }
    
    setShowSettings(false);
    toast.success("บันทึก API Key แล้ว");
  };

  const clearChat = () => {
    setMessages([]);
    if (user?.id) {
      localStorage.removeItem(`ai-chat-messages-${user.id}`);
    }
    toast.success("ล้างประวัติการสนทนาแล้ว");
  };

  const exportChat = () => {
    if (messages.length === 0) {
      toast.error("ไม่มีประวัติการสนทนาให้ส่งออก");
      return;
    }

    try {
      const chatData = JSON.stringify(messages, null, 2);
      const blob = new Blob([chatData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `chat-history-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("ส่งออกประวัติการสนทนาแล้ว");
    } catch (error) {
      toast.error("เกิดข้อผิดพลาดในการส่งออกข้อมูล");
    }
  };

  if (storageLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
        <Card className="p-8 text-center">
          <Bot className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">กำลังโหลด...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Bot className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-foreground">Deeja AI Chat</h1>
                <p className="text-muted-foreground">สนทนากับ AI Assistant ที่เข้าใจวัฒนธรรมไทย</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowSettings(!showSettings)}>
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={exportChat}>
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={clearChat}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
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
              <p className="text-sm text-muted-foreground mt-2">
                API Key จะถูกเข้ารหัสและเก็บในเบราว์เซอร์ของคุณอย่างปลอดภัย
              </p>
            </Card>
          )}

          {/* Chat Messages */}
          <Card className="h-[500px] overflow-hidden flex flex-col border-primary/20">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-muted-foreground py-12">
                  <Bot className="h-12 w-12 mx-auto mb-4 text-primary/50" />
                  <p>เริ่มสนทนากับ Deeja AI ได้เลย!</p>
                  <p className="text-sm">ถามอะไรเกี่ยวกับวัฒนธรรมไทยหรือเทคโนโลยี AGI ได้นะ</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`flex gap-2 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.role === "user" ? "bg-primary" : "bg-secondary"
                      }`}>
                        {message.role === "user" ? (
                          <User className="h-4 w-4 text-primary-foreground" />
                        ) : (
                          <Bot className="h-4 w-4 text-secondary-foreground" />
                        )}
                      </div>
                      <div className={`rounded-lg p-3 ${
                        message.role === "user" 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-secondary text-secondary-foreground"
                      }`}>
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString("th-TH")}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                    <Bot className="h-4 w-4 text-secondary-foreground animate-pulse" />
                  </div>
                  <div className="bg-secondary rounded-lg p-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-border p-4">
              <div className="flex gap-2">
                <Input
                  placeholder="พิมพ์ข้อความของคุณ..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                  disabled={isLoading}
                  className="flex-1"
                  maxLength={1000}
                />
                <Button 
                  onClick={handleSendMessage} 
                  disabled={isLoading || !input.trim()}
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={apiKey ? "default" : "destructive"} className="text-xs">
                  {apiKey ? "API Key ตั้งค่าแล้ว" : "ยังไม่ได้ตั้งค่า API Key"}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {messages.length} ข้อความ
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Chat;
