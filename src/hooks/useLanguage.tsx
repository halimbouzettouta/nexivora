import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

type Lang = 'en' | 'ar' | 'fr'

interface LanguageContextType {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: string) => string
  dir: 'ltr' | 'rtl'
}

const LanguageContext = createContext<LanguageContextType | null>(null)

import { en } from './translations/en'
import { ar } from './translations/ar'
import { fr } from './translations/fr'

const dictionaries: Record<Lang, Record<string, string>> = { en, ar, fr }

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = localStorage.getItem('nxv-lang')
    return (saved === 'ar' ? 'ar' : 'en') as Lang
  })

  const setLang = (l: Lang) => {
    setLangState(l)
    localStorage.setItem('nxv-lang', l)
    document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = l
  }

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
  }, [lang])

  const t = (key: string): string => {
    return dictionaries[lang][key] || dictionaries['en'][key] || key
  }

  const dir = lang === 'ar' ? 'rtl' : 'ltr'

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, dir }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
