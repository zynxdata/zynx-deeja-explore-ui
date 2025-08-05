import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Siriporn Kultanavitch",
    nameTh: "ศิริพร กุลตานาวิช",
    role: "CTO, Thai Fintech Startup",
    roleTh: "ซีทีโอ, สตาร์ทอัพฟินเทคไทย",
    content: "Zynx CaaS revolutionized our bilingual customer support. The cultural context awareness is unprecedented.",
    contentTh: "Zynx CaaS ปฏิวัติการสนับสนุนลูกค้าสองภาษาของเรา การตระหนักรู้บริบททางวัฒนธรรมไม่มีใครเทียบได้",
    rating: 5,
    avatar: "/placeholder.svg"
  },
  {
    id: 2,
    name: "Marcus Chen",
    nameTh: "มาร์คัส เฉิน",
    role: "Head of AI, Regional Enterprise",
    roleTh: "หัวหน้า AI, องค์กรระดับภูมิภาค",
    content: "The emotional intelligence in Deeja AI is remarkable. It adapts to our team's communication style perfectly.",
    contentTh: "ความฉลาดทางอารมณ์ใน Deeja AI น่าทึ่งมาก ปรับให้เข้ากับสไตล์การสื่อสารของทีมเราได้อย่างสมบูรณ์แบบ",
    rating: 5,
    avatar: "/placeholder.svg"
  },
  {
    id: 3,
    name: "Ploy Supakit",
    nameTh: "พลอย ศุภกิจ",
    role: "Product Manager, EdTech",
    roleTh: "ผู้จัดการผลิตภัณฑ์, เอ็ดเทค",
    content: "From prototype to production in 2 weeks. The API simplicity and cultural accuracy saved us months.",
    contentTh: "จากต้นแบบสู่การผลิตใน 2 สัปดาห์ ความเรียบง่ายของ API และความแม่นยำทางวัฒนธรรมช่วยเราได้หลายเดือน",
    rating: 5,
    avatar: "/placeholder.svg"
  }
];

export const TestimonialsSection = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trusted by Forward-Thinking Teams
          </h2>
          <p className="text-lg text-muted-foreground">
            ได้รับความไว้วางใจจากทีมที่คิดไปข้างหน้า
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-agi-yellow text-agi-yellow" />
                      ))}
                    </div>
                    <h4 className="font-semibold text-sm">{testimonial.name}</h4>
                    <p className="text-xs text-muted-foreground">{testimonial.nameTh}</p>
                    <p className="text-xs text-muted-foreground mt-1">{testimonial.role}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.roleTh}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <blockquote className="text-sm leading-relaxed mb-3">
                  "{testimonial.content}"
                </blockquote>
                <p className="text-xs text-muted-foreground italic">
                  "{testimonial.contentTh}"
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};