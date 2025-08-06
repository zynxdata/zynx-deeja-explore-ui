import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'th';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface Translations {
  [key: string]: {
    en: string;
    th: string;
  };
}

const translations: Translations = {
  // Hero Section
  'hero.partnership': {
    en: 'Zynx & Deeja Partnership',
    th: 'ความร่วมมือ Zynx & Deeja'
  },
  'hero.tagline': {
    en: 'AGI-First Context-as-a-Service',
    th: 'บริการบริบท AGI อันดับหนึ่ง'
  },
  'hero.subtitle': {
    en: 'We build AI that understands what it means to be human',
    th: 'เราสร้าง AI ที่เข้าใจความเป็นมนุษย์'
  },
  'hero.description': {
    en: 'Ship context-aware AI features 10x faster with our modular AGI framework. From emotional intelligence to cultural adaptation, Zynx & Deeja bring warmth and empathy to artificial intelligence.',
    th: 'ส่งมอบฟีเจอร์ AI ที่เข้าใจบริบทเร็วขึ้น 10 เท่าด้วยเฟรมเวิร์ก AGI แบบโมดูลาร์ของเรา จากความฉลาดทางอารมณ์ไปจนถึงการปรับตัวทางวัฒนธรรม Zynx & Deeja นำความอบอุ่นและความเห็นอกเห็นใจมาสู่ปัญญาประดิษฐ์'
  },
  'hero.cta.try': {
    en: 'Try Now - Start Free',
    th: 'ทดลองใช้ทันที - ฟรี'
  },
  'hero.cta.meet': {
    en: 'Meet Deeja AI',
    th: 'พบกับ Deeja AI'
  },
  'hero.disclaimer': {
    en: '✨ No credit card required • 5-minute setup • Thai-English bilingual',
    th: '✨ ไม่ต้องใช้บัตรเครดิต • ติดตั้ง 5 นาที • รองรับไทย-อังกฤษ'
  },
  // Value Props
  'value.context.title': {
    en: 'Context-as-a-Service',
    th: 'บริการบริบทเชิงลึก'
  },
  'value.context.desc': {
    en: 'API-first contextual intelligence',
    th: 'ปัญญาบริบทแบบ API-first'
  },
  'value.emotion.title': {
    en: 'Emotional Intelligence',
    th: 'ความฉลาดทางอารมณ์'
  },
  'value.emotion.desc': {
    en: 'AI that understands feelings & culture',
    th: 'AI ที่เข้าใจความรู้สึกและวัฒนธรรม'
  },
  'value.learning.title': {
    en: 'Self-Learning',
    th: 'การเรียนรู้ด้วยตัวเอง'
  },
  'value.learning.desc': {
    en: 'Improves from every interaction',
    th: 'พัฒนาจากการโต้ตอบทุกครั้ง'
  },
  // Value Banner
  'banner.title': {
    en: 'The Future of Human-AI Collaboration',
    th: 'อนาคตของการทำงานร่วมกันระหว่างมนุษย์และ AI'
  },
  // MVP Workspaces
  'workspace.title': {
    en: '5 MVP Workspaces',
    th: '5 พื้นที่ทำงาน MVP'
  },
  'workspace.subtitle': {
    en: 'Five powerful AI workspaces designed for the modern bilingual workflow',
    th: 'ห้าพื้นที่ทำงาน AI ที่ทรงพลังสำหรับเวิร์กโฟลว์สองภาษาสมัยใหม่'
  },
  'workspace.chat': {
    en: 'Chat',
    th: 'แชท'
  },
  'workspace.translate': {
    en: 'Translate',
    th: 'แปลเอกสาร'
  },
  'workspace.sheet': {
    en: 'Sheet',
    th: 'สเปรดชีต'
  },
  'workspace.slides': {
    en: 'Slides',
    th: 'สไลด์'
  },
  'workspace.pdf': {
    en: 'PDF',
    th: 'PDF'
  },
  // Features
  'features.title': {
    en: 'Production-Ready AI Components',
    th: 'คอมโพเนนต์ AI พร้อมใช้งานจริง'
  },
  'features.subtitle': {
    en: 'Pre-built, battle-tested components for translation, document processing, spreadsheet intelligence, and presentation automation. Deploy in minutes, not months.',
    th: 'คอมโพเนนต์ที่สร้างไว้แล้วและผ่านการทดสอบแล้วสำหรับการแปล การประมวลผลเอกสาร ปัญญาสเปรดชีต และระบบนำเสนออัตโนมัติ ปรับใช้ได้ในไม่กี่นาที ไม่ใช่หลายเดือน'
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    // Get language from localStorage or browser preference
    const saved = localStorage.getItem('zynx-language') as Language;
    const browserLang = navigator.language.startsWith('th') ? 'th' : 'en';
    setLanguage(saved || browserLang);
  }, []);

  useEffect(() => {
    localStorage.setItem('zynx-language', language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};