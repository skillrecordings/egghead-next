const REQUEST_ID_KEY = 'egghead_request_id'

function generateId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function getClientRequestId(): string | undefined {
  if (typeof window === 'undefined') return undefined

  const existing =
    (globalThis as any).__EGGHEAD_REQUEST_ID ||
    window.sessionStorage.getItem(REQUEST_ID_KEY)

  if (existing) {
    ;(globalThis as any).__EGGHEAD_REQUEST_ID = existing
    return existing
  }

  const next = generateId()
  ;(globalThis as any).__EGGHEAD_REQUEST_ID = next
  try {
    window.sessionStorage.setItem(REQUEST_ID_KEY, next)
  } catch {}
  return next
}
