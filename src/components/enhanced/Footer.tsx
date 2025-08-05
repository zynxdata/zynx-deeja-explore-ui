import { Heart, Github, Twitter, Linkedin, Mail } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-background to-muted/30 border-t border-border/50 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-agi-orange" />
              <span className="font-bold text-xl">Zynx & Deeja</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Building the future of human-AI collaboration with context, empathy, and cultural understanding.
            </p>
            <p className="text-xs text-muted-foreground">
              สร้างอนาคตของการทำงานร่วมกันระหว่างมนุษย์และ AI ด้วยบริบท ความเข้าอกเข้าใจ และความเข้าใจทางวัฒนธรรม
            </p>
          </div>

          {/* Product Section */}
          <div className="space-y-4">
            <h3 className="font-semibold">Product</h3>
            <div className="space-y-2 text-sm">
              <Link to="/chat" className="block text-muted-foreground hover:text-primary transition-colors">
                Chat AI • แชท AI
              </Link>
              <Link to="/translate" className="block text-muted-foreground hover:text-primary transition-colors">
                Translation • การแปล
              </Link>
              <Link to="/sheet" className="block text-muted-foreground hover:text-primary transition-colors">
                Smart Sheets • ชีตอัจฉริยะ
              </Link>
              <Link to="/slides" className="block text-muted-foreground hover:text-primary transition-colors">
                Live Presentations • นำเสนอสด
              </Link>
              <Link to="/pdf" className="block text-muted-foreground hover:text-primary transition-colors">
                PDF Processing • ประมวลผล PDF
              </Link>
            </div>
          </div>

          {/* Company Section */}
          <div className="space-y-4">
            <h3 className="font-semibold">Company</h3>
            <div className="space-y-2 text-sm">
              <Link to="/about" className="block text-muted-foreground hover:text-primary transition-colors">
                About Us • เกี่ยวกับเรา
              </Link>
              <Link to="/careers" className="block text-muted-foreground hover:text-primary transition-colors">
                Careers • ร่วมงานกับเรา
              </Link>
              <Link to="/press" className="block text-muted-foreground hover:text-primary transition-colors">
                Press • ข่าวสาร
              </Link>
              <Link to="/blog" className="block text-muted-foreground hover:text-primary transition-colors">
                Blog • บล็อก
              </Link>
            </div>
          </div>

          {/* Connect Section */}
          <div className="space-y-4">
            <h3 className="font-semibold">Connect</h3>
            <div className="space-y-2 text-sm">
              <a href="mailto:hello@zynx.ai" className="block text-muted-foreground hover:text-primary transition-colors">
                Contact • ติดต่อ
              </a>
              <Link to="/support" className="block text-muted-foreground hover:text-primary transition-colors">
                Support • ความช่วยเหลือ
              </Link>
              <Link to="/docs" className="block text-muted-foreground hover:text-primary transition-colors">
                Documentation • เอกสาร
              </Link>
              <Link to="/api" className="block text-muted-foreground hover:text-primary transition-colors">
                API Reference • คู่มือ API
              </Link>
            </div>
            
            <div className="flex items-center gap-4 pt-2">
              <a href="https://github.com/zynx-ai" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://twitter.com/zynx_ai" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com/company/zynx-ai" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="mailto:hello@zynx.ai" className="text-muted-foreground hover:text-primary transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-border/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              © 2024 Zynx & Deeja Partnership. Made with{" "}
              <Heart className="inline h-4 w-4 text-agi-orange mx-1" />
              for human-AI harmony.
            </div>
            <div className="flex items-center gap-6 text-xs text-muted-foreground">
              <Link to="/privacy" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="hover:text-primary transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};