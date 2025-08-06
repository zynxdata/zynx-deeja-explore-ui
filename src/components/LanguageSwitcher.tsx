import React from 'react';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'th' : 'en');
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-2 text-white/80 hover:text-white hover:bg-white/10 border border-white/20 hover:border-white/40 transition-all duration-300"
    >
      <Globe className="h-4 w-4" />
      <span className="font-medium">
        {language === 'en' ? 'TH' : 'EN'}
      </span>
      <span className="text-xs opacity-60">
        {language === 'en' ? 'ไทย' : 'Eng'}
      </span>
    </Button>
  );
};