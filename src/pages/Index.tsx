
import HeroSection from "@/components/HeroSection";
import ContextEngine from "@/components/ContextEngine";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      
      {/* Context Engine Demo Section */}
      <section className="py-20 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Live Context Engine Demo
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              ดูการทำงานของ Zynx Context Engine ในการวิเคราะห์และปรับตัวตามบริบทของผู้ใช้แบบเรียลไทม์
            </p>
          </div>
          
          <ContextEngine />
          
          <div className="text-center mt-12">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  Context = Emotion + Culture + Memory + Intent + Time
                </CardTitle>
                <CardDescription>
                  สมการหลักของ Zynx AGI ที่ทำให้เข้าใจมนุษย์ได้อย่างลึกซึ้ง
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="group">
                  <a href="/research">
                    เรียนรู้เพิ่มเติมเกี่ยวกับ AGI Research
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
