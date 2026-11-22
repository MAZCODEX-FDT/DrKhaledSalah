import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type Lang = 'ar' | 'en'
export type L = { ar: string; en: string }

type Ctx = { lang: Lang; dir: 'rtl' | 'ltr'; setLang: (l: Lang) => void; toggle: () => void; t: (v: L) => string }
const I18nCtx = createContext<Ctx | null>(null)

const read = (): Lang => {
  try {
    const v = localStorage.getItem('ks-lang')
    if (v === 'en' || v === 'ar') return v
  } catch { /* storage unavailable */ }
  return 'ar'
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(read)
  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    try { localStorage.setItem('ks-lang', lang) } catch { /* ignore */ }
  }, [lang])
  const value = useMemo<Ctx>(() => ({
    lang,
    dir: lang === 'ar' ? 'rtl' : 'ltr',
    setLang,
    toggle: () => setLang(l => (l === 'ar' ? 'en' : 'ar')),
    t: (v: L) => v[lang],
  }), [lang])
  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>
}

export function useI18n() {
  const c = useContext(I18nCtx)
  if (!c) throw new Error('useI18n outside provider')
  return c
}
