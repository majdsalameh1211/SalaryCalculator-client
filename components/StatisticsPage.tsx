'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useI18n } from '@/lib/i18n';
import { getStats } from '@/lib/api';
import { StatsResponse, MonthlyStatsRow } from '@/types';
import { fmt, fmtHours } from '@/lib/calc';
import MonthNavigator from './MonthNavigator';

interface Props {
  statsMode: 'all' | 'month';
}

const MONTH_KEYS = ['january','february','march','april','may','june','july','august','september','october','november','december'];

export default function StatisticsPage({ statsMode }: Props) {
  const { t } = useI18n();
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [data, setData] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const d = await getStats(statsMode, month, year);
      setData(d);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [statsMode, month, year]);

  useEffect(() => { load(); }, [load]);

  const prevMonth = () => { if (month === 1) { setMonth(12); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 12) { setMonth(1); setYear(y => y + 1); } else setMonth(m => m + 1); };

  const totals = data?.totals;
  const rows = data?.monthlyRows ?? [];

  const monthName = (m: number, y: number) => `${t(`month.${MONTH_KEYS[m - 1]}`)} ${y}`;

  // For single month: build a 2-row breakdown table
  const singleMonthRow = rows[0];

  return (
    <div className="stats-page">
      {statsMode === 'month' && (
        <MonthNavigator month={month} year={year} onPrev={prevMonth} onNext={nextMonth} />
      )}

      {loading ? <div className="loading">Loading...</div> : (
        <>
          {/* Metric cards */}
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="m-lbl">{t('stats.totalHours')}</div>
              <div className="m-val">{fmtHours(totals?.totalHours ?? 0)}</div>
              {statsMode === 'all' && <div className="m-sub">{t('stats.allMonths')}</div>}
              {statsMode === 'month' && singleMonthRow && (
                <div className="m-sub">{singleMonthRow.regularShifts} {t('stats.allShifts')}{singleMonthRow.trainingShifts} {t('stats.allTraining')}</div>
              )}
            </div>
            <div className="metric-card">
              <div className="m-lbl">{t('stats.totalBonus')}</div>
              <div className="m-val">{fmt(totals?.totalBonus ?? 0)}</div>
            </div>
            <div className="metric-card">
              <div className="m-lbl">{t('stats.shiftSalary')}</div>
              <div className="m-val">{fmt(totals?.shiftSalary ?? 0)}</div>
              <div className="m-sub">{t('stats.regularShifts')}</div>
            </div>
            <div className="metric-card metric-blue">
              <div className="m-lbl">{t('stats.trainingSalary')}</div>
              <div className="m-val">{fmt(totals?.trainingSalary ?? 0)}</div>
              <div className="m-sub">{t('stats.trainingShifts')}</div>
            </div>
          </div>

          <div className="metrics-grid">
            <div className="metric-card">
              <div className="m-lbl">{t('stats.totalSalary')}</div>
              <div className="m-val">{fmt(totals?.totalSalary ?? 0)}</div>
            </div>
            <div className="metric-card metric-amber">
              <div className="m-lbl">{t('stats.fuel')}</div>
              <div className="m-val">{fmt(totals?.totalFuel ?? 0)}</div>
            </div>
            <div className="metric-card metric-amber">
              <div className="m-lbl">{t('stats.parking')}</div>
              <div className="m-val">{fmt(totals?.totalParking ?? 0)}</div>
            </div>
            <div className="metric-card metric-green">
              <div className="m-lbl">{t('stats.netSalary')}</div>
              <div className="m-val">{fmt(totals?.netSalary ?? 0)}</div>
              <div className="m-sub">total − fuel − parking</div>
            </div>
          </div>

          {/* Table */}
          {statsMode === 'all' && rows.length > 0 && (
            <div className="stats-tbl-wrap">
              <div className="tbl-hdr">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                {t('stats.historyTitle')}
              </div>
              <div className="table-scroll">
                <table className="shifts-table">
                  <thead><tr>
                    <th>{t('stats.month')}</th><th>{t('stats.totalHours')}</th>
                    <th>{t('stats.shiftSalary')}</th><th>{t('stats.trainingSalary')}</th>
                    <th>{t('stats.bonus')}</th><th>{t('stats.salary')}</th>
                    <th>{t('stats.fuel')}</th><th>{t('stats.parking')}</th><th>{t('stats.net')}</th>
                  </tr></thead>
                  <tbody>
                    {rows.map((r: MonthlyStatsRow) => (
                      <tr key={`${r.year}-${r.month}`}>
                        <td>{monthName(r.month, r.year)}</td>
                        <td>{fmtHours(r.totalHours)}</td>
                        <td>{fmt(r.shiftSalary)}</td>
                        <td className="training-rate-cell">{fmt(r.trainingSalary)}</td>
                        <td>{fmt(r.totalBonus)}</td>
                        <td>{fmt(r.totalSalary)}</td>
                        <td className="amber-cell">{fmt(r.totalFuel)}</td>
                        <td className="amber-cell">{fmt(r.totalParking)}</td>
                        <td className="net-cell">{fmt(r.netSalary)}</td>
                      </tr>
                    ))}
                    <tr className="total-row">
                      <td>{t('stats.grandTotal')}</td>
                      <td>{fmtHours(totals?.totalHours ?? 0)}</td>
                      <td>{fmt(totals?.shiftSalary ?? 0)}</td>
                      <td className="training-rate-cell">{fmt(totals?.trainingSalary ?? 0)}</td>
                      <td>{fmt(totals?.totalBonus ?? 0)}</td>
                      <td>{fmt(totals?.totalSalary ?? 0)}</td>
                      <td className="amber-cell">{fmt(totals?.totalFuel ?? 0)}</td>
                      <td className="amber-cell">{fmt(totals?.totalParking ?? 0)}</td>
                      <td className="net-cell">{fmt(totals?.netSalary ?? 0)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {statsMode === 'month' && singleMonthRow && (
            <div className="stats-tbl-wrap">
              <div className="tbl-hdr">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                {t('stats.monthBreakdown')} — {monthName(month, year)}
              </div>
              <div className="table-scroll">
                <table className="shifts-table">
                  <thead><tr>
                    <th>Type</th><th>{t('stats.shifts')}</th><th>{t('stats.totalHours')}</th>
                    <th>{t('stats.shiftSalary')}</th><th>{t('stats.bonus')}</th>
                    <th>{t('stats.fuel')}</th><th>{t('stats.parking')}</th><th>{t('stats.net')}</th>
                  </tr></thead>
                  <tbody>
                    <tr>
                      <td>{t('stats.regularShifts')}</td>
                      <td>{singleMonthRow.regularShifts}</td>
                      <td>{fmtHours(singleMonthRow.totalHours - (rows[0]?.trainingShifts ? singleMonthRow.totalHours * singleMonthRow.trainingShifts / (singleMonthRow.regularShifts + singleMonthRow.trainingShifts) : 0))}</td>
                      <td>{fmt(singleMonthRow.shiftSalary)}</td>
                      <td>{fmt(singleMonthRow.totalBonus - (singleMonthRow.trainingSalary > 0 ? singleMonthRow.trainingSalary - singleMonthRow.trainingSalary / 1.3 : 0))}</td>
                      <td className="amber-cell">—</td><td className="amber-cell">—</td>
                      <td className="net-cell">{fmt(singleMonthRow.shiftSalary)}</td>
                    </tr>
                    <tr className="row-blue">
                      <td className="training-rate-cell">{t('stats.trainingShifts')}</td>
                      <td className="training-rate-cell">{singleMonthRow.trainingShifts}</td>
                      <td>—</td>
                      <td className="training-rate-cell">{fmt(singleMonthRow.trainingSalary)}</td>
                      <td>—</td>
                      <td className="amber-cell">—</td><td className="amber-cell">—</td>
                      <td className="net-cell">{fmt(singleMonthRow.trainingSalary)}</td>
                    </tr>
                    <tr className="total-row">
                      <td>{t('stats.combined')}</td>
                      <td>{singleMonthRow.regularShifts + singleMonthRow.trainingShifts}</td>
                      <td>{fmtHours(singleMonthRow.totalHours)}</td>
                      <td>{fmt(singleMonthRow.totalSalary)}</td>
                      <td>{fmt(singleMonthRow.totalBonus)}</td>
                      <td className="amber-cell">{fmt(singleMonthRow.totalFuel)}</td>
                      <td className="amber-cell">{fmt(singleMonthRow.totalParking)}</td>
                      <td className="net-cell">{fmt(singleMonthRow.netSalary)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {rows.length === 0 && !loading && (
            <div className="no-shifts">{t('shifts.noShifts')}</div>
          )}
        </>
      )}
    </div>
  );
}
