export type Transaction = {
  id: number
  type: 'income' | 'expense'
  category: string
  amount: number
  date: string
}

export type Transactions = Transaction[]
