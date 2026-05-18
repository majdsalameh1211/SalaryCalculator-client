'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import MonthNavigator from '@/components/MonthNavigator';
import SummaryCards from '@/components/SummaryCards';
import ShiftsTable from '@/components/ShiftsTable';
import ShiftCards from '@/components/ShiftCards';
import ShiftForm from '@/components/ShiftForm';
import StatisticsPage from '@/components/StatisticsPage';
import SettingsPage from '@/components/SettingsPage';
import { Shift, MonthlyShiftsResponse } from '@/types';
import { getShifts, createShift, updateShift, deleteShift } from '@/lib/api';
import { useI18n } from '@/lib/i18n';

type Page = 'shifts' | 'statistics' | 'settings';

const emptyResponse: MonthlyShiftsResponse = {
  shifts: [],
  summary: { totalHours:0,totalFuel:0,totalParking:0,totalBonus:0,totalSalary:0,totalNetSalary:0,totalCash:0,totalMonthTransfer:0 },
  regularSummary: { totalHours:0,totalFuel:0,totalParking:0,totalBonus:0,totalSalary:0,totalNetSalary:0,totalCash:0,totalMonthTransfer:0 },
  trainingSummary: { totalHours:0,totalFuel:0,totalParking:0,totalBonus:0,totalSalary:0,totalNetSalary:0,totalCash:0,totalMonthTransfer:0 },
};

export default function Home() {
  const { t, dir } = useI18n();
  const router = useRouter();
  const now = new Date();
  const [ready, setReady] = useState(false);
  const [page, setPage] = useState<Page>('shifts');
  const [statsMode, setStatsMode] = useState<'all' | 'month'>('all');
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [data, setData] = useState<MonthlyShiftsResponse>(emptyResponse);
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const addBtnRef = useRef<HTMLButtonElement>(null);

  // Auth check — only runs client side
  useEffect(() => {
    const token = Cookies.get('auth_token');
    if (!token) {
      router.replace('/login');
    } else {
      setReady(true);
    }
  }, [router]);

  const load = useCallback(async () => {
    setLoading(true);
    try { setData(await getShifts(month, year)); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [month, year]);

  useEffect(() => { if (ready && page === 'shifts') load(); }, [load, page, ready]);

  // Close form on outside click
  useEffect(() => {
    if (!formOpen) return;
    function handler(e: MouseEvent) {
      if (
        formRef.current && !formRef.current.contains(e.target as Node) &&
        addBtnRef.current && !addBtnRef.current.contains(e.target as Node)
      ) {
        setFormOpen(false);
        setEditingShift(null);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [formOpen]);

  const prevMonth = () => { if (month===1){setMonth(12);setYear(y=>y-1);}else setMonth(m=>m-1); };
  const nextMonth = () => { if (month===12){setMonth(1);setYear(y=>y+1);}else setMonth(m=>m+1); };

  const handleSave = async (payload: object) => {
    try {
      if (editingShift) await updateShift(editingShift._id, payload);
      else await createShift(payload);
      setFormOpen(false);
      setEditingShift(null);
      await load();
    } catch (e) { console.error(e); }
  };

  const handleEdit = (shift: Shift) => {
    setEditingShift(shift);
    setFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this shift?')) return;
    try { await deleteShift(id); await load(); }
    catch (e) { console.error(e); }
  };

  const toggleForm = () => {
    if (formOpen) { setFormOpen(false); setEditingShift(null); }
    else { setFormOpen(true); setEditingShift(null); }
  };

  // Don't render until auth confirmed
  if (!ready) return null;

  return (
    <div dir={dir} className="app-root">
      <Navbar
        page={page}
        onNavigate={setPage}
        statsMode={statsMode}
        onStatsToggle={() => setStatsMode(m => m === 'all' ? 'month' : 'all')}
      />

      <main className="page">
        {page === 'shifts' && (
          <>
            <MonthNavigator month={month} year={year} onPrev={prevMonth} onNext={nextMonth} />
            <SummaryCards summary={data.summary} />

            <div className="section-hdr">
              <span className="section-label">{t('shifts.title')}</span>
              <button ref={addBtnRef} className={`add-btn${formOpen ? ' add-btn-open' : ''}`} onClick={toggleForm}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  style={{ transform: formOpen ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform 0.25s' }}>
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                {formOpen ? t('form.cancel') : t('shifts.addShift')}
              </button>
            </div>

            <div className={`form-collapse desktop-only${formOpen ? ' form-collapse-open' : ''}`}>
              <div ref={formRef}>
                <ShiftForm editingShift={editingShift} onSave={handleSave} onCancel={() => { setFormOpen(false); setEditingShift(null); }} />
              </div>
            </div>

            {loading ? <div className="loading">Loading...</div> : (
              <>
                <div className="desktop-only">
                  <ShiftsTable shifts={data.shifts} regularSummary={data.regularSummary} trainingSummary={data.trainingSummary} onEdit={handleEdit} onDelete={handleDelete} />
                </div>
                <div className="mobile-only">
                  <ShiftCards shifts={data.shifts} onEdit={handleEdit} onDelete={handleDelete} />
                </div>
              </>
            )}
          </>
        )}

        {page === 'statistics' && <StatisticsPage statsMode={statsMode} />}
        {page === 'settings' && <SettingsPage />}
      </main>

      <div className="mobile-only">
        {formOpen && <div className="sheet-backdrop" onClick={() => { setFormOpen(false); setEditingShift(null); }} />}
        <div className={`bottom-sheet${formOpen ? ' sheet-open' : ''}`}>
          <div className="sheet-handle" />
          <div className="sheet-content">
            <ShiftForm editingShift={editingShift} onSave={handleSave} onCancel={() => { setFormOpen(false); setEditingShift(null); }} />
          </div>
        </div>
      </div>

      {page === 'statistics' && (
        <div className="mobile-only mobile-stats-toggle">
          <span className={`toggle-label${statsMode==='all' ? ' tl-active' : ' tl-dim'}`}>{t('nav.all')}</span>
          <div className={`toggle-track${statsMode==='month' ? ' tt-on' : ''}`} onClick={() => setStatsMode(m => m==='all'?'month':'all')}>
            <div className="toggle-thumb"/>
          </div>
          <span className={`toggle-label${statsMode==='month' ? ' tl-active' : ' tl-dim'}`}>{t('nav.month')}</span>
        </div>
      )}

      <div className="mobile-only">
        <BottomNav page={page} onNavigate={(p) => { setPage(p); if (p === 'shifts' && formOpen) { setFormOpen(false); setEditingShift(null); } }} />
      </div>
    </div>
  );
}
