
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/auth/AuthProvider";
import SecureErrorBoundary from "./components/security/SecureErrorBoundary";
import SecurityHeaders from "./components/security/SecurityHeaders";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/AppSidebar";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Chat from "./pages/Chat";
import ImageGenerator from "./pages/ImageGenerator";
import Research from "./pages/Research";
import AlgorithmGame from "./pages/AlgorithmGame";
import AuthPage from "./components/auth/AuthPage";
import AdminSetup from "./pages/AdminSetup";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
import ComponentFlowchart from "./pages/ComponentFlowchart";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

// Enhanced QueryClient with better error handling and logging
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        console.log('🔧 QueryClient: Query retry attempt', {
          failureCount,
          error: error?.message
        });
        // Don't retry on authentication errors
        if (error?.status === 401 || error?.status === 403) {
          console.log('🚨 QueryClient: Auth error, not retrying');
          return false;
        }
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000 // 5 minutes
    },
    mutations: {
      // Remove onError from mutations as well
    }
  }
});

// Connection test component
const ConnectionTest = () => {
  useEffect(() => {
    const testConnections = async () => {
      console.log('🔧 ConnectionTest: Starting connectivity tests...');

      // Test Supabase connection
      try {
        const {
          data,
          error
        } = await supabase.from('profiles').select('count').limit(1);
        if (error) {
          console.error('🚨 ConnectionTest: Supabase connection error:', error);
        } else {
          console.log('✅ ConnectionTest: Supabase connection successful');
        }
      } catch (error) {
        console.error('🚨 ConnectionTest: Supabase connection exception:', error);
      }

      // Test rate limiter function
      try {
        const {
          data,
          error
        } = await supabase.functions.invoke('rate-limiter', {
          body: {
            identifier: 'connection-test',
            action: 'test',
            maxRequests: 10,
            timeWindow: 60000
          }
        });
        if (error) {
          console.error('🚨 ConnectionTest: Rate limiter function error:', error);
        } else {
          console.log('✅ ConnectionTest: Rate limiter function working');
        }
      } catch (error) {
        console.error('🚨 ConnectionTest: Rate limiter function exception:', error);
      }

      // Test security monitor function
      try {
        const {
          data,
          error
        } = await supabase.functions.invoke('security-monitor', {
          body: {
            event_type: 'api_abuse',
            severity: 'low',
            details: {
              test: 'connection-test'
            }
          }
        });
        if (error) {
          console.error('🚨 ConnectionTest: Security monitor function error:', error);
        } else {
          console.log('✅ ConnectionTest: Security monitor function working');
        }
      } catch (error) {
        console.error('🚨 ConnectionTest: Security monitor function exception:', error);
      }
    };
    testConnections();
  }, []);
  return null;
};

const App = () => {
  console.log('🔧 App: Initializing application...');
  return <SecureErrorBoundary>
      <SecurityHeaders />
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <ConnectionTest />
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <SidebarProvider>
                <div className="min-h-screen flex w-full">
                  <AppSidebar />
                  <SidebarInset>
                    <main className="flex-1 p-6">
                      <Routes>
                        <Route path="/auth" element={<AuthPage />} />
                        <Route path="/admin-setup" element={<AdminSetup />} />
                        <Route path="/" element={<Index />} />
                        <Route path="/research" element={<Research />} />
                        <Route path="/algorithm-game" element={<AlgorithmGame />} />
                        <Route path="/flowchart" element={<ComponentFlowchart />} />
                        <Route path="/chat" element={<ProtectedRoute>
                              <Chat />
                            </ProtectedRoute>} />
                        <Route path="/image-generator" element={<ProtectedRoute>
                              <ImageGenerator />
                            </ProtectedRoute>} />
                        <Route path="/admin" element={<ProtectedRoute>
                              <AdminDashboard />
                            </ProtectedRoute>} />
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
    </SecureErrorBoundary>;
};

export default App;
