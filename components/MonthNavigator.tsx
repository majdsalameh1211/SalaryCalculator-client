'use client';
import React from 'react';
import { useI18n } from '@/lib/i18n';

const MONTH_KEYS = ['january','february','march','april','may','june','july','august','september','october','november','december'];

interface Props { month: number; year: number; onPrev: () => void; onNext: () => void; }

export default function MonthNavigator({ month, year, onPrev, onNext }: Props) {
  const { t } = useI18n();
  return (
    <div className="month-nav">
      <button className="nav-arr" onClick={onPrev} aria-label="Previous month">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <span className="month-title">{t(`month.${MONTH_KEYS[month - 1]}`)} {year}</span>
      <button className="nav-arr" onClick={onNext} aria-label="Next month">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
    </div>
  );
}
