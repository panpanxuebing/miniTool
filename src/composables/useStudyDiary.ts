import { computed, ref, watch } from 'vue'
import { createId, formatYMD } from '@src/utils'

export type StudyDiaryEntry = {
  id: string
  /** YYYY-MM-DD */
  date: string
  content: string
  createdAt: number
}

const STORAGE_KEY = 'study-diary-v1'

function safeParse(raw: string | null): StudyDiaryEntry[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .map((e) => {
        const createdAt = Number(e.createdAt ?? Date.now())
        return {
          id: String(e.id ?? createId('sd')),
          date: String(e.date ?? formatYMD(createdAt)),
          content: String(e.content ?? ''),
          createdAt,
        } satisfies StudyDiaryEntry
      })
      .filter((e) => e.content.trim().length > 0)
  } catch {
    return []
  }
}

export function useStudyDiary() {
  const entries = ref<StudyDiaryEntry[]>(safeParse(localStorage.getItem(STORAGE_KEY)))

  watch(
    entries,
    (next) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    },
    { deep: true },
  )

  /** 按日期从新到旧，同日按创建时间从新到旧 */
  const sortedEntries = computed(() => {
    return [...entries.value].sort((a, b) => {
      if (a.date !== b.date) return b.date.localeCompare(a.date)
      return b.createdAt - a.createdAt
    })
  })

  /** 按日期分组，日期降序 */
  const entriesByDate = computed(() => {
    const map = new Map<string, StudyDiaryEntry[]>()
    for (const e of sortedEntries.value) {
      const list = map.get(e.date) ?? []
      list.push(e)
      map.set(e.date, list)
    }
    return [...map.entries()].sort((a, b) => b[0].localeCompare(a[0]))
  })

  function addEntry(date: string, content: string) {
    const trimmed = content.trim()
    if (!trimmed) return
    const d = date?.trim() || formatYMD(Date.now())
    entries.value.unshift({
      id: createId('sd'),
      date: d,
      content: trimmed,
      createdAt: Date.now(),
    })
  }

  function updateEntry(id: string, nextContent: string) {
    const trimmed = nextContent.trim()
    if (!trimmed) return
    const e = entries.value.find((x) => x.id === id)
    if (!e) return
    e.content = trimmed
  }

  function removeEntry(id: string) {
    entries.value = entries.value.filter((e) => e.id !== id)
  }

  return {
    entries,
    sortedEntries,
    entriesByDate,
    addEntry,
    updateEntry,
    removeEntry,
  }
}
