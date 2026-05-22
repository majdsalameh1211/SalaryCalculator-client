'use client'

import { useEffect } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useLangStore } from '@/store/langStore'

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeStore()
  const { lang } = useLangStore()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    const isRtl = lang === 'HE' || lang === 'AR'
    document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr')
    document.documentElement.setAttribute('lang', lang.toLowerCase())
  }, [lang])

  return <>{children}</>
}
