export function createId(prefix = 't') {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const c = crypto as any
    return c.randomUUID() as string
  }
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`
}

export function formatYMD(ts: number) {
  const d = new Date(ts)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}
