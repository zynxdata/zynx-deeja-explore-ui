
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorId: string;
}

class SecureErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorId: '',
  };

  public static getDerivedStateFromError(error: Error): State {
    // Generate a random error ID for tracking without exposing sensitive info
    const errorId = Math.random().toString(36).substring(2, 15);
    
    // Log error details securely (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error);
    }

    return { hasError: true, errorId };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // In production, you would send this to your error tracking service
    // with the errorId but without sensitive information
    console.error('Uncaught error:', {
      errorId: this.state.errorId,
      message: 'Application error occurred',
      // Don't log the actual error details in production
      ...(process.env.NODE_ENV === 'development' && {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
      }),
    });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
          <Card className="w-full max-w-md border-destructive/20">
            <CardHeader className="text-center">
              <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <CardTitle className="text-destructive">เกิดข้อผิดพลาด</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                ขออภัย เกิดข้อผิดพลาดในระบบ กรุณาลองใหม่อีกครั้ง
              </p>
              <p className="text-xs text-muted-foreground">
                รหัสข้อผิดพลาด: {this.state.errorId}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={this.handleReload} className="flex-1">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  โหลดใหม่
                </Button>
                <Button onClick={this.handleGoHome} className="flex-1">
                  <Home className="h-4 w-4 mr-2" />
                  หน้าแรก
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default SecureErrorBoundary;
