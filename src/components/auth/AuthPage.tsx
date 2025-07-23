
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from './AuthProvider';
import { toast } from 'sonner';
import { Shield, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAdvancedInputValidation, enhancedEmailSchema, enhancedPasswordSchema } from '@/components/security/AdvancedInputValidator';
import { useSecurityMonitor } from '@/hooks/useSecurityMonitor';
import { useServerRateLimit } from '@/hooks/useServerRateLimit';

const AuthPage = () => {
  const { user, signIn, signUp } = useAuth();
  const { validateInputAdvanced, sanitizeInputAdvanced } = useAdvancedInputValidation();
  const { logFailedAuth, logSuspiciousActivity } = useSecurityMonitor();
  const { checkRateLimit } = useServerRateLimit();
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already authenticated
  if (user) {
    return <Navigate to="/" replace />;
  }

  const validateInput = async () => {
    // Server-side rate limiting check
    const rateLimitResult = await checkRateLimit(
      email || 'anonymous', 
      'auth_attempt', 
      5, // max 5 attempts
      300000 // per 5 minutes
    );

    if (!rateLimitResult.allowed) {
      setError('พยายามเข้าสู่ระบบมากเกินไป กรุณารอ 5 นาที');
      return false;
    }

    // Enhanced email validation
    const emailValidation = validateInputAdvanced(enhancedEmailSchema, email, 'email');
    if (!emailValidation.isValid) {
      setError(emailValidation.error || 'อีเมลไม่ถูกต้อง');
      return false;
    }

    // Enhanced password validation
    const passwordValidation = validateInputAdvanced(enhancedPasswordSchema, password, 'password');
    if (!passwordValidation.isValid) {
      setError(passwordValidation.error || 'รหัสผ่านไม่ถูกต้อง');
      return false;
    }

    if (!isLogin && password !== confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!(await validateInput())) return;

    setLoading(true);

    try {
      const sanitizedEmail = sanitizeInputAdvanced(email);
      
      const { error } = isLogin 
        ? await signIn(sanitizedEmail, password)
        : await signUp(sanitizedEmail, password);

      if (error) {
        // Log failed authentication attempt
        logFailedAuth({
          email: sanitizedEmail,
          error: error.message,
          action: isLogin ? 'signin' : 'signup'
        });

        if (error.message.includes('Invalid login credentials')) {
          setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
        } else if (error.message.includes('User already registered')) {
          setError('อีเมลนี้ถูกใช้งานแล้ว กรุณาเข้าสู่ระบบแทน');
        } else if (error.message.includes('Email not confirmed')) {
          setError('กรุณายืนยันอีเมลก่อนเข้าสู่ระบบ');
        } else if (error.message.includes('Signup not allowed')) {
          setError('ไม่อนุญาตให้สมัครสมาชิกในขณะนี้');
        } else {
          setError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
          
          // Log suspicious activity for unusual errors
          logSuspiciousActivity({
            email: sanitizedEmail,
            error: error.message,
            action: isLogin ? 'signin' : 'signup',
            reason: 'Unusual authentication error'
          });
        }
      } else {
        if (isLogin) {
          toast.success('เข้าสู่ระบบสำเร็จ');
        } else {
          toast.success('สมัครสมาชิกสำเร็จ กรุณาตรวจสอบอีเมลเพื่อยืนยันบัญชี');
        }
      }
    } catch (err) {
      console.error('Authentication error:', err);
      setError('เกิดข้อผิดพลาดที่ไม่คาดคิด');
      
      logSuspiciousActivity({
        email: email,
        error: err instanceof Error ? err.message : 'Unknown error',
        action: isLogin ? 'signin' : 'signup',
        reason: 'Unexpected authentication error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-primary/20">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">
            {isLogin ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">อีเมล</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.trim())}
                  className="pl-10"
                  disabled={loading}
                  required
                  maxLength={254}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">รหัสผ่าน</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="รหัสผ่าน"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  disabled={loading}
                  required
                  maxLength={128}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-8 w-8 p-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">ยืนยันรหัสผ่าน</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="ยืนยันรหัสผ่าน"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10"
                    disabled={loading}
                    required
                    maxLength={128}
                  />
                </div>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                  {isLogin ? 'กำลังเข้าสู่ระบบ...' : 'กำลังสมัครสมาชิก...'}
                </div>
              ) : (
                <>
                  <User className="h-4 w-4 mr-2" />
                  {isLogin ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
                </>
              )}
            </Button>

            <div className="text-center">
              <Button
                type="button"
                variant="link"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setPassword('');
                  setConfirmPassword('');
                }}
                disabled={loading}
              >
                {isLogin 
                  ? 'ยังไม่มีบัญชี? สมัครสมาชิก' 
                  : 'มีบัญชีแล้ว? เข้าสู่ระบบ'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
