
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Shield, User, Mail, Lock, CheckCircle, AlertTriangle } from 'lucide-react';

const createOwnerSchema = z.object({
  email: z.string().email('กรุณากรอกอีเมลให้ถูกต้อง'),
  password: z.string().min(8, 'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "รหัสผ่านไม่ตรงกัน",
  path: ["confirmPassword"],
});

type CreateOwnerFormData = z.infer<typeof createOwnerSchema>;

const CreateOwnerUser = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [existingUser, setExistingUser] = useState<string | null>(null);
  const [ownerExists, setOwnerExists] = useState(false);

  const form = useForm<CreateOwnerFormData>({
    resolver: zodResolver(createOwnerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  // Check if owner exists and find existing users
  useEffect(() => {
    const checkOwnerStatus = async () => {
      try {
        // Check for existing owner
        const { data: ownerData } = await supabase
          .from('profiles')
          .select('email')
          .eq('role', 'owner')
          .maybeSingle();

        if (ownerData) {
          setOwnerExists(true);
          return;
        }

        // Check for existing users that could be upgraded
        const { data: userData } = await supabase
          .from('profiles')
          .select('email')
          .eq('role', 'user')
          .limit(1)
          .maybeSingle();

        if (userData) {
          setExistingUser(userData.email);
        }
      } catch (err) {
        console.error('Error checking owner status:', err);
      }
    };

    checkOwnerStatus();
  }, []);

  const createNewOwner = async (data: CreateOwnerFormData) => {
    try {
      const { data: result, error } = await supabase.rpc('create_first_owner', {
        owner_email: data.email,
        owner_password: data.password
      });

      if (error) throw error;

      const ownerResult = result?.[0];
      if (ownerResult?.success) {
        setSuccess(true);
        toast.success('สร้างบัญชี Owner สำเร็จ');
        form.reset();
      } else {
        setError(ownerResult?.message || 'ไม่สามารถสร้างบัญชี Owner ได้');
      }
    } catch (err: any) {
      console.error('Create owner error:', err);
      setError(`เกิดข้อผิดพลาด: ${err.message}`);
    }
  };

  const upgradeExistingUser = async () => {
    if (!existingUser) return;
    
    setLoading(true);
    setError('');

    try {
      const { data: result, error } = await supabase.rpc('upgrade_user_to_owner', {
        user_email: existingUser
      });

      if (error) throw error;

      const upgradeResult = result?.[0];
      if (upgradeResult?.success) {
        setSuccess(true);
        toast.success('อัพเกรดบัญชีเป็น Owner สำเร็จ');
      } else {
        setError(upgradeResult?.message || 'ไม่สามารถอัพเกรดบัญชีได้');
      }
    } catch (err: any) {
      console.error('Upgrade user error:', err);
      setError(`เกิดข้อผิดพลาด: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: CreateOwnerFormData) => {
    setLoading(true);
    setError('');

    try {
      await createNewOwner(data);
    } catch (err) {
      console.error('Submit error:', err);
      setError('เกิดข้อผิดพลาดที่ไม่คาดคิด');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="text-center">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              สร้างบัญชี Owner สำเร็จ
            </h3>
            <p className="text-green-700">
              บัญชี Owner ได้ถูกสร้างเรียบร้อยแล้ว
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (ownerExists) {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="pt-6">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              บัญชี Owner มีอยู่แล้ว
            </h3>
            <p className="text-yellow-700">
              ระบบมีบัญชี Owner อยู่แล้ว ไม่สามารถสร้างเพิ่มได้
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {existingUser && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <AlertTriangle className="h-8 w-8 text-blue-600 mx-auto" />
              <div>
                <h4 className="font-semibold text-blue-800 mb-2">
                  พบบัญชีผู้ใช้ที่มีอยู่
                </h4>
                <p className="text-blue-700 text-sm mb-4">
                  พบบัญชี: <strong>{existingUser}</strong><br />
                  คุณต้องการอัพเกรดบัญชีนี้ให้เป็น Owner หรือไม่?
                </p>
                <Button 
                  onClick={upgradeExistingUser}
                  disabled={loading}
                  variant="outline"
                  className="w-full border-blue-300 text-blue-700 hover:bg-blue-100"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                      กำลังอัพเกรด...
                    </div>
                  ) : (
                    <>
                      <User className="h-4 w-4 mr-2" />
                      อัพเกรดเป็น Owner
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-primary" />
            <CardTitle>สร้างบัญชี Owner ใหม่</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>อีเมล</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        {...field}
                        type="email"
                        placeholder="admin@example.com"
                        className="pl-10"
                        disabled={loading}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>รหัสผ่าน</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        {...field}
                        type="password"
                        placeholder="รหัสผ่าน"
                        className="pl-10"
                        disabled={loading}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ยืนยันรหัสผ่าน</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        {...field}
                        type="password"
                        placeholder="ยืนยันรหัสผ่าน"
                        className="pl-10"
                        disabled={loading}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                  กำลังสร้างบัญชี...
                </div>
              ) : (
                <>
                  <User className="h-4 w-4 mr-2" />
                  สร้างบัญชี Owner
                </>
              )}
            </Button>
          </form>
        </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateOwnerUser;
