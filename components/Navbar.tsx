'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useI18n } from '@/lib/i18n';
import { useTheme } from '@/lib/theme';
import { Locale } from '@/types';

type Page = 'shifts' | 'statistics' | 'settings';

interface Props {
  page: Page;
  onNavigate: (p: Page) => void;
  statsMode?: 'all' | 'month';
  onStatsToggle?: () => void;
}

const LOCALES: { code: Locale; flag: string }[] = [
  { code: 'en', flag: '🇬🇧' },
  { code: 'he', flag: '🇮🇱' },
  { code: 'ar', flag: '🇸🇦' },
];

export default function Navbar({ page, onNavigate, statsMode, onStatsToggle }: Props) {
  const { locale, setLocale, t, dir } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const currentFlag = LOCALES.find(l => l.code === locale)?.flag ?? '🌐';

  return (
    <nav className="navbar">
      <div className="nav-logo">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="18" rx="2"/>
          <line x1="8" y1="9" x2="16" y2="9"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="12" y2="17"/>
        </svg>
        {t('app.title')}
      </div>

      <div className="nav-links">
        {(['shifts','statistics','settings'] as Page[]).map(p => (
          <button key={p} className={`nav-link${page === p ? ' active' : ''}`} onClick={() => onNavigate(p)}>
            {p === 'shifts' && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}
            {p === 'statistics' && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>}
            {p === 'settings' && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>}
            {t(`nav.${p}`)}
          </button>
        ))}
      </div>

      {/* Stats toggle — desktop only, shown on statistics page */}
      {page === 'statistics' && onStatsToggle && (
        <div className="stats-toggle-wrap">
          <span className={`toggle-label${statsMode === 'all' ? ' tl-active' : ' tl-dim'}`}>{t('nav.all')}</span>
          <div className={`toggle-track${statsMode === 'month' ? ' tt-on' : ''}`} onClick={onStatsToggle} role="switch" aria-checked={statsMode === 'month'}>
            <div className="toggle-thumb" />
          </div>
          <span className={`toggle-label${statsMode === 'month' ? ' tl-active' : ' tl-dim'}`}>{t('nav.month')}</span>
        </div>
      )}

      <div className="nav-right">
        {/* Globe lang dropdown */}
        <div className="lang-dropdown" ref={langRef}>
          <button className="lang-trigger" onClick={() => setLangOpen(o => !o)} aria-label="Language">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
            <span className="lang-code">{locale.toUpperCase()}</span>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: langOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          {langOpen && (
            <div className={`lang-menu${dir === 'rtl' ? ' lang-menu-rtl' : ''}`}>
              {LOCALES.map(l => (
                <button key={l.code} className={`lang-option${locale === l.code ? ' selected' : ''}`}
                  onClick={() => { setLocale(l.code); setLangOpen(false); }}>
                  <span className="lang-flag">{l.flag}</span>
                  <span className="lang-name">{t(`languages.${l.code}`)}</span>
                  {locale === l.code && (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#0F6E56' }}>
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme toggle */}
        <button className="theme-btn" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'light' ? (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          )}
        </button>
      </div>
    </nav>
  );
}
