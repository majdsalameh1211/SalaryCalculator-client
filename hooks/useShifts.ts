// hooks/useShifts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { ApiShift, Shift, toFrontendShift } from '@/lib/types'
import { ShiftFormData } from '@/components/shifts/ShiftForm'

const key = (year: number, month: number) => ['shifts', year, month]

async function fetchShifts(year: number, month: number): Promise<Shift[]> {
  const res = await api.get('/shifts', { params: { year, month } })
  return (res.data as ApiShift[]).map(toFrontendShift)
}

export function useShifts(year: number, month: number) {
  return useQuery({
    queryKey: key(year, month),
    queryFn: () => fetchShifts(year, month),
  })
}

export function useCreateShift(year: number, month: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: ShiftFormData) =>
      api.post('/shifts', {
        type: data.type,
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        hourRate: data.hourRate ? parseFloat(data.hourRate) : undefined,
        dailySalary: data.dailySalary ? parseFloat(data.dailySalary) : undefined,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: key(year, month) }),
  })
}

export function useUpdateShift(year: number, month: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ShiftFormData }) =>
      api.put(`/shifts/${id}`, {
        type: data.type,
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        hourRate: data.hourRate ? parseFloat(data.hourRate) : undefined,
        dailySalary: data.dailySalary ? parseFloat(data.dailySalary) : undefined,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: key(year, month) }),
  })
}

export function useDeleteShift(year: number, month: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/shifts/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: key(year, month) }),
  })
}