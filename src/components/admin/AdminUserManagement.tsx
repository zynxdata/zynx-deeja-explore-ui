import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useUserRole } from '@/hooks/useUserRole';
import { UserPlus, Loader2, Shield } from 'lucide-react';

const AdminUserManagement = () => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'owner'>('admin');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { isOwner } = useUserRole();

  const handleCreateAdmin = async () => {
    if (!email.trim()) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    if (!isOwner) {
      toast({
        title: "Access Denied",
        description: "Only owners can create admin users",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Use the secure database function to create admin user
      const { data, error } = await supabase.rpc('create_admin_user', {
        user_email: email.trim(),
        user_role: role
      });

      if (error) {
        throw error;
      }

      if (data) {
        toast({
          title: "Success",
          description: `${role.charAt(0).toUpperCase() + role.slice(1)} privileges granted to ${email}`,
        });
        setEmail('');
      }
    } catch (error: any) {
      console.error('Error creating admin user:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create admin user. Make sure the user exists and is registered.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOwner) {
    return (
      <Card className="border-destructive/20">
        <CardContent className="pt-6">
          <div className="text-center">
            <Shield className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-destructive mb-2">
              Access Restricted
            </h3>
            <p className="text-muted-foreground">
              Only system owners can manage user roles.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-primary" />
          <CardTitle>Promote User to Admin</CardTitle>
        </div>
        <CardDescription>
          Grant admin or owner privileges to existing users. The user must already be registered.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            User Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="user@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="role" className="text-sm font-medium">
            Role
          </label>
          <Select value={role} onValueChange={(value: 'admin' | 'owner') => setRole(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="owner">Owner</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={handleCreateAdmin} 
          disabled={isLoading || !email.trim()}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Granting Privileges...
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4 mr-2" />
              Grant {role.charAt(0).toUpperCase() + role.slice(1)} Privileges
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AdminUserManagement;