import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Lang = 'EN' | 'HE' | 'AR'

interface LangStore {
  lang: Lang
  setLang: (lang: Lang) => void
}

export const useLangStore = create<LangStore>()(
  persist(
    (set) => ({
      lang: 'EN',
      setLang: (lang) => {
        set({ lang })
        document.documentElement.setAttribute(
          'dir',
          lang === 'HE' || lang === 'AR' ? 'rtl' : 'ltr'
        )
        document.documentElement.setAttribute('lang', lang.toLowerCase())
      },
    }),
    { name: 'salary-lang' }
  )
)