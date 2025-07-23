
/**
 * Emotion detection utility for context-aware responses
 */

export type EmotionType = 
  | '🙏 Gratitude'
  | '🧐 Curiosity' 
  | '😮‍💨 Stress'
  | '🎨 Creativity'
  | '💼 Professional'
  | '😊 Friendly'
  | '🤔 Confused'
  | '⚡ Urgent'
  | '🙂 Neutral';

export interface EmotionContext {
  emotion: EmotionType;
  confidence: number;
  indicators: string[];
  intensity: 'low' | 'medium' | 'high';
}

export class EmotionDetector {
  private static emotionPatterns = {
    '🙏 Gratitude': {
      th: ['ขอบคุณ', 'ขอบใจ', 'สบายใจ', 'ดีใจ', 'ประทับใจ'],
      en: ['thank', 'grateful', 'appreciate', 'thanks', 'much appreciated']
    },
    '🧐 Curiosity': {
      th: ['ทำไม', 'อย่างไร', 'เป็นไงบ้าง', 'แปลกใจ', 'สงสัย', 'อยากรู้'],
      en: ['why', 'how', 'what', 'curious', 'wonder', 'confused', 'explain']
    },
    '😮‍💨 Stress': {
      th: ['เครียด', 'วุ่นวาย', 'รีบ', 'ปวดหัว', 'เหนื่อย', 'ยาก'],
      en: ['stress', 'overwhelmed', 'difficult', 'hard', 'struggle', 'tired', 'exhausted']
    },
    '🎨 Creativity': {
      th: ['สร้างสรรค์', 'ไอเดีย', 'แปลกใหม่', 'คิดออกแบบ', 'นวัตกรรม'],
      en: ['creative', 'design', 'innovative', 'brainstorm', 'idea', 'artistic', 'imagine']
    },
    '💼 Professional': {
      th: ['ธุรกิจ', 'ประชุม', 'รายงาน', 'การงาน', 'โปรเจ็กต์'],
      en: ['business', 'project', 'meeting', 'report', 'professional', 'work', 'corporate']
    },
    '😊 Friendly': {
      th: ['สวัสดี', 'หวัดดี', 'ยินดี', 'แชร์', 'เล่น'],
      en: ['hello', 'hi', 'nice', 'share', 'friendly', 'chat', 'fun']
    },
    '🤔 Confused': {
      th: ['งง', 'สับสน', 'ไม่เข้าใจ', 'ยาก', 'ซับซ้อน'],
      en: ['confused', 'unclear', 'complicated', 'don\'t understand', 'complex']
    },
    '⚡ Urgent': {
      th: ['ด่วน', 'รีบ', 'เร่งด่วน', 'ตอนนี้', 'เร็ว'],
      en: ['urgent', 'asap', 'quick', 'fast', 'immediately', 'now', 'hurry']
    }
  };

  static detect(text: string): EmotionContext {
    const lowerText = text.toLowerCase();
    const emotionScores: { [key in EmotionType]?: { score: number; indicators: string[] } } = {};

    // Calculate scores for each emotion
    Object.entries(this.emotionPatterns).forEach(([emotion, patterns]) => {
      const allPatterns = [...patterns.th, ...patterns.en];
      const foundIndicators: string[] = [];
      let score = 0;

      allPatterns.forEach(pattern => {
        if (lowerText.includes(pattern.toLowerCase())) {
          foundIndicators.push(pattern);
          score += 1;
        }
      });

      if (score > 0) {
        emotionScores[emotion as EmotionType] = {
          score,
          indicators: foundIndicators
        };
      }
    });

    // Find the emotion with the highest score
    const bestMatch = Object.entries(emotionScores).reduce(
      (best, [emotion, data]) => {
        if (data.score > best.score) {
          return { emotion: emotion as EmotionType, ...data };
        }
        return best;
      },
      { emotion: '🙂 Neutral' as EmotionType, score: 0, indicators: [] }
    );

    const confidence = Math.min(0.95, bestMatch.score * 0.3);
    const intensity = bestMatch.score >= 3 ? 'high' : bestMatch.score >= 2 ? 'medium' : 'low';

    return {
      emotion: bestMatch.emotion,
      confidence,
      indicators: bestMatch.indicators,
      intensity
    };
  }

  static getContextualPrompt(emotion: EmotionType, intensity: 'low' | 'medium' | 'high'): string {
    const intensityModifier = intensity === 'high' ? 'very' : intensity === 'medium' ? 'somewhat' : 'slightly';

    switch (emotion) {
      case '🙏 Gratitude':
        return `The user is expressing gratitude. Respond warmly and continue to be helpful.`;
      case '🧐 Curiosity':
        return `The user is ${intensityModifier} curious. Provide detailed explanations and encourage further questions.`;
      case '😮‍💨 Stress':
        return `The user seems ${intensityModifier} stressed. Be supportive, offer step-by-step solutions, and maintain a calm tone.`;
      case '🎨 Creativity':
        return `The user is in creative mode. Be inspiring, suggest innovative ideas, and encourage exploration.`;
      case '💼 Professional':
        return `The user is in professional context. Be concise, factual, and business-appropriate.`;
      case '😊 Friendly':
        return `The user is being friendly. Match their warm tone and be conversational.`;
      case '🤔 Confused':
        return `The user is ${intensityModifier} confused. Break down complex concepts, use simple language, and provide examples.`;
      case '⚡ Urgent':
        return `The user has an urgent need. Provide quick, actionable solutions and prioritize immediate help.`;
      default:
        return `Maintain a helpful and professional tone.`;
    }
  }
}
