type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export type LogContext = {
  request_id?: string
  route?: string
  page?: string
  course_slug?: string
  lesson_slug?: string
}

const SAMPLE_RATE = Number(process.env.EGGHEAD_LOG_SAMPLE_RATE ?? '1')

function shouldSample(level: LogLevel) {
  if (level === 'warn' || level === 'error') return true
  if (Number.isNaN(SAMPLE_RATE) || SAMPLE_RATE >= 1) return true
  if (SAMPLE_RATE <= 0) return false
  return Math.random() < SAMPLE_RATE
}

export function logEvent(
  level: LogLevel,
  event: string,
  data: Record<string, unknown> = {},
  context: LogContext = {},
): void {
  try {
    if (!shouldSample(level)) return
    const payload = {
      event,
      ...context,
      ...data,
    }
    const line = JSON.stringify(payload)
    switch (level) {
      case 'debug':
        console.debug(line)
        break
      case 'info':
        console.log(line)
        break
      case 'warn':
        console.warn(line)
        break
      case 'error':
        console.error(line)
        break
    }
  } catch {
    // logging must never crash
  }
}

export async function timeEvent<T>(
  event: string,
  data: Record<string, unknown>,
  fn: () => Promise<T>,
  context: LogContext = {},
): Promise<T> {
  const start = Date.now()
  try {
    const result = await fn()
    logEvent('info', event, {
      ...context,
      ...data,
      duration_ms: Date.now() - start,
      ok: true,
    })
    return result
  } catch (error: any) {
    logEvent('error', event, {
      ...context,
      ...data,
      duration_ms: Date.now() - start,
      ok: false,
      error_message: error?.message,
    })
    throw error
  }
}
