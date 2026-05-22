'use client'

import { useState } from 'react'
import { formatCurrency, formatHours } from '@/lib/calc'
import { useT } from '@/lib/i18n'
import { useStats } from '@/hooks/useStats'

type View = 'monthly' | 'yearly'

interface StatCardProps {
  label: string
  value: string
  sub?: string
  accent?: string
  style?: React.CSSProperties
}

function StatCard({ label, value, sub, accent, style }: StatCardProps) {
  return (
    <div style={{
      background: 'var(--bg-card)', border: '0.5px solid var(--border-default)',
      borderRadius: 12, padding: '12px 14px',
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
      ...style,
    }}>
      <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 4, fontFamily: 'var(--font-main)' }}>
        {label}
      </div>
      <div style={{ fontSize: 20, fontWeight: 600, fontFamily: 'var(--font-main)', color: accent ?? 'var(--text-primary)' }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2, fontFamily: 'var(--font-main)' }}>
          {sub}
        </div>
      )}
    </div>
  )
}

function Divider({ label }: { label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '12px 0 6px' }}>
      <div style={{ flex: 1, height: '0.5px', background: 'var(--border-default)' }} />
      <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-tertiary)', fontFamily: 'var(--font-main)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
        {label}
      </span>
      <div style={{ flex: 1, height: '0.5px', background: 'var(--border-default)' }} />
    </div>
  )
}

export default function StatsPage() {
  const t = useT()
  const [view, setView] = useState<View>('monthly')

  const now = new Date()
  const [viewYear, setViewYear] = useState(now.getFullYear())
  const [viewMonth, setViewMonth] = useState(now.getMonth())

  const monthLabel = new Date(viewYear, viewMonth).toLocaleDateString('en-GB', {
    month: 'long', year: 'numeric',
  })

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  const { data: stats, isLoading } = useStats(
    viewYear,
    view === 'monthly' ? viewMonth : undefined
  )

  const empty = {
    totalShiftsCount: 0, workingDays: 0, regularCount: 0, trainingCount: 0,
    regularHours: 0, trainingHours: 0, totalHours: 0,
    cashSalary: 0, regularTransfer: 0, trainingIncome: 0,
    bonus: 0, totalTransfer: 0, totalIncome: 0,
    totalFuel: 0, totalParking: 0, netProfit: 0,
    avgHourRate: 0, avgIncome: 0, avgBonus: 0,
  }

  const s = stats ?? empty

  return (
    <div dir="ltr" style={{ padding: '14px 16px', paddingBottom: 40 }}>

      {/* View toggle */}
      <div style={{ display: 'flex', background: 'var(--bg-tertiary)', borderRadius: 10, padding: 3, marginBottom: 16 }}>
        {(['monthly', 'yearly'] as View[]).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            style={{
              flex: 1, padding: '8px 0', borderRadius: 8, cursor: 'pointer',
              fontFamily: 'var(--font-main)', fontSize: 13, fontWeight: 600,
              background: view === v ? 'var(--bg-card)' : 'transparent',
              color: view === v ? 'var(--text-primary)' : 'var(--text-secondary)',
              border: view === v ? '0.5px solid var(--border-default)' : 'none',
              transition: 'all 0.15s',
            }}
          >
            {v === 'monthly' ? t('monthly') : t('yearly')}
          </button>
        ))}
      </div>

      {/* Period navigator */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <button onClick={view === 'monthly' ? prevMonth : () => setViewYear(y => y - 1)} style={navBtnStyle}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-main)' }}>
          {view === 'monthly' ? monthLabel : viewYear}
        </span>
        <button onClick={view === 'monthly' ? nextMonth : () => setViewYear(y => y + 1)} style={navBtnStyle}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-tertiary)', fontSize: 14, fontFamily: 'var(--font-main)' }}>
          Loading...
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>

          {/* 1. WORK */}
          <Divider label={t('work')} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <StatCard label={t('workingDays')} value={String(s.workingDays)} sub={t('regAndTrain')} style={{ gridColumn: '1 / -1' }} />
            <StatCard label={t('totalShifts')} value={String(s.regularCount)} sub={t('regularOnly')} />
            <StatCard label={t('trainingShifts')} value={String(s.trainingCount)} />
            <StatCard label={t('workingHours')} value={formatHours(s.regularHours)} sub={t('regularOnly')} />
            <StatCard label={t('trainingHours')} value={formatHours(s.trainingHours)} sub={t('fromTrain')} />
          </div>

          {/* 2. INCOME */}
          <Divider label={t('income')} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <StatCard label={t('totalIncome')} value={formatCurrency(s.totalIncome)} accent="#1D9E75" />
            <StatCard label={t('totalTransfer')} value={formatCurrency(s.totalTransfer)} sub={t('inclTrainingBonus')} accent="#378add" />
            <StatCard label={t('totalCash')} value={formatCurrency(s.cashSalary)} sub={t('regularCash')} />
            <StatCard label={t('shiftsTransfer')} value={formatCurrency(s.regularTransfer)} sub={t('regularTransferSub')} />
            <StatCard label={t('trainingIncome')} value={formatCurrency(s.trainingIncome)} sub={t('trainingOnly')} />
            <StatCard label={t('bonus')} value={formatCurrency(s.bonus)} sub={t('fromAllHours')} />
          </div>

          {/* 3. EXPENSES */}
          <Divider label={t('expenses')} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <StatCard label={t('totalFuel')} value={formatCurrency(s.totalFuel)} accent="#BA7517" />
            <StatCard label={t('totalParking')} value={formatCurrency(s.totalParking)} accent="#534AB7" />
          </div>

          {/* 4. AVERAGES */}
          <Divider label={t('averages')} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            <StatCard label={t('avgHourRate')} value={`₪${s.avgHourRate.toFixed(1)}`} sub={t('totalPerHrs')} style={{ padding: '10px' }} />
            <StatCard label={t('avgIncome')} value={`₪${s.avgIncome.toFixed(1)}`} sub={t('payPerShift')} style={{ padding: '10px' }} />
            <StatCard label={t('avgBonus')} value={`₪${s.avgBonus.toFixed(1)}`} sub={t('bonusPerShift')} style={{ padding: '10px' }} />
          </div>

          {/* 5. NET */}
          <Divider label={t('net')} />
          <div style={{
            background: s.netProfit >= 0 ? '#EAF3DE' : 'var(--status-red-bg)',
            border: `0.5px solid ${s.netProfit >= 0 ? '#97C459' : 'var(--status-red-border)'}`,
            borderRadius: 12, padding: '14px 16px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: 8,
          }}>
            <span style={{ fontSize: 14, fontWeight: 600, fontFamily: 'var(--font-main)', color: s.netProfit >= 0 ? '#3B6D11' : '#a32d2d' }}>
              {t('netProfit')}
            </span>
            <span style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-main)', color: s.netProfit >= 0 ? '#3B6D11' : '#a32d2d' }}>
              {formatCurrency(s.netProfit)}
            </span>
          </div>

        </div>
      )}
    </div>
  )
}

const navBtnStyle: React.CSSProperties = {
  width: 30, height: 30, border: '0.5px solid var(--border-default)',
  borderRadius: '50%', background: 'var(--bg-card)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer', color: 'var(--text-secondary)',
}