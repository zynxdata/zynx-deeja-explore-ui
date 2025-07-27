import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔧 AuthProvider: Initializing authentication...');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('🔧 AuthProvider: Auth state changed:', { event, user: session?.user?.email || 'none' });
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    console.log('🔧 AuthProvider: Checking for existing session...');
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('🚨 AuthProvider: Error getting session:', error);
      } else {
        console.log('🔧 AuthProvider: Session check result:', { user: session?.user?.email || 'none' });
      }
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    }).catch((error) => {
      console.error('🚨 AuthProvider: Session check failed:', error);
      setLoading(false);
    });

    return () => {
      console.log('🔧 AuthProvider: Cleaning up subscription');
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('🔧 AuthProvider: Attempting sign in for:', email);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        console.error('🚨 AuthProvider: Sign in error:', error);
      } else {
        console.log('✅ AuthProvider: Sign in successful');
      }
      return { error };
    } catch (error) {
      console.error('🚨 AuthProvider: Sign in exception:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string) => {
    console.log('🔧 AuthProvider: Attempting sign up for:', email);
    const redirectUrl = `${window.location.origin}/`;
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });
      if (error) {
        console.error('🚨 AuthProvider: Sign up error:', error);
      } else {
        console.log('✅ AuthProvider: Sign up successful');
      }
      return { error };
    } catch (error) {
      console.error('🚨 AuthProvider: Sign up exception:', error);
      return { error };
    }
  };

  const signOut = async () => {
    console.log('🔧 AuthProvider: Signing out...');
    try {
      await supabase.auth.signOut();
      console.log('✅ AuthProvider: Sign out successful');
    } catch (error) {
      console.error('🚨 AuthProvider: Sign out error:', error);
    }
  };

  console.log('🔧 AuthProvider: Current state:', { 
    loading, 
    hasUser: !!user, 
    userEmail: user?.email || 'none' 
  });

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
