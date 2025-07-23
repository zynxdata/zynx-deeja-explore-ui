
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, MessageSquare, Image, Mic, Settings, Brain, LogOut, LogIn } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";

const Navigation = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('ออกจากระบบสำเร็จ');
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดในการออกจากระบบ');
    }
  };

  const navItems = [
    { path: "/", label: "หน้าแรก", icon: Home, requireAuth: false },
    { path: "/chat", label: "AI Chat", icon: MessageSquare, requireAuth: true },
    { path: "/image-generator", label: "สร้างรูปภาพ", icon: Image, requireAuth: true },
    { path: "/voice-chat", label: "Voice AI", icon: Mic, requireAuth: true },
    { path: "/settings", label: "ตั้งค่า", icon: Settings, requireAuth: true },
  ];

  // Filter nav items based on authentication status
  const visibleNavItems = navItems.filter(item => !item.requireAuth || user);

  return (
    <nav className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">Deeja AI</span>
          </Link>

          {/* Navigation Menu */}
          <div className="hidden md:flex items-center gap-1">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Button
                  key={item.path}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  asChild
                  className="gap-2"
                >
                  <Link to={item.path}>
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                </Button>
              );
            })}

            {/* Auth Button */}
            {user ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="gap-2 ml-2"
              >
                <LogOut className="h-4 w-4" />
                ออกจากระบบ
              </Button>
            ) : (
              <Button
                variant="default"
                size="sm"
                asChild
                className="gap-2 ml-2"
              >
                <Link to="/auth">
                  <LogIn className="h-4 w-4" />
                  เข้าสู่ระบบ
                </Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            {user ? (
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            ) : (
              <Button variant="default" size="sm" asChild>
                <Link to="/auth">
                  <LogIn className="h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-4">
          <div className="grid grid-cols-2 gap-2">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Button
                  key={item.path}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  asChild
                  className="gap-2 justify-start"
                >
                  <Link to={item.path}>
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
