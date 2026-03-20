import { computed, ref, watch } from 'vue'

export type Todo = {
  id: string
  text: string
  completed: boolean
  createdAt: number
}

export type TodoFilter = 'all' | 'active' | 'completed'

const STORAGE_KEY = 'todos-v1'

function createId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const c = crypto as any
    return c.randomUUID() as string
  }
  return `t_${Math.random().toString(16).slice(2)}_${Date.now()}`
}

function safeParseTodos(raw: string | null): Todo[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .map((t) => ({
        id: String(t.id ?? createId()),
        text: String(t.text ?? ''),
        completed: Boolean(t.completed),
        createdAt: Number(t.createdAt ?? Date.now()),
      }))
      .filter((t) => t.text.trim().length > 0)
  } catch {
    return []
  }
}

export function useTodos() {
  const todos = ref<Todo[]>(safeParseTodos(localStorage.getItem(STORAGE_KEY)))
  const filter = ref<TodoFilter>('all')

  watch(
    todos,
    (next) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    },
    { deep: true },
  )

  const remainingCount = computed(() => todos.value.filter((t) => !t.completed).length)
  const completedCount = computed(() => todos.value.filter((t) => t.completed).length)

  const filteredTodos = computed(() => {
    if (filter.value === 'active') return todos.value.filter((t) => !t.completed)
    if (filter.value === 'completed') return todos.value.filter((t) => t.completed)
    return todos.value
  })

  function addTodo(text: string) {
    const trimmed = text.trim()
    if (!trimmed) return
    todos.value.unshift({
      id: createId(),
      text: trimmed,
      completed: false,
      createdAt: Date.now(),
    })
  }

  function toggleTodo(id: string) {
    const t = todos.value.find((x) => x.id === id)
    if (!t) return
    t.completed = !t.completed
  }

  function removeTodo(id: string) {
    todos.value = todos.value.filter((t) => t.id !== id)
  }

  function updateTodoText(id: string, nextText: string) {
    const trimmed = nextText.trim()
    if (!trimmed) return
    const t = todos.value.find((x) => x.id === id)
    if (!t) return
    t.text = trimmed
  }

  function clearCompleted() {
    todos.value = todos.value.filter((t) => !t.completed)
  }

  function setFilter(next: TodoFilter) {
    filter.value = next
  }

  return {
    todos,
    filter,
    filteredTodos,
    remainingCount,
    completedCount,
    addTodo,
    toggleTodo,
    removeTodo,
    updateTodoText,
    clearCompleted,
    setFilter,
  }
}
