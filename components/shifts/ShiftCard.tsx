'use client'

import { ShiftCalcResult } from '@/lib/calc'
import { useT } from '@/lib/i18n'

export interface Shift {
  id: string
  type: 'regular' | 'training'
  date: string
  startTime: string
  endTime: string
  hourRate: string
  dailySalary: string
  calc: ShiftCalcResult
}

interface ShiftCardProps {
  shift: Shift
  onClick: (shift: Shift) => void
}

export default function ShiftCard({ shift, onClick }: ShiftCardProps) {
  const t = useT()
  const { calc, date, startTime, endTime, type } = shift

  const cardBg = calc.status === 'red' ? 'var(--status-red-bg)' : 'var(--bg-card)'
  const cardBorder = calc.status === 'red' ? 'var(--status-red-border)' : 'var(--border-default)'

  const barColor =
    calc.status === 'green' ? 'var(--status-green-bar)' :
    calc.status === 'yellow' ? 'var(--status-yellow-bar)' :
    'transparent'

  const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', weekday: 'short',
  })

  const timeRange = `${startTime} – ${endTime} · ${calc.totalHours}h`

  const sub = type === 'training'
    ? t('transferEndOfMonth')
    : `${t('cash')} ₪${calc.cash} · ${t('transfer')} ₪${calc.transfer}`

  return (
    <div
      dir="ltr"
      onClick={() => onClick(shift)}
      style={{
        background: cardBg,
        border: `0.5px solid ${cardBorder}`,
        borderRadius: 12,
        padding: '12px 14px',
        display: 'flex',
        gap: 10,
        cursor: 'pointer',
        transition: 'opacity 0.15s',
      }}
      onMouseDown={(e) => (e.currentTarget.style.opacity = '0.75')}
      onMouseUp={(e) => (e.currentTarget.style.opacity = '1')}
      onTouchStart={(e) => (e.currentTarget.style.opacity = '0.75')}
      onTouchEnd={(e) => (e.currentTarget.style.opacity = '1')}
    >
      {/* Status bar */}
      <div style={{
        width: 3, borderRadius: 3,
        background: barColor,
        alignSelf: 'stretch', minHeight: 40, flexShrink: 0,
      }} />

      {/* Body */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Top row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'var(--font-main)' }}>
            {formattedDate}
          </span>
          {type === 'training' && (
            <span style={{
              fontSize: 10, fontWeight: 600,
              padding: '2px 8px', borderRadius: 20,
              background: 'var(--status-blue-bg)',
              color: 'var(--status-blue-text)',
              border: '0.5px solid var(--status-blue-border)',
              fontFamily: 'var(--font-main)',
            }}>
              {t('training')}
            </span>
          )}
        </div>

        {/* Bottom row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 2, fontFamily: 'var(--font-main)' }}>
              {timeRange}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontFamily: 'var(--font-main)' }}>
              {sub}
            </div>
          </div>
          <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-main)' }}>
            ₪{calc.dailySalary}
          </span>
        </div>
      </div>
    </div>
  )
}