'use client'

import { useState, useEffect } from 'react'
import FormField from '@/components/ui/FormField'
import Input from '@/components/ui/Input'
import { useSettingsStore } from '@/store/settingsStore'
import { calcShift, calcHours, formatCurrency, formatHours, ShiftCalcResult } from '@/lib/calc'
import { useT } from '@/lib/i18n'

export interface ShiftFormData {
  id?: string
  type: 'regular' | 'training'
  date: string
  startTime: string
  endTime: string
  hourRate: string
  dailySalary: string
}

interface ShiftFormProps {
  initial?: Partial<ShiftFormData>
  onSave: (data: ShiftFormData, calc: ShiftCalcResult) => void
  onDelete?: () => void
  isEdit?: boolean
}

const today = () => new Date().toISOString().split('T')[0]

export default function ShiftForm({ initial, onSave, onDelete, isEdit }: ShiftFormProps) {
  const { settings } = useSettingsStore()
  const t = useT()

  const [type, setType] = useState<'regular' | 'training'>(initial?.type ?? 'regular')
  const [date, setDate] = useState(initial?.date ?? today())
  const [startTime, setStartTime] = useState(initial?.startTime ?? '09:00')
  const [endTime, setEndTime] = useState(initial?.endTime ?? '17:00')
  const [hourRate, setHourRate] = useState(initial?.hourRate ?? '')
  const [dailySalary, setDailySalary] = useState(initial?.dailySalary ?? '')
  const [lastEdited, setLastEdited] = useState<'rate' | 'salary' | null>(null)
  const [calc, setCalc] = useState<ShiftCalcResult | null>(null)

  useEffect(() => {
    const hrNum = parseFloat(hourRate)
    const dsNum = parseFloat(dailySalary)
    const hasRate = !isNaN(hrNum) && hrNum > 0
    const hasSalary = !isNaN(dsNum) && dsNum > 0

    if (!startTime || !endTime) return

    const result = calcShift({
      type,
      startTime,
      endTime,
      hourRate: hasRate ? hrNum : undefined,
      dailySalary: hasSalary && lastEdited === 'salary' ? dsNum : undefined,
      settings,
    })

    setCalc(result)

    if (lastEdited === 'rate' && hasRate) {
      setDailySalary(result.dailySalary > 0 ? String(result.dailySalary) : '')
    } else if (lastEdited === 'salary' && hasSalary) {
      setHourRate(result.effectiveHourRate > 0 ? String(result.effectiveHourRate) : '')
    }
  }, [type, startTime, endTime, hourRate, dailySalary, lastEdited, settings])

  function handleSave() {
    if (!calc) return
    onSave({ id: initial?.id, type, date, startTime, endTime, hourRate, dailySalary }, calc)
  }

  const hours = startTime && endTime ? calcHours(startTime, endTime) : 0

  return (
    <div dir="ltr" style={{ padding: '0 16px 24px' }}>

      {/* Type toggle */}
      <div style={{
        display: 'flex', background: 'var(--bg-tertiary)',
        borderRadius: 10, padding: 3, marginBottom: 16,
      }}>
        {(['regular', 'training'] as const).map((tValue) => (
          <button
            key={tValue}
            onClick={() => setType(tValue)}
            style={{
              flex: 1, padding: '8px 0',
              borderRadius: 8, cursor: 'pointer',
              fontFamily: 'var(--font-main)', fontSize: 13, fontWeight: 600,
              background: type === tValue ? 'var(--bg-card)' : 'transparent',
              color: type === tValue ? 'var(--text-primary)' : 'var(--text-secondary)',
              border: type === tValue ? '0.5px solid var(--border-default)' : 'none',
              transition: 'all 0.15s',
            }}
          >
            {tValue === 'regular' ? t('shift') : t('training')}
          </button>
        ))}
      </div>

      <FormField label={t('date')}>
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </FormField>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
        <FormField label={t('startTime')}>
          <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
        </FormField>
        <FormField label={t('endTime')}>
          <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
        </FormField>
      </div>

      {type === 'regular' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
          <FormField label={`${t('hourRate')} (₪)`}>
            <Input
              type="number" inputMode="decimal" placeholder="0.00"
              value={hourRate}
              onChange={(e) => { setHourRate(e.target.value); setLastEdited('rate') }}
              error={calc?.minWageApplied}
            />
          </FormField>
          <FormField label={`${t('dailySalary')} (₪)`}>
            <Input
              type="number" inputMode="decimal" placeholder="0.00"
              value={dailySalary}
              onChange={(e) => { setDailySalary(e.target.value); setLastEdited('salary') }}
              error={calc?.minWageApplied}
            />
          </FormField>
        </div>
      )}

      {calc?.minWageApplied && (
        <div style={{
          background: 'var(--status-red-bg)', border: '0.5px solid var(--status-red-border)',
          borderRadius: 10, padding: '9px 12px', marginBottom: 12,
          fontSize: 12, color: '#a32d2d', fontFamily: 'var(--font-main)',
        }}>
          ⚠ {t('minWageApplied')} — ₪{settings.minWage}/h
        </div>
      )}

      {calc && hours > 0 && (
        <div style={{
          background: 'var(--status-blue-bg)', border: '0.5px solid var(--status-blue-border)',
          borderRadius: 10, padding: '10px 14px', marginBottom: 16,
        }}>
          {[
            { label: t('hours'), value: formatHours(calc.totalHours) },
            ...(type === 'regular' ? [
              { label: t('cash'), value: formatCurrency(calc.cash) },
              { label: t('transfer'), value: formatCurrency(calc.transfer) },
            ] : []),
            { label: type === 'training' ? t('transferEndOfMonth') : t('dailySalary'), value: formatCurrency(calc.dailySalary), bold: true },
          ].map(({ label, value, bold }) => (
            <div key={label} style={{
              display: 'flex', justifyContent: 'space-between', marginBottom: 4,
            }}>
              <span style={{ fontSize: bold ? 13 : 12, fontWeight: bold ? 600 : 400, color: bold ? 'var(--status-blue-text)' : 'var(--text-secondary)', fontFamily: 'var(--font-main)' }}>
                {label}
              </span>
              <span style={{ fontSize: bold ? 13 : 12, fontWeight: bold ? 700 : 500, color: bold ? 'var(--status-blue-text)' : 'var(--text-primary)', fontFamily: 'var(--font-main)' }}>
                {value}
              </span>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={handleSave}
        style={{
          width: '100%', padding: 14,
          background: '#378add', color: '#fff', border: 'none', borderRadius: 11,
          fontSize: 15, fontWeight: 600, fontFamily: 'var(--font-main)', cursor: 'pointer',
          marginBottom: onDelete ? 10 : 0,
        }}
      >
        {t('save')}
      </button>

      {onDelete && (
        <button
          onClick={onDelete}
          style={{
            width: '100%', padding: 12,
            background: 'var(--status-red-bg)', color: '#a32d2d',
            border: '0.5px solid var(--status-red-border)', borderRadius: 11,
            fontSize: 14, fontWeight: 600, fontFamily: 'var(--font-main)', cursor: 'pointer',
          }}
        >
          {t('delete')}
        </button>
      )}
    </div>
  )
}