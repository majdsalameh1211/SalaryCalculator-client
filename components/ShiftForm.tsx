'use client';
import React, { useState, useEffect } from 'react';
import { Shift, ShiftFormData, ShiftType } from '@/types';
import { useI18n } from '@/lib/i18n';
import { useSettings } from '@/lib/settingsContext';
import { calcHours, calcShift, fmt, fmtHours } from '@/lib/calc';

interface Props {
  editingShift?: Shift | null;
  onSave: (data: object) => void;
  onCancel: () => void;
}

const today = () => new Date().toISOString().split('T')[0];

export default function ShiftForm({ editingShift, onSave, onCancel }: Props) {
  const { t } = useI18n();
  const { settings } = useSettings();

  const emptyForm = (): ShiftFormData => ({
    date: today(), startTime: '08:00', endTime: '17:00',
    shiftType: 'regular', inputMode: 'hourly',
    enteredRate: '', dailySalary: '',
    fuel: settings.defaultFuel > 0 ? String(settings.defaultFuel) : '0',
    parking: settings.defaultParking > 0 ? String(settings.defaultParking) : '0',
  });

  const [form, setForm] = useState<ShiftFormData>(emptyForm());

  useEffect(() => {
    if (editingShift) {
      setForm({
        date: editingShift.date.split('T')[0],
        startTime: editingShift.startTime,
        endTime: editingShift.endTime,
        shiftType: editingShift.shiftType,
        inputMode: editingShift.inputMode,
        enteredRate: editingShift.enteredRate != null ? String(editingShift.enteredRate) : '',
        dailySalary: editingShift.dailySalary != null ? String(editingShift.dailySalary) : '',
        fuel: String(editingShift.fuel),
        parking: String(editingShift.parking),
      });
    } else {
      setForm(emptyForm());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingShift]);

  const set = (field: keyof ShiftFormData, value: string) =>
    setForm(f => ({ ...f, [field]: value }));

  const setType = (t: ShiftType) => setForm(f => ({ ...f, shiftType: t }));

  const { hours, isOvernight } = calcHours(form.startTime, form.endTime);
  const fuel = parseFloat(form.fuel) || 0;
  const parking = parseFloat(form.parking) || 0;
  const enteredRate = parseFloat(form.enteredRate) || 0;
  const dailySalary = parseFloat(form.dailySalary) || 0;
  const isTraining = form.shiftType === 'training';

  const preview = calcShift(
    hours, form.shiftType, form.inputMode,
    enteredRate, dailySalary, fuel, parking,
    settings.minWage, settings.bonusPerHour, settings.defaultTrainingRate
  );

  const handleSubmit = () => {
    onSave({
      date: form.date, startTime: form.startTime, endTime: form.endTime,
      isOvernight, hours, shiftType: form.shiftType,
      inputMode: isTraining ? 'hourly' : form.inputMode,
      enteredRate: enteredRate || undefined,
      dailySalary: form.inputMode === 'daily' && !isTraining ? dailySalary : undefined,
      fuel, parking,
    });
  };

  return (
    <div className={`form-card${isTraining ? ' form-card-training' : ''}`}>
      {/* Type toggle */}
      <div className="form-toggle-row">
        <div className="form-title">
          {isTraining ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
            </svg>
          )}
          {editingShift ? t('form.editTitle') : t('form.addTitle')}
        </div>
        <div className="shift-type-toggle">
          <span className={`stt-label${!isTraining ? ' stt-active' : ' stt-dim'}`}>{t('form.regular')}</span>
          <div className={`stt-track${isTraining ? ' stt-on' : ''}`}
            onClick={() => setType(isTraining ? 'regular' : 'training')}
            role="switch" aria-checked={isTraining}>
            <div className="stt-thumb" />
          </div>
          <span className={`stt-label${isTraining ? ' stt-active-blue' : ' stt-dim'}`}>{t('form.training')}</span>
        </div>
      </div>

      {isTraining && (
        <div className="training-notice">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {t('form.trainingNotice')}
        </div>
      )}

      <div className="form-grid">
        <div className="f-field">
          <label className="f-label">{t('form.date')}</label>
          <input className="f-input" type="date" value={form.date} onChange={e => set('date', e.target.value)} />
        </div>
        <div className="f-field">
          <label className="f-label">{t('form.startTime')}</label>
          <input className="f-input" type="time" value={form.startTime} onChange={e => set('startTime', e.target.value)} />
        </div>
        <div className="f-field">
          <label className="f-label">{t('form.endTime')}</label>
          <input className="f-input" type="time" value={form.endTime} onChange={e => set('endTime', e.target.value)} />
        </div>
        <div className="f-field">
          <label className="f-label">{t('form.hoursAuto')}</label>
          <input className="f-input f-readonly" readOnly value={`${fmtHours(hours)}${isOvernight ? ' 🌙' : ''}`} />
        </div>
      </div>

      {isOvernight && <div className="overnight-notice">🌙 {t('form.overnight')}</div>}

      <div className="form-grid">
        {!isTraining && (
          <div className="f-field">
            <label className="f-label">{t('form.inputMode')}</label>
            <div className="mode-toggle">
              <button className={`mode-btn${form.inputMode === 'hourly' ? ' active' : ''}`} onClick={() => set('inputMode', 'hourly')}>{t('form.hourly')}</button>
              <button className={`mode-btn${form.inputMode === 'daily' ? ' active' : ''}`} onClick={() => set('inputMode', 'daily')}>{t('form.daily')}</button>
            </div>
          </div>
        )}
        <div className="f-field">
          <label className="f-label">{isTraining ? t('form.trainingRate') : (form.inputMode === 'hourly' ? t('form.hourlyRate') : t('form.dailySalary'))}</label>
          <input className={`f-input${isTraining ? ' f-input-blue' : ''}`} type="number" min="0" step="0.5"
            placeholder={`${t('form.minHint')}: ₪${isTraining ? settings.defaultTrainingRate : settings.minWage}`}
            value={isTraining ? form.enteredRate : (form.inputMode === 'hourly' ? form.enteredRate : form.dailySalary)}
            onChange={e => set(isTraining ? 'enteredRate' : (form.inputMode === 'hourly' ? 'enteredRate' : 'dailySalary'), e.target.value)} />
        </div>
        <div className="f-field">
          <label className="f-label">{t('form.fuel')}</label>
          <input className="f-input" type="number" min="0" value={form.fuel} onChange={e => set('fuel', e.target.value)} />
        </div>
        <div className="f-field">
          <label className="f-label">{t('form.parking')}</label>
          <input className="f-input" type="number" min="0" value={form.parking} onChange={e => set('parking', e.target.value)} />
        </div>
      </div>

      <div className={`calc-preview${isTraining ? ' calc-preview-training' : ''}`}>
        {!isTraining && <>
          <div className="cp-item"><div className="cp-lbl">{t('form.cash')}</div><div className="cp-val">{fmt(preview.cash)}</div></div>
          <div className="cp-item"><div className="cp-lbl">{t('form.transfer')}</div><div className="cp-val">{fmt(preview.monthTransfer)}</div></div>
        </>}
        <div className="cp-item"><div className="cp-lbl">{t('form.bonus')}</div><div className="cp-val">{fmt(preview.bonus)}</div></div>
        <div className="cp-item"><div className="cp-lbl">{t('form.salary')}</div><div className="cp-val">{fmt(preview.salary)}</div></div>
        <div className="cp-item cp-net">
          <div className="cp-lbl">{t('form.netSalary')}</div>
          <div className="cp-val cp-green">{fmt(preview.netSalary)}</div>
        </div>
      </div>

      <div className="form-actions">
        <button className="btn-sec" onClick={onCancel}>{t('form.cancel')}</button>
        <button className={`btn-pri${isTraining ? ' btn-pri-blue' : ''}`} onClick={handleSubmit}>
          {editingShift ? t('form.update') : (isTraining ? t('form.saveTraining') : t('form.save'))}
        </button>
      </div>
    </div>
  );
}
