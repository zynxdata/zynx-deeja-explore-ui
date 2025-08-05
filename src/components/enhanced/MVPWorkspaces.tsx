import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { MessageCircle, Languages, FileSpreadsheet, Presentation, FileText } from "lucide-react";
import { Link } from "react-router-dom";

const workspaces = [
  {
    id: "chat",
    title: "Chat",
    titleTh: "แชท",
    description: "Emotional AI conversations with cultural awareness",
    descriptionTh: "การสนทนา AI ที่เข้าใจอารมณ์และวัฒนธรรม",
    icon: MessageCircle,
    route: "/chat",
    color: "text-agi-yellow",
    bgColor: "bg-agi-yellow/10",
    borderColor: "border-agi-yellow/20"
  },
  {
    id: "translate",
    title: "Translate",
    titleTh: "แปล",
    description: "Context-aware translation with cultural adaptation",
    descriptionTh: "การแปลที่เข้าใจบริบทและปรับให้เข้ากับวัฒนธรรม",
    icon: Languages,
    route: "/translate",
    color: "text-agi-orange",
    bgColor: "bg-agi-orange/10",
    borderColor: "border-agi-orange/20"
  },
  {
    id: "sheet",
    title: "Sheet",
    titleTh: "ชีต",
    description: "AI-powered spreadsheet with intelligent formulas",
    descriptionTh: "สเปรดชีต AI ที่มีสูตรอัจฉริยะ",
    icon: FileSpreadsheet,
    route: "/sheet",
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/20"
  },
  {
    id: "slides",
    title: "Slides",
    titleTh: "สไลด์",
    description: "Live presentation with real-time data binding",
    descriptionTh: "นำเสนอแบบสดพร้อมการเชื่อมโยงข้อมูลแบบเรียลไทม์",
    icon: Presentation,
    route: "/slides",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
    borderColor: "border-secondary/20"
  },
  {
    id: "pdf",
    title: "PDF",
    titleTh: "พีดีเอฟ",
    description: "Structure-aware document processing and extraction",
    descriptionTh: "การประมวลผลและดึงข้อมูลเอกสารที่เข้าใจโครงสร้าง",
    icon: FileText,
    route: "/pdf",
    color: "text-accent",
    bgColor: "bg-accent/10",
    borderColor: "border-accent/20"
  }
];

export const MVPWorkspaces = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-background/50 to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-agi-yellow bg-clip-text text-transparent">
            5 MVP Workspaces
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Five powerful AI workspaces designed for the modern bilingual workflow
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            ห้าพื้นที่ทำงาน AI ที่ทรงพลังสำหรับเวิร์กโฟลว์สองภาษาสมัยใหม่
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {workspaces.map((workspace) => {
            const Icon = workspace.icon;
            return (
              <Tooltip key={workspace.id}>
                <TooltipTrigger asChild>
                  <Link to={workspace.route}>
                    <Card className={`
                      group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg
                      ${workspace.bgColor} ${workspace.borderColor} border-2
                      hover:border-primary/40 hover:bg-primary/5
                    `}>
                      <CardHeader className="text-center pb-3">
                        <div className={`
                          w-12 h-12 mx-auto rounded-full flex items-center justify-center
                          ${workspace.bgColor} group-hover:bg-primary/20 transition-colors
                        `}>
                          <Icon className={`h-6 w-6 ${workspace.color} group-hover:text-primary transition-colors`} />
                        </div>
                        <CardTitle className="text-base group-hover:text-primary transition-colors">
                          {workspace.title}
                        </CardTitle>
                        <CardDescription className="text-xs text-muted-foreground">
                          {workspace.titleTh}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                  <div className="text-center">
                    <p className="font-medium">{workspace.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{workspace.descriptionTh}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </div>
    </section>
  );
};