'use client'

import { useState } from 'react'
import FormField from '@/components/ui/FormField'
import Input from '@/components/ui/Input'
import { useT } from '@/lib/i18n'

export interface ExpenseFormData {
  id?: string
  type: 'fuel' | 'parking'
  date: string
  amount: string
}

interface ExpenseFormProps {
  type: 'fuel' | 'parking'
  initial?: Partial<ExpenseFormData>
  onSave: (data: ExpenseFormData) => void
  onDelete?: () => void
  isEdit?: boolean
}

const today = () => new Date().toISOString().split('T')[0]

export default function ExpenseForm({ type, initial, onSave, onDelete, isEdit }: ExpenseFormProps) {
  const t = useT()
  const [date, setDate] = useState(initial?.date ?? today())
  const [amount, setAmount] = useState(initial?.amount ?? '')

  function handleSave() {
    if (!amount || parseFloat(amount) <= 0) return
    onSave({ id: initial?.id, type, date, amount })
  }

  return (
    <div dir="ltr" style={{ padding: '0 16px 24px' }}>
      <FormField label={t('date')}>
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </FormField>

      <FormField label={`${t('amount')} (₪)`}>
        <Input
          type="number"
          inputMode="decimal"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          autoFocus
        />
      </FormField>

      <button
        onClick={handleSave}
        style={{
          width: '100%', padding: 14, marginTop: 4,
          background: type === 'fuel' ? '#BA7517' : '#534AB7',
          color: '#fff', border: 'none', borderRadius: 11,
          fontSize: 15, fontWeight: 600,
          fontFamily: 'var(--font-main)', cursor: 'pointer',
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
            border: '0.5px solid var(--status-red-border)',
            borderRadius: 11, fontSize: 14, fontWeight: 600,
            fontFamily: 'var(--font-main)', cursor: 'pointer',
          }}
        >
          {t('delete')}
        </button>
      )}
    </div>
  )
}