'use client';
import React from 'react';
import { Shift, ShiftSummary } from '@/types';
import { useI18n } from '@/lib/i18n';
import { getShiftIndicator, fmt, fmtHours } from '@/lib/calc';
import { useSettings } from '@/lib/settingsContext';

interface Props {
  shifts: Shift[];
  regularSummary: ShiftSummary;
  trainingSummary: ShiftSummary;
  onEdit: (s: Shift) => void;
  onDelete: (id: string) => void;
}

function Dot({ color }: { color: 'red'|'yellow'|'green'|'blue' }) {
  return <span className={`dot dot-${color}`} />;
}

function ActionBtns({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="action-icons">
      <button className="icon-btn" onClick={onEdit} aria-label="Edit">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
      </button>
      <button className="icon-btn danger" onClick={onDelete} aria-label="Delete">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
          <path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
        </svg>
      </button>
    </div>
  );
}

export default function ShiftsTable({ shifts, regularSummary, trainingSummary, onEdit, onDelete }: Props) {
  const { t } = useI18n();
  const { settings } = useSettings();

  const regular = shifts.filter(s => s.shiftType !== 'training');
  const training = shifts.filter(s => s.shiftType === 'training');

  const dateStr = (d: string) => new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' });

  const renderRegularRow = (s: Shift) => {
    const ind = getShiftIndicator(s.shiftType, s.hourlyRate, s.hours, settings.minWage, settings.hoursThreshold, s.enteredRate);
    const isRed = ind === 'red';
    return (
      <tr key={s._id} className={isRed ? 'row-red' : ''}>
        <td><div className="date-cell"><Dot color={ind} />{dateStr(s.date)}
          {s.isOvernight && <span className="badge badge-night">{t('shifts.night')}</span>}
          {s.inputMode === 'daily' && <span className="badge badge-daily">{t('shifts.daily')}</span>}
        </div></td>
        <td>{s.startTime}</td><td>{s.endTime}</td><td>{fmtHours(s.hours)}</td>
        <td className={isRed ? 'rate-cell' : ''}>{fmt(s.hourlyRate)}{isRed ? ' ⚠' : ''}</td>
        <td>{fmt(s.cash || 0)}</td><td>{fmt(s.bonus)}</td><td>{fmt(s.monthTransfer || 0)}</td>
        <td>{fmt(s.salary)}</td><td className="net-cell">{fmt(s.netSalary)}</td>
        <td>{fmt(s.fuel)}</td><td>{fmt(s.parking)}</td>
        <td><ActionBtns onEdit={() => onEdit(s)} onDelete={() => onDelete(s._id)} /></td>
      </tr>
    );
  };

  const renderTrainingRow = (s: Shift) => (
    <tr key={s._id} className="row-blue">
      <td><div className="date-cell"><Dot color="blue" />{dateStr(s.date)}
        {s.isOvernight && <span className="badge badge-night">{t('shifts.night')}</span>}
      </div></td>
      <td>{s.startTime}</td><td>{s.endTime}</td><td>{fmtHours(s.hours)}</td>
      <td className="training-rate-cell">{fmt(s.hourlyRate)}</td>
      <td>{fmt(s.bonus)}</td><td>{fmt(s.salary)}</td>
      <td className="net-cell">{fmt(s.netSalary)}</td>
      <td>{fmt(s.fuel)}</td><td>{fmt(s.parking)}</td>
      <td><ActionBtns onEdit={() => onEdit(s)} onDelete={() => onDelete(s._id)} /></td>
    </tr>
  );

  return (
    <div className="table-wrap">
      <div className="legend-row">
        <div className="legend-item"><Dot color="red" />{t('legend.belowMin')}</div>
        <div className="legend-item"><Dot color="yellow" />{t('legend.lowHours')}</div>
        <div className="legend-item"><Dot color="green" />{t('legend.goodHours')}</div>
        <div className="legend-item"><Dot color="blue" />{t('legend.training')}</div>
      </div>

      {/* Regular shifts */}
      <div className="tbl-section-hdr">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
        </svg>
        {t('shifts.regularSection')}
      </div>
      <div className="table-scroll">
        <table className="shifts-table">
          <thead><tr>
            <th>{t('shifts.date')}</th><th>{t('shifts.start')}</th><th>{t('shifts.end')}</th>
            <th>{t('shifts.hours')}</th><th>{t('shifts.rate')}</th><th>{t('shifts.cash')}</th>
            <th>{t('shifts.bonus')}</th><th>{t('shifts.transfer')}</th><th>{t('shifts.salary')}</th>
            <th>{t('shifts.net')}</th><th>{t('shifts.fuelCol')}</th><th>{t('shifts.parkCol')}</th><th></th>
          </tr></thead>
          <tbody>
            {regular.length === 0 && <tr><td colSpan={13} className="no-shifts">{t('shifts.noShifts')}</td></tr>}
            {regular.map(renderRegularRow)}
            {regular.length > 0 && (
              <tr className="total-row">
                <td colSpan={3}>{t('shifts.monthlyTotal')}</td>
                <td>{fmtHours(regularSummary.totalHours)}</td><td>—</td>
                <td>{fmt(regularSummary.totalCash)}</td><td>{fmt(regularSummary.totalBonus)}</td>
                <td>{fmt(regularSummary.totalMonthTransfer)}</td><td>{fmt(regularSummary.totalSalary)}</td>
                <td className="net-cell">{fmt(regularSummary.totalNetSalary)}</td>
                <td>{fmt(regularSummary.totalFuel)}</td><td>{fmt(regularSummary.totalParking)}</td><td></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Training shifts */}
      <div className="tbl-section-hdr tbl-section-training">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
        </svg>
        {t('shifts.trainingSection')}
      </div>
      <div className="table-scroll">
        <table className="shifts-table">
          <thead><tr>
            <th>{t('shifts.date')}</th><th>{t('shifts.start')}</th><th>{t('shifts.end')}</th>
            <th>{t('shifts.hours')}</th><th>{t('shifts.rate')}</th>
            <th>{t('shifts.bonus')}</th><th>{t('shifts.salary')}</th>
            <th>{t('shifts.net')}</th><th>{t('shifts.fuelCol')}</th><th>{t('shifts.parkCol')}</th><th></th>
          </tr></thead>
          <tbody>
            {training.length === 0 && <tr><td colSpan={11} className="no-shifts">{t('shifts.noShifts')}</td></tr>}
            {training.map(renderTrainingRow)}
            {training.length > 0 && (
              <tr className="total-row">
                <td colSpan={3}>{t('shifts.trainingTotal')}</td>
                <td>{fmtHours(trainingSummary.totalHours)}</td><td>—</td>
                <td>{fmt(trainingSummary.totalBonus)}</td><td>{fmt(trainingSummary.totalSalary)}</td>
                <td className="net-cell">{fmt(trainingSummary.totalNetSalary)}</td>
                <td>{fmt(trainingSummary.totalFuel)}</td><td>{fmt(trainingSummary.totalParking)}</td><td></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
