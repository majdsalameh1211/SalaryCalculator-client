'use client'

import { useState } from 'react'
import ExpenseCard from '@/components/expenses/ExpenseCard'
import ExpenseForm, { ExpenseFormData } from '@/components/expenses/ExpenseForm'
import BottomSheet from '@/components/ui/BottomSheet'
import FAB from '@/components/layout/FAB'
import { useT } from '@/lib/i18n'
import { ApiExpense } from '@/lib/types'
import {
  useExpenses,
  useCreateExpense,
  useUpdateExpense,
  useDeleteExpense,
} from '@/hooks/useExpenses'

type SheetType = 'add-fuel' | 'add-parking' | 'edit' | null

export default function ExpensesPage() {
  const t = useT()
  const [sheet, setSheet] = useState<SheetType>(null)
  const [selected, setSelected] = useState<ApiExpense | null>(null)

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

  const { data: expenses = [], isLoading } = useExpenses(viewYear, viewMonth)
  const createExpense = useCreateExpense(viewYear, viewMonth)
  const updateExpense = useUpdateExpense(viewYear, viewMonth)
  const deleteExpense = useDeleteExpense(viewYear, viewMonth)

  const totalFuel = expenses.filter(e => e.type === 'fuel').reduce((s, e) => s + e.amount, 0)
  const totalParking = expenses.filter(e => e.type === 'parking').reduce((s, e) => s + e.amount, 0)

  async function handleSave(data: ExpenseFormData) {
    const amount = parseFloat(data.amount)
    if (isNaN(amount) || amount <= 0) return

    if (data.id) {
      await updateExpense.mutateAsync({ id: data.id, data })
    } else {
      await createExpense.mutateAsync(data)
    }
    setSheet(null)
    setSelected(null)
  }

  async function handleDelete() {
    if (!selected) return
    await deleteExpense.mutateAsync(selected.id)
    setSheet(null)
    setSelected(null)
  }

  function handleCardClick(expense: ApiExpense) {
    setSelected(expense)
    setSheet('edit')
  }

  return (
    <>
      <div dir="ltr" style={{ padding: '14px 16px', paddingBottom: 100 }}>

        {/* Month navigator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <button onClick={prevMonth} style={navBtnStyle}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-main)' }}>
            {monthLabel}
          </span>
          <button onClick={nextMonth} style={navBtnStyle}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* Summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
          <div style={summaryCard}>
            <div style={summaryLabel}>{t('totalFuel')}</div>
            <div style={{ ...summaryVal, color: '#BA7517' }}>₪{totalFuel}</div>
            <div style={summarySub}>{t('thisMonth')}</div>
          </div>
          <div style={summaryCard}>
            <div style={summaryLabel}>{t('totalParking')}</div>
            <div style={{ ...summaryVal, color: '#534AB7' }}>₪{totalParking}</div>
            <div style={summarySub}>{t('thisMonth')}</div>
          </div>
        </div>

        {/* Expense list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-tertiary)', fontSize: 14, fontFamily: 'var(--font-main)' }}>
              Loading...
            </div>
          ) : expenses.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-tertiary)', fontSize: 14, fontFamily: 'var(--font-main)' }}>
              No expenses this month
            </div>
          ) : (
            expenses.map((expense) => (
              <ExpenseCard key={expense.id} expense={expense} onClick={(e: any) => handleCardClick(e as ApiExpense)} />
            ))
          )}
        </div>
      </div>

      <FAB
        onAddShift={() => {}}
        onAddFuel={() => setSheet('add-fuel')}
        onAddParking={() => setSheet('add-parking')}
      />

      <BottomSheet open={sheet === 'add-fuel'} onClose={() => setSheet(null)} title={t('addFuel')}>
        <ExpenseForm type="fuel" onSave={handleSave} />
      </BottomSheet>

      <BottomSheet open={sheet === 'add-parking'} onClose={() => setSheet(null)} title={t('addParking')}>
        <ExpenseForm type="parking" onSave={handleSave} />
      </BottomSheet>

      <BottomSheet open={sheet === 'edit'} onClose={() => { setSheet(null); setSelected(null) }} title={t('edit')}>
        {selected && (
          <ExpenseForm
            type={selected.type}
            initial={{ id: selected.id, type: selected.type, date: selected.date, amount: String(selected.amount) }}
            onSave={handleSave}
            onDelete={handleDelete}
            isEdit
          />
        )}
      </BottomSheet>
    </>
  )
}

const navBtnStyle: React.CSSProperties = {
  width: 30, height: 30, border: '0.5px solid var(--border-default)',
  borderRadius: '50%', background: 'var(--bg-card)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer', color: 'var(--text-secondary)',
}
const summaryCard: React.CSSProperties = {
  background: 'var(--bg-card)', borderRadius: 12, padding: '10px 14px',
  border: '0.5px solid var(--border-default)',
}
const summaryLabel: React.CSSProperties = {
  fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 2, fontFamily: 'var(--font-main)',
}
const summaryVal: React.CSSProperties = {
  fontSize: 20, fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-main)',
}
const summarySub: React.CSSProperties = {
  fontSize: 11, color: 'var(--text-tertiary)', fontFamily: 'var(--font-main)',
}