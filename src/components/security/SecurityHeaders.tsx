
import { useEffect } from 'react';

// Component to set security-related meta tags and headers
const SecurityHeaders = () => {
  useEffect(() => {
    // Content Security Policy (CSP) - basic implementation
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = `
      default-src 'self'; 
      script-src 'self' 'unsafe-inline' 'unsafe-eval' https://api.openai.com https://*.supabase.co; 
      style-src 'self' 'unsafe-inline'; 
      img-src 'self' data: https: blob:; 
      connect-src 'self' https://api.openai.com https://*.supabase.co wss://*.supabase.co; 
      font-src 'self' data:; 
      object-src 'none'; 
      media-src 'self'; 
      frame-src 'none';
    `.replace(/\s+/g, ' ').trim();
    
    document.head.appendChild(meta);

    // X-Content-Type-Options
    const contentType = document.createElement('meta');
    contentType.httpEquiv = 'X-Content-Type-Options';
    contentType.content = 'nosniff';
    document.head.appendChild(contentType);

    // X-Frame-Options
    const frameOptions = document.createElement('meta');
    frameOptions.httpEquiv = 'X-Frame-Options';
    frameOptions.content = 'DENY';
    document.head.appendChild(frameOptions);

    // X-XSS-Protection
    const xssProtection = document.createElement('meta');
    xssProtection.httpEquiv = 'X-XSS-Protection';
    xssProtection.content = '1; mode=block';
    document.head.appendChild(xssProtection);

    // Referrer Policy
    const referrerPolicy = document.createElement('meta');
    referrerPolicy.name = 'referrer';
    referrerPolicy.content = 'strict-origin-when-cross-origin';
    document.head.appendChild(referrerPolicy);

    // Cleanup function
    return () => {
      [meta, contentType, frameOptions, xssProtection, referrerPolicy].forEach(element => {
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
      });
    };
  }, []);

  return null; // This component doesn't render anything visible
};

export default SecurityHeaders;
