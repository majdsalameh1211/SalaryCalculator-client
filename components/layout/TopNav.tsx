'use client'

import { useState } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useLangStore, Lang } from '@/store/langStore'
import { useT } from '@/lib/i18n'

const LANGS: { code: Lang; label: string; flag: string }[] = [
  { code: 'EN', label: 'English', flag: '🇬🇧' },
  { code: 'HE', label: 'עברית', flag: '🇮🇱' },
  { code: 'AR', label: 'العربية', flag: '🇸🇦' },
]

export default function TopNav() {
  const { theme, toggle } = useThemeStore()
  const { lang, setLang } = useLangStore()
  const [dropOpen, setDropOpen] = useState(false)
  const t = useT()

  return (
    <header
      dir="ltr"
      style={{
        height: 52,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        background: 'var(--topbar-bg)',
        borderBottom: '0.5px solid var(--border-default)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        flexShrink: 0,
      }}
    >
      {/* Left: logo + title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="2" width="14" height="20" rx="2" />
          <line x1="9" y1="7" x2="15" y2="7" />
          <line x1="9" y1="11" x2="15" y2="11" />
          <line x1="9" y1="15" x2="13" y2="15" />
        </svg>
        <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-main)' }}>
          {t('appName')}
        </span>
      </div>

      {/* Right: theme + lang */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, position: 'relative' }}>
        {/* Theme toggle */}
        <button
          onClick={toggle}
          aria-label="toggle theme"
          style={{
            width: 30, height: 30,
            border: '0.5px solid var(--btn-border)',
            borderRadius: 10,
            background: 'var(--btn-bg)',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-secondary)',
            flexShrink: 0,
          }}
        >
          {theme === 'light' ? (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          )}
        </button>

        {/* Lang button */}
        <button
          onClick={() => setDropOpen((o) => !o)}
          aria-label="select language"
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '5px 9px',
            border: '0.5px solid var(--btn-border)',
            borderRadius: 10,
            background: 'var(--btn-bg)',
            cursor: 'pointer',
            fontFamily: 'var(--font-main)',
            fontSize: 11, fontWeight: 700,
            color: 'var(--btn-text)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
          <span>{lang}</span>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {/* Dropdown */}
        {dropOpen && (
          <>
            <div
              onClick={() => setDropOpen(false)}
              style={{ position: 'fixed', inset: 0, zIndex: 99 }}
            />
            <div style={{
              position: 'absolute', top: 38, right: 0,
              minWidth: 155,
              background: 'var(--bg-card)',
              borderRadius: 10,
              boxShadow: '0 6px 20px rgba(0,0,0,0.13)',
              zIndex: 200,
              overflow: 'hidden',
              border: '0.5px solid var(--border-default)',
            }}>
              {LANGS.map((l, i) => (
                <div
                  key={l.code}
                  onClick={() => { setLang(l.code); setDropOpen(false) }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 14px',
                    fontFamily: 'var(--font-main)', fontSize: 13,
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    borderTop: i > 0 ? '0.5px solid var(--border-default)' : undefined,
                    background: 'var(--bg-card)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-tertiary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--bg-card)')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>{l.flag}</span>
                    <span>{l.label}</span>
                  </div>
                  {lang === l.code && (
                    <span style={{ color: '#378add', fontWeight: 700, fontSize: 14 }}>✓</span>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </header>
  )
}