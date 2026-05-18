'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useI18n } from '@/lib/i18n';
import { useTheme } from '@/lib/theme';
import { useSettings } from '@/lib/settingsContext';
import { updateSettings } from '@/lib/api';

export default function SettingsPage() {
  const { t, locale, setLocale } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const { settings, setSettings } = useSettings();
  const [form, setForm] = useState(settings);
  const [savedField, setSavedField] = useState<string | null>(null);
  const debounceRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  useEffect(() => { setForm(settings); }, [settings]);

  const handleChange = (field: keyof typeof form, value: string) => {
    const num = parseFloat(value);
    if (isNaN(num)) return;
    const updated = { ...form, [field]: num };
    setForm(updated);

    if (debounceRef.current[field]) clearTimeout(debounceRef.current[field]);
    debounceRef.current[field] = setTimeout(async () => {
      try {
        const saved = await updateSettings(updated);
        setSettings(saved);
        setSavedField(field);
        setTimeout(() => setSavedField(null), 2000);
      } catch (e) { console.error(e); }
    }, 600);
  };

  const inp = (field: keyof typeof form, label: string, hint: string, dotColor?: string) => (
    <div className="setting-row">
      <div className="setting-info">
        <div className="setting-lbl">
          {dotColor && <span className={`dot dot-${dotColor}`} style={{ marginInlineEnd: '6px' }} />}
          {label}
          {savedField === field && <span className="saved-badge">{t('settings.saved')}</span>}
        </div>
        <div className="setting-hint">{hint}</div>
      </div>
      <input
        className="setting-inp"
        type="number" min="0" step="0.1"
        value={form[field]}
        onChange={e => handleChange(field, e.target.value)}
      />
    </div>
  );

  return (
    <div className="settings-page">

      {/* Indicators */}
      <div className="settings-section">
        <div className="settings-section-hdr">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
            <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
          </svg>
          {t('settings.indicatorsSection')}
        </div>
        <div className="settings-body">
          {inp('minWage', t('settings.minWage'), t('settings.minWageHint'), 'red')}
          {inp('hoursThreshold', t('settings.hoursThreshold'), t('settings.hoursThresholdHint'), 'yellow')}
        </div>
      </div>

      {/* Calculations */}
      <div className="settings-section">
        <div className="settings-section-hdr">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/>
            <line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="12" y2="14"/>
          </svg>
          {t('settings.calcSection')}
        </div>
        <div className="settings-body">
          {inp('bonusPerHour', t('settings.bonusPerHour'), t('settings.bonusHint'))}
          {inp('defaultTrainingRate', t('settings.trainingRate'), t('settings.trainingRateHint'), 'blue')}
        </div>
      </div>

      {/* Form defaults */}
      <div className="settings-section">
        <div className="settings-section-hdr">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/>
          </svg>
          {t('settings.defaultsSection')}
        </div>
        <div className="settings-body">
          {inp('defaultFuel', t('settings.defaultFuel'), t('settings.defaultFuelHint'))}
          {inp('defaultParking', t('settings.defaultParking'), t('settings.defaultParkingHint'))}
        </div>
      </div>

      {/* Language & theme */}
      <div className="settings-section">
        <div className="settings-section-hdr">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
          {t('settings.langSection')}
        </div>
        <div className="settings-body">
          <div className="setting-row">
            <div className="setting-info">
              <div className="setting-lbl">{t('settings.language')}</div>
              <div className="setting-hint">{t('settings.languageHint')}</div>
            </div>
            <div className="lang-seg">
              {(['en','he','ar'] as const).map(l => (
                <button key={l} className={`lang-seg-btn${locale === l ? ' active' : ''}`} onClick={() => setLocale(l)}>
                  {l === 'en' ? '🇬🇧' : l === 'he' ? '🇮🇱' : '🇸🇦'} {t(`languages.${l}`)}
                </button>
              ))}
            </div>
          </div>
          <div className="setting-row">
            <div className="setting-info">
              <div className="setting-lbl">{t('settings.theme')}</div>
              <div className="setting-hint">{t('settings.themeHint')}</div>
            </div>
            <div className="lang-seg">
              <button className={`lang-seg-btn${theme === 'light' ? ' active' : ''}`} onClick={() => theme === 'dark' && toggleTheme()}>
                ☀️ {t('settings.light')}
              </button>
              <button className={`lang-seg-btn${theme === 'dark' ? ' active' : ''}`} onClick={() => theme === 'light' && toggleTheme()}>
                🌙 {t('settings.dark')}
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
