
/**
 * Language detection utility for Thai-English context routing
 */

export type SupportedLanguage = 'th' | 'en' | 'mixed' | 'unknown';

export interface LanguageContext {
  detected: SupportedLanguage;
  confidence: number;
  characteristics: {
    hasThaiScript: boolean;
    hasEnglishText: boolean;
    thaiWordCount: number;
    englishWordCount: number;
  };
}

export class LanguageDetector {
  private static thaiScriptRegex = /[\u0E00-\u0E7F]/;
  private static englishWordRegex = /\b[A-Za-z]+\b/g;
  private static thaiWordRegex = /[\u0E00-\u0E7F]+/g;

  static detect(text: string): LanguageContext {
    const hasThaiScript = this.thaiScriptRegex.test(text);
    const englishMatches = text.match(this.englishWordRegex) || [];
    const thaiMatches = text.match(this.thaiWordRegex) || [];
    
    const englishWordCount = englishMatches.length;
    const thaiWordCount = thaiMatches.length;
    const totalWords = englishWordCount + thaiWordCount;

    let detected: SupportedLanguage = 'unknown';
    let confidence = 0;

    if (totalWords === 0) {
      detected = 'unknown';
      confidence = 0;
    } else if (hasThaiScript && englishWordCount > 0) {
      detected = 'mixed';
      confidence = 0.9;
    } else if (thaiWordCount > englishWordCount) {
      detected = 'th';
      confidence = Math.min(0.95, thaiWordCount / totalWords);
    } else if (englishWordCount > 0) {
      detected = 'en';
      confidence = Math.min(0.95, englishWordCount / totalWords);
    }

    return {
      detected,
      confidence,
      characteristics: {
        hasThaiScript,
        hasEnglishText: englishWordCount > 0,
        thaiWordCount,
        englishWordCount
      }
    };
  }

  static getSystemPrompt(language: SupportedLanguage): string {
    const basePrompt = "You are Deeja, a helpful AI assistant that specializes in Thai culture and AGI technology.";
    
    switch (language) {
      case 'th':
        return `${basePrompt} Always respond in Thai language. Be polite and use appropriate Thai honorifics. เป็นผู้ช่วยที่เข้าใจวัฒนธรรมไทยและใช้ภาษาไทยที่สุภาพเหมาะสม`;
      case 'en':
        return `${basePrompt} Always respond in English. Be helpful, direct, and professional while maintaining friendliness.`;
      case 'mixed':
        return `${basePrompt} The user is using mixed Thai-English. Mirror their language mixing style in your response. Use Thai for cultural concepts and English for technical terms when appropriate.`;
      default:
        return `${basePrompt} Detect the user's preferred language and respond accordingly. Default to English if unclear.`;
    }
  }
}
