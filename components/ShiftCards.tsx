'use client';
import React from 'react';
import { Shift } from '@/types';
import { useI18n } from '@/lib/i18n';
import { getShiftIndicator, fmt, fmtHours } from '@/lib/calc';
import { useSettings } from '@/lib/settingsContext';

interface Props {
  shifts: Shift[];
  onEdit: (s: Shift) => void;
  onDelete: (id: string) => void;
}

export default function ShiftCards({ shifts, onEdit, onDelete }: Props) {
  const { t } = useI18n();
  const { settings } = useSettings();

  const regular = shifts.filter(s => s.shiftType !== 'training');
  const training = shifts.filter(s => s.shiftType === 'training');

  const renderCard = (s: Shift) => {
    const ind = getShiftIndicator(s.shiftType, s.hourlyRate, s.hours, settings.minWage, settings.hoursThreshold, s.enteredRate);
    const isRed = ind === 'red';
    const isBlue = ind === 'blue';
    const dateStr = new Date(s.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });

    return (
      <div key={s._id} className={`shift-card${isRed ? ' card-red' : isBlue ? ' card-blue' : ''}`}>
        <div className="card-top">
          <div className="card-date">
            <span className={`dot dot-${ind}`} />
            {dateStr}
            {s.isOvernight && <span className="badge badge-night">{t('shifts.night')}</span>}
            {s.inputMode === 'daily' && s.shiftType !== 'training' && <span className="badge badge-daily">{t('shifts.daily')}</span>}
          </div>
          <span className="card-time">{s.startTime} → {s.endTime}</span>
        </div>
        {isRed && (
          <div className="rate-warning">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            {t('shifts.rateWarn')}
          </div>
        )}
        <div className="card-chips">
          <span className="chip">{fmtHours(s.hours)}</span>
          <span className={`chip${isRed ? ' chip-red' : isBlue ? ' chip-blue' : ''}`}>{fmt(s.hourlyRate)}/h</span>
          {s.fuel > 0 && <span className="chip">{t('shifts.fuelCol')} {fmt(s.fuel)}</span>}
          {s.parking > 0 && <span className="chip">{t('shifts.parkCol')} {fmt(s.parking)}</span>}
        </div>
        <div className="card-bottom">
          <span className="card-net">{fmt(s.netSalary)} {t('shifts.net')}</span>
          <div className="action-icons">
            <button className="icon-btn" onClick={() => onEdit(s)} aria-label="Edit">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            <button className="icon-btn danger" onClick={() => onDelete(s._id)} aria-label="Delete">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
                <path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (shifts.length === 0) return <p className="no-shifts">{t('shifts.noShifts')}</p>;

  return (
    <div className="shift-cards-wrap">
      {regular.length > 0 && (
        <>
          <div className="cards-section-hdr">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
            </svg>
            {t('shifts.regularSection')}
          </div>
          {regular.map(renderCard)}
        </>
      )}
      {training.length > 0 && (
        <>
          <div className="cards-section-hdr cards-section-training">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
            {t('shifts.trainingSection')}
          </div>
          {training.map(renderCard)}
        </>
      )}
    </div>
  );
}
