
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Brain, MessageCircle, Image, BookOpen, LogOut, LogIn, User } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { state } = useSidebar();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/", label: "หน้าหลัก", icon: Brain },
    { path: "/research", label: "วิจัย AGI", icon: BookOpen },
    { path: "/chat", label: "AI Chat", icon: MessageCircle, protected: true },
    { path: "/image-generator", label: "สร้างรูปภาพ", icon: Image, protected: true },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-border">
        <div className="flex items-center space-x-2 px-2 py-3">
          <Brain className="h-8 w-8 text-primary flex-shrink-0" />
          {state === "expanded" && (
            <span className="font-bold text-xl bg-gradient-to-r from-primary to-agi-yellow bg-clip-text text-transparent">
              Zynx AGI
            </span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>เมนูหลัก</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const Icon = item.icon;
                const shouldShow = !item.protected || user;
                
                if (!shouldShow) return null;
                
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild isActive={isActive(item.path)}>
                      <Link to={item.path} className="flex items-center space-x-2">
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border">
        {user ? (
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <div className="flex items-center space-x-2 px-2 py-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  {state === "expanded" && (
                    <span className="text-sm text-muted-foreground truncate">
                      {user.email}
                    </span>
                  )}
                </div>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Button
                    variant="ghost"
                    onClick={signOut}
                    className="w-full justify-start space-x-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>ออกจากระบบ</span>
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        ) : (
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/auth" className="flex items-center space-x-2">
                    <LogIn className="h-4 w-4" />
                    <span>เข้าสู่ระบบ</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
