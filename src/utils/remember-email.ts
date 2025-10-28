const STORAGE_KEY = 'egghead_remembered_email'

export function getRememberedEmail(): string | null {
  if (typeof window === 'undefined') return null
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

export function setRememberedEmail(email: string): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, email)
  } catch {
    // Silently fail if localStorage is unavailable
  }
}

export function clearRememberedEmail(): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Silently fail if localStorage is unavailable
  }
}
