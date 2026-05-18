'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Settings } from '@/types';
import { getSettings } from '@/lib/api';

interface SettingsContextType {
  settings: Settings;
  setSettings: (s: Settings) => void;
  loading: boolean;
}

const defaultSettings: Settings = {
  minWage: 32.3, hoursThreshold: 50, bonusPerHour: 10,
  defaultFuel: 0, defaultParking: 0, defaultTrainingRate: 32.3,
};

const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSettings().then(setSettings).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, setSettings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
