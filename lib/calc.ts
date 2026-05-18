import { ShiftType } from '@/types';

export function calcHours(start: string, end: string): { hours: number; isOvernight: boolean } {
  if (!start || !end) return { hours: 0, isOvernight: false };
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  let startMins = sh * 60 + sm;
  let endMins = eh * 60 + em;
  let isOvernight = false;
  if (endMins <= startMins) { endMins += 24 * 60; isOvernight = true; }
  return { hours: parseFloat(((endMins - startMins) / 60).toFixed(2)), isOvernight };
}

export function calcShift(
  hours: number,
  shiftType: ShiftType,
  inputMode: 'hourly' | 'daily',
  enteredRate: number,
  dailySalary: number,
  fuel: number,
  parking: number,
  minWage: number,
  bonusPerHour: number,
  defaultTrainingRate: number
) {
  let hourlyRate: number;
  if (inputMode === 'daily') {
    hourlyRate = hours > 0 ? dailySalary / hours : minWage;
  } else if (shiftType === 'training') {
    hourlyRate = enteredRate > 0 ? enteredRate : defaultTrainingRate;
  } else {
    hourlyRate = Math.max(enteredRate || 0, minWage);
  }

  const bonus = parseFloat((hours * bonusPerHour).toFixed(2));

  if (shiftType === 'training') {
    const salary = parseFloat((hours * hourlyRate + bonus).toFixed(2));
    const netSalary = parseFloat((salary - fuel - parking).toFixed(2));
    return { hourlyRate, bonus, salary, netSalary, cash: 0, monthTransfer: 0 };
  } else {
    const cash = parseFloat((hours * hourlyRate / 2).toFixed(2));
    const monthTransfer = parseFloat((hours * bonusPerHour + cash).toFixed(2));
    const salary = parseFloat((monthTransfer + cash).toFixed(2));
    const netSalary = parseFloat((salary - fuel - parking).toFixed(2));
    return { hourlyRate, bonus, salary, netSalary, cash, monthTransfer };
  }
}

export function getShiftIndicator(
  shiftType: ShiftType,
  hourlyRate: number,
  hours: number,
  minWage: number,
  hoursThreshold: number,
  enteredRate?: number
): 'red' | 'yellow' | 'green' | 'blue' {
  if (shiftType === 'training') return 'blue';
  const rateToCheck = enteredRate !== undefined && enteredRate > 0 ? enteredRate : hourlyRate;
  if (rateToCheck < minWage) return 'red';
  if (hours <= hoursThreshold) return 'yellow';
  return 'green';
}

export function fmt(n: number) {
  return `₪${Math.round(n).toLocaleString('en-IL')}`;
}

export function fmtHours(h: number) {
  return `${h % 1 === 0 ? h : h.toFixed(1)}h`;
}
