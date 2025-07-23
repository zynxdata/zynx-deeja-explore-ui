
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/auth/AuthProvider";
import SecureErrorBoundary from "./components/security/SecureErrorBoundary";
import SecurityHeaders from "./components/security/SecurityHeaders";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/AppSidebar";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Chat from "./pages/Chat";
import ImageGenerator from "./pages/ImageGenerator";
import Research from "./pages/Research";
import AuthPage from "./components/auth/AuthPage";
import AdminSetup from "./pages/AdminSetup";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Don't retry on authentication errors
        if (error?.status === 401 || error?.status === 403) {
          return false;
        }
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => (
  <SecureErrorBoundary>
    <SecurityHeaders />
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <SidebarProvider>
              <div className="min-h-screen flex w-full">
                <AppSidebar />
                <SidebarInset>
                  <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <div className="h-4 w-px bg-border mx-2" />
                    <h1 className="text-lg font-semibold">Zynx CaaS Platform</h1>
                  </header>
                  <main className="flex-1 p-6">
                    <Routes>
                      <Route path="/auth" element={<AuthPage />} />
                      <Route path="/admin-setup" element={<AdminSetup />} />
                      <Route path="/" element={<Index />} />
                      <Route path="/research" element={<Research />} />
                      <Route 
                        path="/chat" 
                        element={
                          <ProtectedRoute>
                            <Chat />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/image-generator" 
                        element={
                          <ProtectedRoute>
                            <ImageGenerator />
                          </ProtectedRoute>
                        } 
                      />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                </SidebarInset>
              </div>
            </SidebarProvider>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </SecureErrorBoundary>
);

export default App;
