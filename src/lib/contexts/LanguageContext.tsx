import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'hi' | 'es' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.courses': 'Courses',
    'nav.liveClasses': 'Live Classes',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.enrollNow': 'Enroll Now',
    'nav.dashboard': 'Go to Dashboard',

    // Hero Section
    'hero.tagline': 'Fun Business Learning for Ages 6-16',
    'hero.title1': 'Your First Step',
    'hero.title2': 'Into Business',
    'hero.description': 'Start your exciting journey into entrepreneurship with fun projects, real money management, and creative business ideas designed especially for young minds!',
    'hero.startLearning': 'Start Learning',
    'hero.watchDemo': 'Watch Demo',

    // Features
    'features.moneyManagement': 'Learn Money Management',
    'features.startBusiness': 'Start Mini Businesses',
    'features.trackGrowth': 'Track Your Growth',

    // Dashboard
    'dashboard.overview': 'Overview',
    'dashboard.journey': 'Learning Journey',
    'dashboard.courses': 'My Courses',
    'dashboard.businessLab': 'Business Lab',
    'dashboard.community': 'Community',
    'dashboard.achievements': 'Achievements',
    'dashboard.analytics': 'Analytics',
    'dashboard.messages': 'Messages',

    // Language Names
    'language.english': 'English',
    'language.hindi': 'हिंदी',
    'language.spanish': 'Español',
    'language.arabic': 'العربية'
  },
  hi: {
    // Navigation
    'nav.home': 'होम',
    'nav.courses': 'पाठ्यक्रम',
    'nav.liveClasses': 'लाइव क्लासेस',
    'nav.about': 'हमारे बारे में',
    'nav.contact': 'संपर्क करें',
    'nav.enrollNow': 'अभी एनरोल करें',
    'nav.dashboard': 'डैशबोर्ड पर जाएं',

    // Hero Section
    'hero.tagline': '6-16 वर्ष के बच्चों के लिए मजेदार बिजनेस लर्निंग',
    'hero.title1': 'आपका पहला कदम',
    'hero.title2': 'बिजनेस की दुनिया में',
    'hero.description': 'मजेदार प्रोजेक्ट्स, पैसों का प्रबंधन और क्रिएटिव बिजनेस आइडियाज के साथ अपनी उद्यमिता यात्रा शुरू करें!',
    'hero.startLearning': 'लर्निंग शुरू करें',
    'hero.watchDemo': 'डेमो देखें',

    // Features
    'features.moneyManagement': 'पैसों का प्रबंधन सीखें',
    'features.startBusiness': 'मिनी बिजनेस शुरू करें',
    'features.trackGrowth': 'अपनी प्रगति ट्रैक करें',

    // Dashboard
    'dashboard.overview': 'ओवरव्यू',
    'dashboard.journey': 'लर्निंग जर्नी',
    'dashboard.courses': 'मेरे कोर्स',
    'dashboard.businessLab': 'बिजनेस लैब',
    'dashboard.community': 'कम्युनिटी',
    'dashboard.achievements': 'अचीवमेंट्स',
    'dashboard.analytics': 'एनालिटिक्स',
    'dashboard.messages': 'मैसेज',

    // Language Names
    'language.english': 'English',
    'language.hindi': 'हिंदी',
    'language.spanish': 'Español',
    'language.arabic': 'العربية'
  },
  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.courses': 'Cursos',
    'nav.liveClasses': 'Clases en Vivo',
    'nav.about': 'Nosotros',
    'nav.contact': 'Contacto',
    'nav.enrollNow': 'Inscríbete Ahora',
    'nav.dashboard': 'Ir al Panel',

    // Hero Section
    'hero.tagline': 'Aprendizaje Empresarial Divertido para Edades 6-16',
    'hero.title1': 'Tu Primer Paso',
    'hero.title2': 'Hacia los Negocios',
    'hero.description': '¡Comienza tu emocionante viaje empresarial con proyectos divertidos, gestión de dinero real e ideas creativas de negocios diseñadas especialmente para mentes jóvenes!',
    'hero.startLearning': 'Empezar a Aprender',
    'hero.watchDemo': 'Ver Demo',

    // Features
    'features.moneyManagement': 'Aprende Gestión Financiera',
    'features.startBusiness': 'Inicia Mini Negocios',
    'features.trackGrowth': 'Sigue tu Crecimiento',

    // Dashboard
    'dashboard.overview': 'Resumen',
    'dashboard.journey': 'Ruta de Aprendizaje',
    'dashboard.courses': 'Mis Cursos',
    'dashboard.businessLab': 'Laboratorio de Negocios',
    'dashboard.community': 'Comunidad',
    'dashboard.achievements': 'Logros',
    'dashboard.analytics': 'Análisis',
    'dashboard.messages': 'Mensajes',

    // Language Names
    'language.english': 'English',
    'language.hindi': 'हिंदी',
    'language.spanish': 'Español',
    'language.arabic': 'العربية'
  },
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.courses': 'الدورات',
    'nav.liveClasses': 'الفصول المباشرة',
    'nav.about': 'عن الشركة',
    'nav.contact': 'اتصل بنا',
    'nav.enrollNow': 'سجل الآن',
    'nav.dashboard': 'لوحة التحكم',

    // Hero Section
    'hero.tagline': 'تعلم الأعمال الممتع للأعمار 6-16',
    'hero.title1': 'خطوتك الأولى',
    'hero.title2': 'نحو عالم الأعمال',
    'hero.description': 'ابدأ رحلتك المثيرة في ريادة الأعمال مع مشاريع ممتعة، وإدارة مالية حقيقية، وأفكار تجارية إبداعية مصممة خصيصًا للعقول الشابة!',
    'hero.startLearning': 'ابدأ التعلم',
    'hero.watchDemo': 'شاهد العرض',

    // Features
    'features.moneyManagement': 'تعلم إدارة المال',
    'features.startBusiness': 'ابدأ مشاريع صغيرة',
    'features.trackGrowth': 'تتبع نموك',

    // Dashboard
    'dashboard.overview': 'نظرة عامة',
    'dashboard.journey': 'رحلة التعلم',
    'dashboard.courses': 'دوراتي',
    'dashboard.businessLab': 'معمل الأعمال',
    'dashboard.community': 'المجتمع',
    'dashboard.achievements': 'الإنجازات',
    'dashboard.analytics': 'التحليلات',
    'dashboard.messages': 'الرسائل',

    // Language Names
    'language.english': 'English',
    'language.hindi': 'हिंदी',
    'language.spanish': 'Español',
    'language.arabic': 'العربية'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <div dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}