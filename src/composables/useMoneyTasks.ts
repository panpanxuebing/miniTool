import { computed, ref, watch } from 'vue'
import { createId, formatYMD } from '@src/utils'

export type MoneyTask = {
  id: string
  text: string
  /** YYYY-MM-DD */
  date: string
  /** 该任务对应的存入金额（未完成时页面展示 0） */
  amount: number
  completed: boolean
  createdAt: number
}

const STORAGE_KEY = 'money-tasks-v1'

function safeParseMoneyTasks(raw: string | null): MoneyTask[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .map((t) => {
        const createdAt = Number(t.createdAt ?? Date.now())
        return {
          id: String(t.id ?? createId('m')),
          text: String(t.text ?? ''),
          date: String(t.date ?? formatYMD(createdAt)),
          amount: Number(t.amount ?? 0),
          completed: Boolean(t.completed),
          createdAt,
        } satisfies MoneyTask
      })
      .filter((t) => t.text.trim().length > 0)
  } catch {
    return []
  }
}

export function useMoneyTasks(defaultAmountPerTask = 0) {
  const tasks = ref<MoneyTask[]>(safeParseMoneyTasks(localStorage.getItem(STORAGE_KEY)))

  watch(
    tasks,
    (next) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    },
    { deep: true },
  )

  const completedCount = computed(() => tasks.value.filter((t) => t.completed).length)
  // “总金额”按“实际填写金额”计算：不管是否完成
  const totalAmount = computed(() => tasks.value.reduce((sum, t) => sum + (t.amount ?? 0), 0))

  const sortedTasks = computed(() => {
    return [...tasks.value].sort((a, b) => b.createdAt - a.createdAt)
  })

  function addTask(text: string, date: string, amount: number) {
    const trimmed = text.trim()
    if (!trimmed) return
    const createdAt = Date.now()

    const safeDate = date?.trim() ? date.trim() : formatYMD(createdAt)
    const parsedAmount = Number(amount)
    const safeAmount =
      Number.isFinite(parsedAmount) && parsedAmount >= 0 ? parsedAmount : defaultAmountPerTask

    tasks.value.unshift({
      id: createId('m'),
      text: trimmed,
      date: safeDate,
      amount: safeAmount,
      completed: false,
      createdAt,
    })
  }

  function toggleTask(id: string) {
    const t = tasks.value.find((x) => x.id === id)
    if (!t) return
    t.completed = !t.completed
  }

  function updateTask(id: string, nextText: string, nextDate: string, nextAmount: number) {
    const t = tasks.value.find((x) => x.id === id)
    if (!t) return

    const trimmed = nextText.trim()
    if (trimmed) t.text = trimmed

    const safeDate = nextDate?.trim() ? nextDate.trim() : t.date
    t.date = safeDate

    const parsedAmount = Number(nextAmount)
    if (Number.isFinite(parsedAmount) && parsedAmount >= 0) t.amount = parsedAmount
  }

  function removeTask(id: string) {
    tasks.value = tasks.value.filter((t) => t.id !== id)
  }

  return {
    tasks,
    sortedTasks,
    completedCount,
    totalAmount,
    addTask,
    toggleTask,
    updateTask,
    removeTask,
  }
}
