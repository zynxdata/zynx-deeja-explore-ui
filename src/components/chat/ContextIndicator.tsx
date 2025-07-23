
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { SupportedLanguage } from './LanguageDetector';
import { EmotionType } from './EmotionDetector';

interface ContextIndicatorProps {
  language: SupportedLanguage;
  emotion: EmotionType;
  confidence: number;
  isVisible: boolean;
}

const ContextIndicator: React.FC<ContextIndicatorProps> = ({
  language,
  emotion,
  confidence,
  isVisible
}) => {
  if (!isVisible) return null;

  const getLanguageColor = (lang: SupportedLanguage) => {
    switch (lang) {
      case 'th': return 'bg-blue-100 text-blue-800';
      case 'en': return 'bg-green-100 text-green-800';
      case 'mixed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLanguageLabel = (lang: SupportedLanguage) => {
    switch (lang) {
      case 'th': return 'ไทย';
      case 'en': return 'English';
      case 'mixed': return 'Thai-Eng';
      default: return 'Unknown';
    }
  };

  const confidenceColor = confidence > 0.7 ? 'text-green-600' : 
                          confidence > 0.4 ? 'text-yellow-600' : 'text-red-600';

  return (
    <Card className="mb-4 border-l-4 border-l-primary">
      <CardContent className="p-3">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Context:</span>
          <Badge className={getLanguageColor(language)} variant="secondary">
            {getLanguageLabel(language)}
          </Badge>
          <Badge variant="outline" className="bg-white">
            {emotion}
          </Badge>
          <span className={`text-xs ${confidenceColor}`}>
            {Math.round(confidence * 100)}% confidence
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContextIndicator;
