'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { removeToken } from '@/lib/auth'
import { useAuthStore } from '@/store/authStore'
import Input from '@/components/ui/Input'
import { useT } from '@/lib/i18n'
import { useSettings, useUpdateSettings } from '@/hooks/useSettings'

function SectionTitle({ label }: { label: string }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 600, color: 'var(--text-tertiary)',
      textTransform: 'uppercase', letterSpacing: '0.7px',
      fontFamily: 'var(--font-main)',
      marginBottom: 8, marginTop: 20,
    }}>
      {label}
    </div>
  )
}

function SettingRow({ label, sub, value, onChange, suffix = '₪' }: {
  label: string
  sub?: string
  value: string
  onChange: (v: string) => void
  suffix?: string
}) {
  return (
    <div style={{
      background: 'var(--bg-card)', border: '0.5px solid var(--border-default)',
      borderRadius: 12, padding: '12px 14px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
      marginBottom: 8,
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', fontFamily: 'var(--font-main)' }}>
          {label}
        </div>
        {sub && (
          <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontFamily: 'var(--font-main)', marginTop: 2 }}>
            {sub}
          </div>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Input
          type="number" inputMode="decimal" value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ width: 90, textAlign: 'right', padding: '8px 10px', fontSize: 14 }}
        />
        <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontFamily: 'var(--font-main)', flexShrink: 0 }}>
          {suffix}
        </span>
      </div>
    </div>
  )
}

export default function SettingsPage() {
  const router = useRouter()
  const t = useT()
  const clearUser = useAuthStore((s) => s.clearUser)

  const { data: settings, isLoading } = useSettings()
  const updateSettings = useUpdateSettings()

  const [minWage, setMinWage] = useState('')
  const [bonusRate, setBonusRate] = useState('')
  const [trainingRate, setTrainingRate] = useState('')
  const [threshold, setThreshold] = useState('')
  const [saved, setSaved] = useState(false)

  // Populate fields once settings load from backend
  useEffect(() => {
    if (settings) {
      setMinWage(String(settings.minWage))
      setBonusRate(String(settings.bonusRatePerHour))
      setTrainingRate(String(settings.trainingHourRate))
      setThreshold(String(settings.goodRateThreshold))
    }
  }, [settings])

  async function handleSave() {
    const mw = parseFloat(minWage)
    const br = parseFloat(bonusRate)
    const tr = parseFloat(trainingRate)
    const th = parseFloat(threshold)
    if ([mw, br, tr, th].some(isNaN)) return

    await updateSettings.mutateAsync({
      minWage: mw,
      bonusRatePerHour: br,
      trainingHourRate: tr,
      goodRateThreshold: th,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function handleLogout() {
    removeToken()
    clearUser()
    router.replace('/login')
  }

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-tertiary)', fontSize: 14, fontFamily: 'var(--font-main)' }}>
        Loading...
      </div>
    )
  }

  return (
    <div dir="ltr" style={{ padding: '14px 16px', paddingBottom: 40 }}>

      <SectionTitle label="Salary rules" />
      <SettingRow label={t('minWage')} sub="Auto-applied when rate is below this" value={minWage} onChange={setMinWage} suffix="₪/h" />
      <SettingRow label={t('goodRateThreshold')} sub="Green indicator above this rate" value={threshold} onChange={setThreshold} suffix="₪/h" />

      <SectionTitle label="Rates" />
      <SettingRow label={t('bonusRate')} sub="Applied to all hours, paid monthly" value={bonusRate} onChange={setBonusRate} suffix="₪/h" />
      <SettingRow label={t('trainingRate')} sub="Fixed rate for training shifts" value={trainingRate} onChange={setTrainingRate} suffix="₪/h" />

      <button
        onClick={handleSave}
        disabled={updateSettings.isPending}
        style={{
          width: '100%', padding: 14, marginTop: 8,
          background: saved ? '#1D9E75' : '#378add',
          color: '#fff', border: 'none', borderRadius: 11,
          fontSize: 15, fontWeight: 600, fontFamily: 'var(--font-main)',
          cursor: updateSettings.isPending ? 'not-allowed' : 'pointer',
          transition: 'background 0.2s',
        }}
      >
        {saved ? `✓ ${t('save')}` : updateSettings.isPending ? 'Saving...' : t('save')}
      </button>

      <SectionTitle label="Account" />
      <button
        onClick={handleLogout}
        style={{
          width: '100%', padding: 13,
          background: 'var(--status-red-bg)', color: '#a32d2d',
          border: '0.5px solid var(--status-red-border)',
          borderRadius: 11, fontSize: 14, fontWeight: 600,
          fontFamily: 'var(--font-main)', cursor: 'pointer',
        }}
      >
        Sign out
      </button>

    </div>
  )
}