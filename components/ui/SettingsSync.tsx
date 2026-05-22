'use client'

// components/ui/SettingsSync.tsx
// Invisible component — sits in the app layout, keeps local settingsStore
// in sync with backend settings so ShiftForm preview calculations are accurate.

import { useEffect } from 'react'
import { useSettings } from '@/hooks/useSettings'
import { useSettingsStore } from '@/store/settingsStore'

export default function SettingsSync() {
  const { data } = useSettings()
  const setSettings = useSettingsStore((s) => s.setSettings)

  useEffect(() => {
    if (data) {
      setSettings({
        minWage: data.minWage,
        bonusRatePerHour: data.bonusRatePerHour,
        trainingHourRate: data.trainingHourRate,
        goodRateThreshold: data.goodRateThreshold,
      })
    }
  }, [data, setSettings])

  return null
}