// hooks/useExpenses.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { ApiExpense } from '@/lib/types'
import { Expense } from '@/components/expenses/ExpenseCard'
import { ExpenseFormData } from '@/components/expenses/ExpenseForm'

const key = (year: number, month: number) => ['expenses', year, month]

async function fetchExpenses(year: number, month: number): Promise<Expense[]> {
  const res = await api.get('/expenses', { params: { year, month } })
  return res.data as ApiExpense[]
}

export function useExpenses(year: number, month: number) {
  return useQuery({
    queryKey: key(year, month),
    queryFn: () => fetchExpenses(year, month),
  })
}

export function useCreateExpense(year: number, month: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: ExpenseFormData) =>
      api.post('/expenses', {
        type: data.type,
        date: data.date,
        amount: parseFloat(data.amount),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: key(year, month) }),
  })
}

export function useUpdateExpense(year: number, month: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ExpenseFormData }) =>
      api.put(`/expenses/${id}`, {
        type: data.type,
        date: data.date,
        amount: parseFloat(data.amount),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: key(year, month) }),
  })
}

export function useDeleteExpense(year: number, month: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/expenses/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: key(year, month) }),
  })
}