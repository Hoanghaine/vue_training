import { ref, type Ref } from 'vue'
import type { Transaction } from '@/types/Transaction'
import api from './apiService'
import type { AxiosResponse } from 'axios'

export const getTransactions = (): Promise<AxiosResponse<Transaction[]>> => {
  return api.get<Transaction[]>('/transactions')
}

export const searchTransactions = (query: string): Promise<AxiosResponse<Transaction[]>> => {
  return api.get<Transaction[]>(`transactions/search?query=${encodeURIComponent(query)}`)
}
export const addTransaction = (data: Partial<Transaction>) => api.post('/transactions', data)
export const updateTransaction = (id: number, data: Partial<Transaction>) => {
  return api.put(`/transactions/${id}`, data)
}
export const deleteTransaction = (id: number) => api.delete(`/transactions/${id}`)
