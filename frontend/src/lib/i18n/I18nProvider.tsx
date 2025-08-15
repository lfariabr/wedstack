'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type Locale = 'en' | 'pt';
type Messages = Record<string, any>;

type I18nCtx = {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (path: string) => string;
};

const Ctx = createContext<I18nCtx | null>(null);

function get(obj: any, path: string, fallback = '') {
    return path.split('.').reduce((acc, key) => (acc && acc[key] != null ? acc[key] : undefined), obj) ?? fallback;
}

async function loadMessages(locale: Locale): Promise<Messages> {
    // load the jsons in /content
    const mod = await import(`../../app/content/${locale}.json`);
    return mod.default || {};
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>(() => {
        if (typeof window === 'undefined') return 'en';
        const saved = window.localStorage.getItem('locale');
        return (saved === 'en' || saved === 'pt') ? saved : 'en';
      });
      
      const [messages, setMessages] = useState<Messages>({});

      useEffect(() => {
        loadMessages(locale).then(setMessages);
      }, [locale]);

      const t = (path: string) => get(messages, path);

      const setLocale = (locale: Locale) => {
        setLocaleState(locale);
        window.localStorage.setItem('locale', locale);
      };

      const value = useMemo<I18nCtx>(() => ({
        locale,
        setLocale,
        t: (path: string) => get(messages, path, path) // fallback mostra a key
      }), [locale, messages]);
    
      return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
    }
    
    export function useI18n() {
      const ctx = useContext(Ctx);
      if (!ctx) throw new Error('useI18n must be used within I18nProvider');
      return ctx;
    }