'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n';
import { useSettings } from '@/lib/settingsContext';
import { updateSettings } from '@/lib/api';

export default function SettingsPanel() {
  const { t } = useI18n();
  const { settings, setSettings } = useSettings();

  const [form, setForm] = useState(settings);
  const [saved, setSaved] = useState(false);

  useEffect(() => { setForm(settings); }, [settings]);

  const set = (field: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [field]: parseFloat(value) || 0 }));

  const handleSave = async () => {
    try {
      const updated = await updateSettings(form);
      setSettings(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="form-card settings-panel">
      <div className="form-title">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
        {t('settings.title')}
      </div>

      <div className="settings-grid">
        <div className="s-field">
          <label className="s-label">
            <span className="dot dot-red" style={{ display: 'inline-block', marginInlineEnd: '6px' }} />
            {t('settings.minWage')}
          </label>
          <input className="f-input" type="number" min="0" step="0.1"
            value={form.minWage}
            onChange={(e) => set('minWage', e.target.value)} />
          <div className="s-hint">{t('settings.minWageHint')}</div>
        </div>

        <div className="s-field">
          <label className="s-label">
            <span className="dot dot-yellow" style={{ display: 'inline-block', marginInlineEnd: '4px' }} />
            <span className="dot dot-green" style={{ display: 'inline-block', marginInlineEnd: '6px' }} />
            {t('settings.hoursThreshold')}
          </label>
          <input className="f-input" type="number" min="0" step="1"
            value={form.hoursThreshold}
            onChange={(e) => set('hoursThreshold', e.target.value)} />
          <div className="s-hint">{t('settings.hoursThresholdHint')}</div>
        </div>

        <div className="s-field">
          <label className="s-label">{t('settings.bonusPerHour')}</label>
          <input className="f-input" type="number" min="0" step="1"
            value={form.bonusPerHour}
            onChange={(e) => set('bonusPerHour', e.target.value)} />
          <div className="s-hint">{t('settings.bonusHint')}</div>
        </div>

        <div className="s-field">
          <label className="s-label">{t('settings.defaultFuel')}</label>
          <input className="f-input" type="number" min="0" step="1"
            value={form.defaultFuel}
            onChange={(e) => set('defaultFuel', e.target.value)} />
          <div className="s-hint">{t('settings.defaultFuelHint')}</div>
        </div>
      </div>

      <div className="form-actions">
        <button className="btn-pri" onClick={handleSave}>
          {saved ? `✓ ${t('settings.saved')}` : t('settings.save')}
        </button>
      </div>
    </div>
  );
}
