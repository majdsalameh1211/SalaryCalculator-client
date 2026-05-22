'use client'

import { useT } from '@/lib/i18n'

export interface Expense {
  id: string
  type: 'fuel' | 'parking'
  date: string
  amount: number
}

interface ExpenseCardProps {
  expense: Expense
  onClick: (expense: Expense) => void
}

export default function ExpenseCard({ expense, onClick }: ExpenseCardProps) {
  const t = useT()
  const formattedDate = new Date(expense.date + 'T00:00:00').toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', weekday: 'short',
  })

  const isFuel = expense.type === 'fuel'

  const iconColor = isFuel ? '#BA7517' : '#534AB7'
  const bgColor = isFuel ? '#FAEEDA' : '#EEEDFE'

  return (
    <div
      dir="ltr"
      onClick={() => onClick(expense)}
      style={{
        background: 'var(--bg-card)',
        border: '0.5px solid var(--border-default)',
        borderRadius: 12,
        padding: '12px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        cursor: 'pointer',
        transition: 'opacity 0.15s',
      }}
      onMouseDown={(e) => (e.currentTarget.style.opacity = '0.75')}
      onMouseUp={(e) => (e.currentTarget.style.opacity = '1')}
      onTouchStart={(e) => (e.currentTarget.style.opacity = '0.75')}
      onTouchEnd={(e) => (e.currentTarget.style.opacity = '1')}
    >
      <div style={{
        width: 38, height: 38, borderRadius: 10,
        background: bgColor,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        {isFuel ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 22V6a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16" />
            <path d="M14 9h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2" />
            <line x1="3" y1="22" x2="14" y2="22" />
            <rect x="5" y="8" width="6" height="4" rx="1" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M9 17V7h4a3 3 0 0 1 0 6H9" />
          </svg>
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 13, fontWeight: 600,
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-main)',
          marginBottom: 2,
          textTransform: 'capitalize',
        }}>
          {isFuel ? t('fuel') : t('parking')}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'var(--font-main)' }}>
          {formattedDate}
        </div>
      </div>

      <span style={{
        fontSize: 16, fontWeight: 600,
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-main)',
      }}>
        ₪{expense.amount}
      </span>
    </div>
  )
}