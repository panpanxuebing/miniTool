import { computed, ref, watch } from 'vue'
import { createId, formatYMD } from '@src/utils'

export type MoneyExpense = {
  id: string
  text: string
  /** YYYY-MM-DD */
  date: string
  amount: number
  createdAt: number
}

const STORAGE_KEY = 'money-expenses-v1'

function safeParseExpenses(raw: string | null): MoneyExpense[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .map((t) => {
        const createdAt = Number(t.createdAt ?? Date.now())
        return {
          id: String(t.id ?? createId('e')),
          text: String(t.text ?? ''),
          date: String(t.date ?? formatYMD(createdAt)),
          amount: Number(t.amount ?? 0),
          createdAt,
        } satisfies MoneyExpense
      })
      .filter((t) => t.text.trim().length > 0 && t.amount > 0)
  } catch {
    return []
  }
}

export function useMoneyExpenses() {
  const expenses = ref<MoneyExpense[]>(safeParseExpenses(localStorage.getItem(STORAGE_KEY)))

  watch(
    expenses,
    (next) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    },
    { deep: true },
  )

  const totalExpenseAmount = computed(() =>
    expenses.value.reduce((sum, e) => sum + (e.amount > 0 ? e.amount : 0), 0),
  )

  const sortedExpenses = computed(() => {
    return [...expenses.value].sort((a, b) => b.createdAt - a.createdAt)
  })

  function addExpense(text: string, date: string, amount: number) {
    const trimmed = text.trim()
    if (!trimmed) return
    const parsedAmount = Number(amount)
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) return

    const createdAt = Date.now()
    const safeDate = date?.trim() ? date.trim() : formatYMD(createdAt)

    expenses.value.unshift({
      id: createId('e'),
      text: trimmed,
      date: safeDate,
      amount: parsedAmount,
      createdAt,
    })
  }

  function updateExpense(id: string, nextText: string, nextDate: string, nextAmount: number) {
    const t = expenses.value.find((x) => x.id === id)
    if (!t) return

    const trimmed = nextText.trim()
    if (trimmed) t.text = trimmed

    t.date = nextDate?.trim() ? nextDate.trim() : t.date

    const parsedAmount = Number(nextAmount)
    if (Number.isFinite(parsedAmount) && parsedAmount > 0) t.amount = parsedAmount
  }

  function removeExpense(id: string) {
    expenses.value = expenses.value.filter((e) => e.id !== id)
  }

  return {
    expenses,
    sortedExpenses,
    totalExpenseAmount,
    addExpense,
    updateExpense,
    removeExpense,
  }
}
