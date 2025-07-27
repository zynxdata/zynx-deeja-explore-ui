
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';

export type UserRole = 'owner' | 'admin' | 'user';

export interface UserRoleData {
  role: UserRole | null;
  loading: boolean;
  isAdmin: boolean;
  isOwner: boolean;
  isAdminOrOwner: boolean;
}

export const useUserRole = (): UserRoleData => {
  const { user } = useAuth();
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        // Get user role from profiles table
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user role:', error);
          setRole('user'); // Default to user role
        } else {
          setRole(data?.role || 'user');
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        setRole('user');
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  const isAdmin = role === 'admin';
  const isOwner = role === 'owner';
  const isAdminOrOwner = isAdmin || isOwner;

  return {
    role,
    loading,
    isAdmin,
    isOwner,
    isAdminOrOwner,
  };
};

export default useUserRole;
