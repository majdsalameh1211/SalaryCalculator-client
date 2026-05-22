'use client'

import { useState } from 'react'
import ShiftCard from '@/components/shifts/ShiftCard'
import ShiftForm, { ShiftFormData } from '@/components/shifts/ShiftForm'
import ExpenseForm, { ExpenseFormData } from '@/components/expenses/ExpenseForm'
import BottomSheet from '@/components/ui/BottomSheet'
import FAB from '@/components/layout/FAB'
import { formatHours } from '@/lib/calc'
import { useT } from '@/lib/i18n'
import { Shift } from '@/lib/types'
import {
  useShifts,
  useCreateShift,
  useUpdateShift,
  useDeleteShift,
} from '@/hooks/useShifts'
import {
  useCreateExpense,
} from '@/hooks/useExpenses'

type SheetType = 'add-shift' | 'edit-shift' | 'add-fuel' | 'add-parking' | null

export default function HomePage() {
  const t = useT()
  const [sheet, setSheet] = useState<SheetType>(null)
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null)

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

  const { data: shifts = [], isLoading } = useShifts(viewYear, viewMonth)
  const createShift = useCreateShift(viewYear, viewMonth)
  const updateShift = useUpdateShift(viewYear, viewMonth)
  const deleteShift = useDeleteShift(viewYear, viewMonth)
  const createExpense = useCreateExpense(viewYear, viewMonth)

  const totalHours = shifts.reduce((sum, s) => sum + s.calc.totalHours, 0)

  async function handleSaveShift(data: ShiftFormData) {
    if (data.id) {
      await updateShift.mutateAsync({ id: data.id, data })
    } else {
      await createShift.mutateAsync(data)
    }
    setSheet(null)
    setSelectedShift(null)
  }

  async function handleDeleteShift() {
    if (!selectedShift) return
    await deleteShift.mutateAsync(selectedShift.id)
    setSheet(null)
    setSelectedShift(null)
  }

  async function handleSaveExpense(data: ExpenseFormData) {
    await createExpense.mutateAsync(data)
    setSheet(null)
  }

  function handleCardClick(shift: Shift) {
    setSelectedShift(shift)
    setSheet('edit-shift')
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
            <div style={summaryLabel}>{t('totalShifts')}</div>
            <div style={summaryVal}>{shifts.length}</div>
            <div style={summarySub}>{t('thisMonth')}</div>
          </div>
          <div style={summaryCard}>
            <div style={summaryLabel}>{t('workingHours')}</div>
            <div style={summaryVal}>{formatHours(totalHours)}</div>
            <div style={summarySub}>{t('thisMonth')}</div>
          </div>
        </div>

        {/* Shift list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-tertiary)', fontSize: 14, fontFamily: 'var(--font-main)' }}>
              Loading...
            </div>
          ) : shifts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-tertiary)', fontSize: 14, fontFamily: 'var(--font-main)' }}>
              No shifts this month
            </div>
          ) : (
            shifts.map((shift) => (
              <ShiftCard key={shift.id} shift={shift} onClick={handleCardClick} />
            ))
          )}
        </div>
      </div>

      <FAB
        onAddShift={() => setSheet('add-shift')}
        onAddFuel={() => setSheet('add-fuel')}
        onAddParking={() => setSheet('add-parking')}
      />

      <BottomSheet open={sheet === 'add-shift'} onClose={() => setSheet(null)} title={t('addShift')}>
        <ShiftForm onSave={handleSaveShift} />
      </BottomSheet>

      <BottomSheet open={sheet === 'edit-shift'} onClose={() => { setSheet(null); setSelectedShift(null) }} title={t('edit')}>
        {selectedShift && (
          <ShiftForm
            initial={selectedShift}
            onSave={handleSaveShift}
            onDelete={handleDeleteShift}
            isEdit
          />
        )}
      </BottomSheet>

      <BottomSheet open={sheet === 'add-fuel'} onClose={() => setSheet(null)} title={t('addFuel')}>
        <ExpenseForm type="fuel" onSave={handleSaveExpense} />
      </BottomSheet>

      <BottomSheet open={sheet === 'add-parking'} onClose={() => setSheet(null)} title={t('addParking')}>
        <ExpenseForm type="parking" onSave={handleSaveExpense} />
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