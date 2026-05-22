// lib/types.ts

import { ShiftCalcResult } from './calc'

// ── Backend response shapes ────────────────────────────────────────

export interface ApiShift {
  id: string
  userId: string
  type: 'regular' | 'training'
  date: string
  startTime: string
  endTime: string
  hourRate?: number
  dailySalary: number
  totalHours: number
  cash: number
  transfer: number
  status: 'red' | 'yellow' | 'green' | 'training'
  minWageApplied: boolean
}

export interface ApiExpense {
  id: string
  userId: string
  type: 'fuel' | 'parking'
  date: string
  amount: number
}

export interface ApiSettings {
  id: string
  userId: string
  minWage: number
  bonusRatePerHour: number
  trainingHourRate: number
  goodRateThreshold: number
}

export interface ApiStats {
  totalShiftsCount: number
  workingDays: number
  regularCount: number
  trainingCount: number
  regularHours: number
  trainingHours: number
  totalHours: number
  cashSalary: number
  regularTransfer: number
  trainingIncome: number
  bonus: number
  totalTransfer: number
  totalIncome: number
  totalFuel: number
  totalParking: number
  netProfit: number
  avgHourRate: number
  avgIncome: number
  avgBonus: number
}

// ── Frontend Shift shape (used by ShiftCard, ShiftForm) ────────────

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

// ── Adapter: map backend ApiShift → frontend Shift ─────────────────

export function toFrontendShift(s: ApiShift): Shift {
  const calc: ShiftCalcResult = {
    totalHours: s.totalHours,
    dailySalary: s.dailySalary,
    cash: s.cash,
    transfer: s.transfer,
    status: s.status,
    minWageApplied: s.minWageApplied,
    effectiveHourRate: s.hourRate ?? (s.totalHours > 0 ? s.dailySalary / s.totalHours : 0),
  }

  return {
    id: s.id,
    type: s.type,
    date: s.date,
    startTime: s.startTime,
    endTime: s.endTime,
    hourRate: s.hourRate != null ? String(s.hourRate) : '',
    dailySalary: String(s.dailySalary),
    calc,
  }
}