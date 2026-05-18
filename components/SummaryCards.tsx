'use client';
import React from 'react';
import { useI18n } from '@/lib/i18n';
import { ShiftSummary } from '@/types';
import { fmt, fmtHours } from '@/lib/calc';

interface Props {
  summary: ShiftSummary;
}

export default function SummaryCards({ summary }: Props) {
  const { t } = useI18n();
  return (
    <div className="summary-grid">
      <div className="stat-card">
        <div className="stat-label">{t('summary.totalHours')}</div>
        <div className="stat-value">{fmtHours(summary.totalHours)}</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">{t('summary.fuel')}</div>
        <div className="stat-value amber">{fmt(summary.totalFuel)}</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">{t('summary.parking')}</div>
        <div className="stat-value amber">{fmt(summary.totalParking)}</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">{t('summary.totalSalary')}</div>
        <div className="stat-value">{fmt(summary.totalSalary)}</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">{t('summary.netSalary')}</div>
        <div className="stat-value green">{fmt(summary.totalNetSalary)}</div>
      </div>
    </div>
  );
}
