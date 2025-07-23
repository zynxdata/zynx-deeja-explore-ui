
import { z } from 'zod';

// Common validation schemas
export const emailSchema = z
  .string()
  .email('กรุณากรอกอีเมลให้ถูกต้อง')
  .min(1, 'กรุณากรอกอีเมล');

export const passwordSchema = z
  .string()
  .min(6, 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร')
  .max(128, 'รหัสผ่านต้องไม่เกิน 128 ตัวอักษร');

export const textSchema = z
  .string()
  .min(1, 'กรุณากรอกข้อมูล')
  .max(1000, 'ข้อความต้องไม่เกิน 1000 ตัวอักษร')
  .refine(
    (val) => !/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(val),
    'ตรวจพบโค้ดที่ไม่ปลอดภัย'
  );

export const apiKeySchema = z
  .string()
  .min(10, 'API Key ต้องมีความยาวอย่างน้อย 10 ตัวอักษร')
  .regex(/^[a-zA-Z0-9\-_]+$/, 'API Key มีรูปแบบไม่ถูกต้อง');

// Sanitize HTML to prevent XSS
export const sanitizeHtml = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Rate limiting helper
class RateLimiter {
  private requests: Map<string, number[]> = new Map();

  checkRate(identifier: string, maxRequests: number, timeWindow: number): boolean {
    const now = Date.now();
    const windowStart = now - timeWindow;
    
    if (!this.requests.has(identifier)) {
      this.requests.set(identifier, []);
    }
    
    const requests = this.requests.get(identifier)!;
    
    // Remove old requests outside the time window
    const validRequests = requests.filter(time => time > windowStart);
    
    if (validRequests.length >= maxRequests) {
      return false; // Rate limit exceeded
    }
    
    validRequests.push(now);
    this.requests.set(identifier, validRequests);
    
    return true; // Request allowed
  }
}

export const rateLimiter = new RateLimiter();

// Validation hook
export const useInputValidation = () => {
  const validateInput = (schema: z.ZodSchema, value: any) => {
    try {
      schema.parse(value);
      return { isValid: true, error: null };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { isValid: false, error: error.errors[0].message };
      }
      return { isValid: false, error: 'การตรวจสอบข้อมูลล้มเหลว' };
    }
  };

  const sanitizeInput = (input: string): string => {
    return sanitizeHtml(input.trim());
  };

  return { validateInput, sanitizeInput };
};
