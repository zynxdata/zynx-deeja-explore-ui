import { supabase } from '@/integrations/supabase/client';
import { AuthError } from '@supabase/supabase-js';

export interface AuthResponse {
  error: AuthError | null;
  success: boolean;
  message?: string;
}

// Email/Password Authentication
export async function signInWithEmail(email: string, password: string): Promise<AuthResponse> {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('🚨 AuthService: Email sign in error:', error);
      return { error, success: false };
    }

    console.log('✅ AuthService: Email sign in successful');
    return { error: null, success: true };
  } catch (error) {
    console.error('🚨 AuthService: Email sign in exception:', error);
    return { 
      error: error as AuthError, 
      success: false,
      message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ'
    };
  }
}

export async function signUpWithEmail(email: string, password: string): Promise<AuthResponse> {
  try {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });

    if (error) {
      console.error('🚨 AuthService: Email sign up error:', error);
      return { error, success: false };
    }

    console.log('✅ AuthService: Email sign up successful');
    return { 
      error: null, 
      success: true,
      message: 'กรุณาตรวจสอบอีเมลเพื่อยืนยันบัญชี'
    };
  } catch (error) {
    console.error('🚨 AuthService: Email sign up exception:', error);
    return { 
      error: error as AuthError, 
      success: false,
      message: 'เกิดข้อผิดพลาดในการสมัครสมาชิก'
    };
  }
}

// Google OAuth
export async function signInWithGoogle(): Promise<AuthResponse> {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`
      }
    });

    if (error) {
      console.error('🚨 AuthService: Google OAuth error:', error);
      return { error, success: false };
    }

    console.log('✅ AuthService: Google OAuth initiated');
    return { error: null, success: true };
  } catch (error) {
    console.error('🚨 AuthService: Google OAuth exception:', error);
    return { 
      error: error as AuthError, 
      success: false,
      message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบด้วย Google'
    };
  }
}

// GitHub OAuth
export async function signInWithGitHub(): Promise<AuthResponse> {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/`
      }
    });

    if (error) {
      console.error('🚨 AuthService: GitHub OAuth error:', error);
      return { error, success: false };
    }

    console.log('✅ AuthService: GitHub OAuth initiated');
    return { error: null, success: true };
  } catch (error) {
    console.error('🚨 AuthService: GitHub OAuth exception:', error);
    return { 
      error: error as AuthError, 
      success: false,
      message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบด้วย GitHub'
    };
  }
}

// Sign out
export async function signOut(): Promise<AuthResponse> {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('🚨 AuthService: Sign out error:', error);
      return { error, success: false };
    }

    console.log('✅ AuthService: Sign out successful');
    return { error: null, success: true };
  } catch (error) {
    console.error('🚨 AuthService: Sign out exception:', error);
    return { 
      error: error as AuthError, 
      success: false,
      message: 'เกิดข้อผิดพลาดในการออกจากระบบ'
    };
  }
}

// Get current session
export async function getCurrentSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('🚨 AuthService: Get session error:', error);
      return null;
    }

    return session;
  } catch (error) {
    console.error('🚨 AuthService: Get session exception:', error);
    return null;
  }
}

// Get current user
export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('🚨 AuthService: Get user error:', error);
      return null;
    }

    return user;
  } catch (error) {
    console.error('🚨 AuthService: Get user exception:', error);
    return null;
  }
}