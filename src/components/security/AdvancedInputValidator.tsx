
import { z } from 'zod';
import { useSecurityMonitor } from '@/hooks/useSecurityMonitor';

// Enhanced validation schemas with more security checks
export const enhancedEmailSchema = z
  .string()
  .email('กรุณากรอกอีเมลให้ถูกต้อง')
  .min(1, 'กรุณากรอกอีเมล')
  .max(254, 'อีเมลยาวเกินไป') // RFC 5321 limit
  .refine(
    (val) => !val.includes('..'), // Prevent consecutive dots
    'รูปแบบอีเมลไม่ถูกต้อง'
  )
  .refine(
    (val) => !/[<>"]/.test(val), // Prevent injection attempts
    'อีเมลมีตัวอักษรที่ไม่อนุญาต'
  );

export const enhancedPasswordSchema = z
  .string()
  .min(8, 'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร')
  .max(128, 'รหัสผ่านต้องไม่เกิน 128 ตัวอักษร')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'รหัสผ่านต้องมีตัวอักษรพิมพ์เล็ก พิมพ์ใหญ่ และตัวเลข');

export const enhancedTextSchema = z
  .string()
  .min(1, 'กรุณากรอกข้อมูล')
  .max(2000, 'ข้อความต้องไม่เกิน 2000 ตัวอักษร')
  .refine(
    (val) => !/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(val),
    'ตรวจพบโค้ดที่ไม่ปลอดภัย'
  )
  .refine(
    (val) => !/javascript:|data:|vbscript:|on\w+\s*=/gi.test(val),
    'ตรวจพบเนื้อหาที่ไม่ปลอดภัย'
  )
  .refine(
    (val) => !/<iframe|<object|<embed|<link|<meta/gi.test(val),
    'ตรวจพบ HTML tags ที่ไม่อนุญาต'
  );

export const enhancedApiKeySchema = z
  .string()
  .min(20, 'API Key ต้องมีความยาวอย่างน้อย 20 ตัวอักษร')
  .max(200, 'API Key ยาวเกินไป')
  .regex(/^[a-zA-Z0-9\-_.]+$/, 'API Key มีรูปแบบไม่ถูกต้อง')
  .refine(
    (val) => !val.includes(' '), // No spaces allowed
    'API Key ต้องไม่มีช่องว่าง'
  );

// Advanced content filtering
export const sanitizeHtmlAdvanced = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .replace(/\\/g, '&#x5C;')
    .replace(/`/g, '&#x60;')
    .replace(/=/g, '&#x3D;');
};

// SQL injection pattern detection
const SQL_INJECTION_PATTERNS = [
  /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\b)/gi,
  /(;|\||&|\$|`|'|"|\\|\*|\?|<|>|\[|\]|\{|\}|\(|\))/g,
  /(-{2,}|\/\*|\*\/)/g,
];

export const detectSqlInjection = (input: string): boolean => {
  return SQL_INJECTION_PATTERNS.some(pattern => pattern.test(input));
};

// XSS pattern detection
const XSS_PATTERNS = [
  /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
  /<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,
  /data:text\/html/gi,
  /vbscript:/gi,
];

export const detectXss = (input: string): boolean => {
  return XSS_PATTERNS.some(pattern => pattern.test(input));
};

// Hook for advanced input validation with security monitoring
export const useAdvancedInputValidation = () => {
  const { logInvalidInput, logSuspiciousActivity } = useSecurityMonitor();

  const validateInputAdvanced = (schema: z.ZodSchema, value: any, fieldName?: string) => {
    try {
      // Check for common attack patterns first
      if (typeof value === 'string') {
        if (detectSqlInjection(value)) {
          logSuspiciousActivity({
            reason: 'SQL injection attempt detected',
            field: fieldName,
            value: value.substring(0, 100) // Log only first 100 chars
          });
          return { isValid: false, error: 'ตรวจพบเนื้อหาที่ไม่ปลอดภัย' };
        }

        if (detectXss(value)) {
          logSuspiciousActivity({
            reason: 'XSS attempt detected',
            field: fieldName,
            value: value.substring(0, 100)
          });
          return { isValid: false, error: 'ตรวจพบเนื้อหาที่ไม่ปลอดภัย' };
        }
      }

      schema.parse(value);
      return { isValid: true, error: null };
    } catch (error) {
      if (error instanceof z.ZodError) {
        logInvalidInput({
          field: fieldName,
          error: error.errors[0].message,
          value: typeof value === 'string' ? value.substring(0, 50) : 'non-string'
        });
        return { isValid: false, error: error.errors[0].message };
      }
      return { isValid: false, error: 'การตรวจสอบข้อมูลล้มเหลว' };
    }
  };

  const sanitizeInputAdvanced = (input: string): string => {
    return sanitizeHtmlAdvanced(input.trim());
  };

  return { 
    validateInputAdvanced, 
    sanitizeInputAdvanced,
    detectSqlInjection,
    detectXss
  };
};
