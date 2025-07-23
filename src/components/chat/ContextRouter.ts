
/**
 * Context routing logic for Zynx Thai-English Chatbot
 */

import { LanguageDetector, SupportedLanguage, LanguageContext } from './LanguageDetector';
import { EmotionDetector, EmotionType, EmotionContext } from './EmotionDetector';

export interface ChatContext {
  language: LanguageContext;
  emotion: EmotionContext;
  timestamp: string;
  sessionId: string;
}

export interface RoutingDecision {
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
  context: ChatContext;
  responseStrategy: string;
}

export class ContextRouter {
  static analyze(text: string, sessionId: string = 'default'): ChatContext {
    const language = LanguageDetector.detect(text);
    const emotion = EmotionDetector.detect(text);
    
    return {
      language,
      emotion,
      timestamp: new Date().toISOString(),
      sessionId
    };
  }

  static route(context: ChatContext): RoutingDecision {
    const { language, emotion } = context;
    
    // Base system prompt from language detection
    let systemPrompt = LanguageDetector.getSystemPrompt(language.detected);
    
    // Add emotional context
    const emotionalPrompt = EmotionDetector.getContextualPrompt(emotion.emotion, emotion.intensity);
    systemPrompt += ` ${emotionalPrompt}`;

    // Adjust parameters based on context
    let temperature = 0.7;
    let maxTokens = 1000;
    let responseStrategy = 'standard';

    // Adjust based on emotion
    switch (emotion.emotion) {
      case '🧐 Curiosity':
        temperature = 0.6; // More focused for educational content
        maxTokens = 1500; // Allow longer explanations
        responseStrategy = 'educational';
        break;
      case '😮‍💨 Stress':
        temperature = 0.5; // More consistent, calming responses
        responseStrategy = 'supportive';
        break;
      case '🎨 Creativity':
        temperature = 0.8; // More creative responses
        responseStrategy = 'innovative';
        break;
      case '💼 Professional':
        temperature = 0.4; // More formal, precise
        responseStrategy = 'professional';
        break;
      case '⚡ Urgent':
        maxTokens = 800; // Shorter, more direct responses
        temperature = 0.5;
        responseStrategy = 'direct';
        break;
    }

    // Adjust based on language
    if (language.detected === 'mixed') {
      systemPrompt += ' Feel free to mix Thai and English naturally in your response.';
    }

    return {
      systemPrompt,
      temperature,
      maxTokens,
      context,
      responseStrategy
    };
  }

  static formatContextualResponse(decision: RoutingDecision, aiResponse: string): {
    response: string;
    metadata: {
      language: SupportedLanguage;
      emotion: EmotionType;
      strategy: string;
      confidence: number;
    };
  } {
    return {
      response: aiResponse,
      metadata: {
        language: decision.context.language.detected,
        emotion: decision.context.emotion.emotion,
        strategy: decision.responseStrategy,
        confidence: Math.min(
          decision.context.language.confidence, 
          decision.context.emotion.confidence
        )
      }
    };
  }
}
