// hooks/useSettings.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { ApiSettings } from '@/lib/types'

const QUERY_KEY = ['settings']

async function fetchSettings(): Promise<ApiSettings> {
  const res = await api.get('/settings')
  return res.data
}

export function useSettings() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: fetchSettings,
    staleTime: 1000 * 60 * 10, // 10 min — settings rarely change
  })
}

export function useUpdateSettings() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<ApiSettings>) => api.put('/settings', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}