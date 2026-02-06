/**
 * Frontend debug logger for agent-browser consumption.
 *
 * Stores structured events in `window.__DEBUG_LOG` as a ring buffer.
 * Zero overhead when nobody reads it -- just fills a bounded array.
 *
 * Usage from agent-browser:
 *   agent-browser eval "JSON.stringify(window.__DEBUG_LOG, null, 2)"
 *   agent-browser eval "JSON.stringify(window.__DEBUG_LOG.filter(e => e.event.startsWith('js.')), null, 2)"
 *   agent-browser eval "JSON.stringify(window.__DEBUG_LOG.filter(e => e.event.startsWith('route.')), null, 2)"
 *   agent-browser eval "JSON.stringify(window.__DEBUG_LOG.slice(-10), null, 2)"
 */

declare global {
  interface Window {
    __DEBUG_LOG: DebugEvent[]
  }
}

export type DebugEvent = {
  t: number // timestamp (Date.now())
  event: string // event type
  [key: string]: any // arbitrary payload
}

const MAX_EVENTS = 500

/** Push a structured event to the debug log ring buffer. */
export function debugLog(event: string, data?: Record<string, any>): void {
  if (typeof window === 'undefined') return
  if (!window.__DEBUG_LOG) window.__DEBUG_LOG = []

  window.__DEBUG_LOG.push({t: Date.now(), event, ...data})

  // Ring buffer -- evict oldest when full
  if (window.__DEBUG_LOG.length > MAX_EVENTS) {
    window.__DEBUG_LOG = window.__DEBUG_LOG.slice(-MAX_EVENTS)
  }
}

/**
 * Initialize debug logger -- call once on app mount. Sets up:
 * - window.onerror handler
 * - unhandledrejection handler
 * - Array initialization
 */
export function initDebugLogger(): void {
  if (typeof window === 'undefined') return
  if (!window.__DEBUG_LOG) window.__DEBUG_LOG = []

  // Capture uncaught errors
  const originalOnError = window.onerror
  window.onerror = (message, source, lineno, colno, error) => {
    debugLog('js.error', {
      message: String(message),
      source,
      line: lineno,
      col: colno,
      stack: error?.stack?.split('\n').slice(0, 5).join('\n'),
    })
    if (originalOnError)
      return (originalOnError as OnErrorEventHandler)(
        message,
        source,
        lineno,
        colno,
        error,
      )
    return false
  }

  // Capture unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    debugLog('js.unhandled_rejection', {
      reason:
        event.reason instanceof Error
          ? event.reason.message
          : String(event.reason),
      stack: event.reason?.stack?.split('\n').slice(0, 5).join('\n'),
    })
  })
}

/** Log a route change event. Call from Next.js router event handlers. */
export function debugLogRouteChange(
  type: 'start' | 'complete' | 'error',
  url: string,
  extra?: Record<string, any>,
): void {
  debugLog('route.' + type, {url, ...extra})
}
