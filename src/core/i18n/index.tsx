import React, { createContext, useContext, useState, useCallback } from 'react';
import { en, type TranslationKeys } from './en';
import { fr } from './fr';

type Language = 'en' | 'fr';
const translations: Record<Language, TranslationKeys> = { en, fr };

interface I18nContextType {
  lang: Language;
  t: TranslationKeys;
  setLanguage: (lang: Language) => void;
}

const LANG_KEY = 'fb_admin_lang';

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>(() => {
    const stored = localStorage.getItem(LANG_KEY);
    return (stored === 'fr' ? 'fr' : 'en');
  });

  const setLanguage = useCallback((l: Language) => {
    setLang(l);
    localStorage.setItem(LANG_KEY, l);
    document.documentElement.lang = l;
  }, []);

  return (
    <I18nContext.Provider value={{ lang, t: translations[lang], setLanguage }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
