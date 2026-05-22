// hooks/useStats.ts
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { ApiStats } from '@/lib/types'

async function fetchStats(year: number, month?: number): Promise<ApiStats> {
  const res = await api.get('/stats', {
    params: month !== undefined ? { year, month } : { year },
  })
  return res.data
}

export function useStats(year: number, month?: number) {
  return useQuery({
    queryKey: ['stats', year, month],
    queryFn: () => fetchStats(year, month),
  })
}