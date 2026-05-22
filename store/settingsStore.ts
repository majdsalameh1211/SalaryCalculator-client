// store/settingsStore.ts
// Settings are now fetched from the backend via useSettings hook.
// This store is kept only for components that still need local settings
// during shift calculation preview (ShiftForm) before the form is saved.
// It is populated from the backend via useSettings in the settings page.

import { create } from 'zustand'

export interface Settings {
  minWage: number
  bonusRatePerHour: number
  trainingHourRate: number
  goodRateThreshold: number
}

interface SettingsStore {
  settings: Settings
  setSettings: (s: Partial<Settings>) => void
}

const defaults: Settings = {
  minWage: 32.3,
  bonusRatePerHour: 10,
  trainingHourRate: 25,
  goodRateThreshold: 50,
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  settings: defaults,
  setSettings: (s) =>
    set((state) => ({ settings: { ...state.settings, ...s } })),
}))