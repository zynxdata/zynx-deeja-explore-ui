import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';

export class APIKeyService {
  private static async encryptKey(key: string): Promise<string> {
    // Simple client-side encryption for additional security
    // In production, this should be done server-side
    const encoder = new TextEncoder();
    const data = encoder.encode(key);
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode('zynx-api-key-salt-2024'),
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey']
    );
    
    const cryptoKey = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: encoder.encode('api-salt'),
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt']
    );
    
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      data
    );
    
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);
    
    return btoa(String.fromCharCode(...combined));
  }
  
  private static async decryptKey(encryptedKey: string): Promise<string> {
    try {
      const combined = new Uint8Array(
        atob(encryptedKey).split('').map(char => char.charCodeAt(0))
      );
      
      const iv = combined.slice(0, 12);
      const encrypted = combined.slice(12);
      
      const encoder = new TextEncoder();
      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        encoder.encode('zynx-api-key-salt-2024'),
        'PBKDF2',
        false,
        ['deriveBits', 'deriveKey']
      );
      
      const cryptoKey = await crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: encoder.encode('api-salt'),
          iterations: 100000,
          hash: 'SHA-256',
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['decrypt']
      );
      
      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        cryptoKey,
        encrypted
      );
      
      return new TextDecoder().decode(decrypted);
    } catch (error) {
      console.error('Failed to decrypt API key:', error);
      throw new Error('Failed to decrypt API key');
    }
  }
  
  static async saveApiKey(serviceName: string, apiKey: string, userId: string): Promise<void> {
    if (!userId) throw new Error('User not authenticated');
    
    const encryptedKey = await this.encryptKey(apiKey);
    
    // Use upsert to either insert or update
    const { error } = await supabase
      .from('user_api_keys')
      .upsert({
        user_id: userId,
        service_name: serviceName,
        encrypted_key: encryptedKey
      });
    
    if (error) {
      throw new Error(`Failed to save API key: ${error.message}`);
    }
  }
  
  static async getApiKey(serviceName: string, userId: string): Promise<string | null> {
    if (!userId) return null;
    
    const { data, error } = await supabase
      .from('user_api_keys')
      .select('encrypted_key')
      .eq('user_id', userId)
      .eq('service_name', serviceName)
      .single();
    
    if (error || !data) {
      return null;
    }
    
    try {
      return await this.decryptKey(data.encrypted_key);
    } catch (error) {
      console.error('Failed to decrypt API key:', error);
      return null;
    }
  }
  
  static async deleteApiKey(serviceName: string, userId: string): Promise<void> {
    if (!userId) throw new Error('User not authenticated');
    
    const { error } = await supabase
      .from('user_api_keys')
      .delete()
      .eq('user_id', userId)
      .eq('service_name', serviceName);
    
    if (error) {
      throw new Error(`Failed to delete API key: ${error.message}`);
    }
  }
}

// Hook for secure API key management
export const useSecureApiKey = (serviceName: string) => {
  const { user } = useAuth();
  
  const saveApiKey = async (apiKey: string) => {
    if (!user?.id) throw new Error('User not authenticated');
    return APIKeyService.saveApiKey(serviceName, apiKey, user.id);
  };
  
  const getApiKey = async () => {
    if (!user?.id) return null;
    return APIKeyService.getApiKey(serviceName, user.id);
  };
  
  const deleteApiKey = async () => {
    if (!user?.id) throw new Error('User not authenticated');
    return APIKeyService.deleteApiKey(serviceName, user.id);
  };
  
  return {
    saveApiKey,
    getApiKey,
    deleteApiKey,
    userId: user?.id
  };
};