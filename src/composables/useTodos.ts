import { computed, ref, watch } from 'vue'
import { createId } from '@src/utils'

export type Todo = {
  id: string
  text: string
  completed: boolean
  createdAt: number
}

export type TodoFilter = 'all' | 'active' | 'completed'

const STORAGE_KEY = 'todos-v1'

function safeParseTodos(raw: string | null): Todo[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .map((t) => {
        const createdAt = Number(t.createdAt ?? Date.now())
        return {
          id: String(t.id ?? createId('t')),
          text: String(t.text ?? ''),
          completed: Boolean(t.completed),
          createdAt,
        } satisfies Todo
      })
      .filter((t) => t.text.trim().length > 0)
  } catch {
    return []
  }
}

// 单例：模块级 state + 单次 watch，避免多次调用重复注册 watcher
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

export function useTodos() {
  function addTodo(text: string) {
    const trimmed = text.trim()
    if (!trimmed) return
    todos.value.unshift({
      id: createId('t'),
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
