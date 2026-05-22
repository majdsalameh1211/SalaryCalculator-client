import { Settings } from '@/store/settingsStore'

export type ShiftType = 'regular' | 'training'
export type ShiftStatus = 'red' | 'yellow' | 'green' | 'training'

export interface ShiftCalcInput {
  type: ShiftType
  startTime: string // "HH:mm"
  endTime: string   // "HH:mm"
  hourRate?: number
  dailySalary?: number
  settings: Settings
}

export interface ShiftCalcResult {
  totalHours: number
  effectiveHourRate: number
  dailySalary: number
  cash: number
  transfer: number
  status: ShiftStatus
  minWageApplied: boolean
}

export function calcHours(startTime: string, endTime: string): number {
  const [sh, sm] = startTime.split(':').map(Number)
  const [eh, em] = endTime.split(':').map(Number)
  const startMins = sh * 60 + sm
  let endMins = eh * 60 + em
  if (endMins <= startMins) endMins += 24 * 60 // overnight shift
  return Math.round(((endMins - startMins) / 60) * 100) / 100
}

export function calcShift(input: ShiftCalcInput): ShiftCalcResult {
  const { type, startTime, endTime, hourRate, dailySalary, settings } = input
  const totalHours = calcHours(startTime, endTime)

  if (type === 'training') {
    const rate = settings.trainingHourRate
    const salary = Math.round(totalHours * rate * 100) / 100
    return {
      totalHours,
      effectiveHourRate: rate,
      dailySalary: salary,
      cash: 0,
      transfer: salary,
      status: 'training',
      minWageApplied: false,
    }
  }

  // Regular shift
  let effectiveRate: number
  let computedSalary: number

  if (dailySalary && dailySalary > 0) {
    // Entered daily salary directly
    computedSalary = dailySalary
    effectiveRate = totalHours > 0 ? dailySalary / totalHours : 0
  } else if (hourRate && hourRate > 0) {
    effectiveRate = hourRate
    computedSalary = hourRate * totalHours
  } else {
    effectiveRate = 0
    computedSalary = 0
  }

  // Apply minimum wage
  let minWageApplied = false
  if (effectiveRate < settings.minWage) {
    effectiveRate = settings.minWage
    computedSalary = effectiveRate * totalHours
    minWageApplied = true
  }

  computedSalary = Math.round(computedSalary * 100) / 100
  const cash = Math.round((computedSalary / 2) * 100) / 100
  const transfer = Math.round((computedSalary / 2) * 100) / 100

  // Status
  let status: ShiftStatus
  if (minWageApplied) {
    status = 'red'
  } else if (effectiveRate >= settings.goodRateThreshold) {
    status = 'green'
  } else {
    status = 'yellow'
  }

  return {
    totalHours,
    effectiveHourRate: Math.round(effectiveRate * 100) / 100,
    dailySalary: computedSalary,
    cash,
    transfer,
    status,
    minWageApplied,
  }
}

export function calcMonthlyBonus(totalHours: number, bonusRate: number): number {
  return Math.round(totalHours * bonusRate * 100) / 100
}

export function formatHours(hours: number): string {
  const h = Math.floor(hours)
  const m = Math.round((hours - h) * 60)
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

export function formatCurrency(amount: number, currency = '₪'): string {
  return `${currency}${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
}
