export type Locale = 'en' | 'he' | 'ar';
export type ShiftType = 'regular' | 'training';

export interface Shift {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
  isOvernight: boolean;
  hours: number;
  shiftType: ShiftType;
  inputMode: 'hourly' | 'daily';
  enteredRate?: number;
  dailySalary?: number;
  hourlyRate: number;
  fuel: number;
  parking: number;
  cash?: number;
  monthTransfer?: number;
  bonus: number;
  salary: number;
  netSalary: number;
  month: number;
  year: number;
}

export interface ShiftSummary {
  totalHours: number;
  totalFuel: number;
  totalParking: number;
  totalBonus: number;
  totalSalary: number;
  totalNetSalary: number;
  totalCash: number;
  totalMonthTransfer: number;
}

export interface MonthlyShiftsResponse {
  shifts: Shift[];
  summary: ShiftSummary;
  regularSummary: ShiftSummary;
  trainingSummary: ShiftSummary;
}

export interface MonthlyStatsRow {
  year: number;
  month: number;
  totalHours: number;
  regularShifts: number;
  trainingShifts: number;
  shiftSalary: number;
  trainingSalary: number;
  totalBonus: number;
  totalSalary: number;
  totalFuel: number;
  totalParking: number;
  netSalary: number;
}

export interface StatsTotals {
  totalHours: number;
  shiftSalary: number;
  trainingSalary: number;
  totalBonus: number;
  totalSalary: number;
  totalFuel: number;
  totalParking: number;
  netSalary: number;
}

export interface StatsResponse {
  monthlyRows: MonthlyStatsRow[];
  totals: StatsTotals;
}

export interface Settings {
  _id?: string;
  minWage: number;
  hoursThreshold: number;
  bonusPerHour: number;
  defaultFuel: number;
  defaultParking: number;
  defaultTrainingRate: number;
}

export interface ShiftFormData {
  date: string;
  startTime: string;
  endTime: string;
  shiftType: ShiftType;
  inputMode: 'hourly' | 'daily';
  enteredRate: string;
  dailySalary: string;
  fuel: string;
  parking: string;
}
