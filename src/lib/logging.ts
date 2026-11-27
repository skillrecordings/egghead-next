/**
 * Shared structured logging utilities for egghead-next.
 *
 * Every wrapper emits structured JSON via console.log (success) or
 * console.error (failure). The log shape is consistent across tRPC,
 * Pages API routes, App Router routes, and SSR — making it trivial
 * to query in Axiom or any JSON log aggregator.
 *
 * Critical invariant: logging failures NEVER crash the underlying handler.
 */
import type {
  NextApiRequest,
  NextApiResponse,
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next'
import type {NextRequest} from 'next/server'
import * as serverCookie from 'cookie'
import {ACCESS_TOKEN_KEY, EGGHEAD_USER_COOKIE_KEY} from '@/config'

// ---------------------------------------------------------------------------
// Log shape
// ---------------------------------------------------------------------------

/** Structured log entry emitted by all wrappers. */
export type ServerLog = {
  event: string
  path: string
  method?: string
  duration_ms: number
  status?: number
  ok: boolean
  user_id: number | null
  has_token: boolean
  cache_header?: string
  cache_scope_header?: string
  cache_blocker_header?: string
  vary_header?: string
  has_set_cookie?: boolean
  result_type?: 'props' | 'redirect' | 'notFound'
  redirect_destination?: string
  error?: string
}

// ---------------------------------------------------------------------------
// User context extraction
// ---------------------------------------------------------------------------

type UserContext = {
  user_id: number | null
  has_token: boolean
}

function readHeaderValue(value: unknown): string | undefined {
  if (typeof value === 'string') return value
  if (Array.isArray(value)) return value.join(', ')
  return undefined
}

function describeSSRResult(
  result: GetServerSidePropsResult<Record<string, any>>,
): Pick<ServerLog, 'result_type' | 'redirect_destination'> {
  if ('redirect' in result) {
    return {
      result_type: 'redirect',
      redirect_destination: result.redirect.destination,
    }
  }

  if ('notFound' in result && result.notFound) {
    return {result_type: 'notFound'}
  }

  return {result_type: 'props'}
}

/** Cookie the App Router download route reads the egghead token from. */
export const EGGHEAD_TOKEN_COOKIE_KEY = 'egghead_token'

/** True when the Authorization header carries a non-empty Bearer token. */
export function hasBearerToken(authHeader?: string | null): boolean {
  if (!authHeader) return false
  if (!authHeader.toLowerCase().startsWith('bearer ')) return false
  return authHeader.slice(7).trim().length > 0
}

/**
 * Extract user identity from cookies and the Authorization header.
 *
 * `user_id` comes only from the non-secret `eh_user` cookie; tokens are
 * never decoded or verified here. `has_token` is true when any token is
 * present: the `eh_token_2020_11_22` or `egghead_token` cookie, or a
 * Bearer header. Unrelated cookies never hide a Bearer header.
 *
 * NEVER throws — returns a safe default on any error.
 */
export function extractUserContext(
  cookieHeader?: string | null,
  authHeader?: string | null,
): UserContext {
  try {
    let userId: number | null = null
    let hasCookieToken = false

    if (cookieHeader) {
      try {
        const cookies = serverCookie.parse(cookieHeader)

        const rawUser = cookies[EGGHEAD_USER_COOKIE_KEY]
        if (rawUser) {
          try {
            const parsed = JSON.parse(decodeURIComponent(rawUser))
            if (parsed && typeof parsed.id === 'number') {
              userId = parsed.id
            }
          } catch {
            // malformed cookie — swallow
          }
        }

        hasCookieToken =
          !!cookies[ACCESS_TOKEN_KEY] || !!cookies[EGGHEAD_TOKEN_COOKIE_KEY]
      } catch {
        // malformed cookie header — still check the Authorization header
      }
    }

    return {
      user_id: userId,
      has_token: hasCookieToken || hasBearerToken(authHeader),
    }
  } catch {
    return {user_id: null, has_token: false}
  }
}

// ---------------------------------------------------------------------------
// Pages Router API wrapper
// ---------------------------------------------------------------------------

type PagesApiHandler = (
  req: NextApiRequest,
  res: NextApiResponse,
) => void | Promise<void>

/**
 * Wrap a Pages Router API handler with structured logging.
 *
 * Measures wall-clock duration, extracts user context from cookies,
 * and emits a single JSON log line on completion or failure.
 *
 * On uncaught errors, responds with 500 if headers haven't been sent,
 * then re-throws so Next.js error handling still fires.
 */
export function withPagesApiLogging(handler: PagesApiHandler): PagesApiHandler {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const start = performance.now()
    let userCtx: UserContext = {user_id: null, has_token: false}

    try {
      userCtx = extractUserContext(
        req.headers.cookie,
        req.headers.authorization,
      )
    } catch {
      // never crash on context extraction
    }

    try {
      await handler(req, res)

      try {
        const log: ServerLog = {
          event: 'api.call',
          method: req.method,
          path: req.url ?? '/',
          duration_ms: Math.round(performance.now() - start),
          status: res.statusCode,
          ok: res.statusCode < 400,
          user_id: userCtx.user_id,
          has_token: userCtx.has_token,
        }
        if (log.ok) {
          console.log(JSON.stringify(log))
        } else {
          console.error(JSON.stringify(log))
        }
      } catch {
        // logging itself must never crash
      }
    } catch (err) {
      try {
        const log: ServerLog = {
          event: 'api.call',
          method: req.method,
          path: req.url ?? '/',
          duration_ms: Math.round(performance.now() - start),
          status: 500,
          ok: false,
          user_id: userCtx.user_id,
          has_token: userCtx.has_token,
          error: err instanceof Error ? err.message : String(err),
        }
        console.error(JSON.stringify(log))
      } catch {
        // swallow
      }

      if (!res.headersSent) {
        res.status(500).json({error: 'Internal Server Error'})
      } else {
        throw err
      }
    }
  }
}

// ---------------------------------------------------------------------------
// App Router API wrapper
// ---------------------------------------------------------------------------

type AppRouteHandler = (
  req: NextRequest,
  context?: any,
) => Response | Promise<Response>

/**
 * Wrap an App Router route handler with structured logging.
 *
 * Same log shape as Pages API, adapted for the Web Request/Response API.
 * The second argument (route context with params) is passed through
 * untouched.
 */
export function withAppApiLogging(handler: AppRouteHandler): AppRouteHandler {
  return async (req: NextRequest, context?: any) => {
    const start = performance.now()
    let userCtx: UserContext = {user_id: null, has_token: false}

    try {
      userCtx = extractUserContext(
        req.headers.get('cookie'),
        req.headers.get('authorization'),
      )
    } catch {
      // never crash on context extraction
    }

    try {
      const response = await handler(req, context)

      try {
        const log: ServerLog = {
          event: 'api.call',
          method: req.method,
          path: new URL(req.url).pathname,
          duration_ms: Math.round(performance.now() - start),
          status: response.status,
          ok: response.ok,
          user_id: userCtx.user_id,
          has_token: userCtx.has_token,
        }
        if (log.ok) {
          console.log(JSON.stringify(log))
        } else {
          console.error(JSON.stringify(log))
        }
      } catch {
        // logging must never crash
      }

      return response
    } catch (err) {
      try {
        const log: ServerLog = {
          event: 'api.call',
          method: req.method,
          path: new URL(req.url).pathname,
          duration_ms: Math.round(performance.now() - start),
          status: 500,
          ok: false,
          user_id: userCtx.user_id,
          has_token: userCtx.has_token,
          error: err instanceof Error ? err.message : String(err),
        }
        console.error(JSON.stringify(log))
      } catch {
        // swallow
      }

      throw err
    }
  }
}

// ---------------------------------------------------------------------------
// Static props (getStaticProps) wrapper
// ---------------------------------------------------------------------------

/**
 * Wrap getStaticProps with structured logging.
 *
 * Measures build/ISR duration and logs the slug + outcome so we can
 * query Axiom for failed static regenerations without relying on the
 * generic Next.js error page (which logs nothing useful).
 *
 * On error: logs with ok:false and re-throws so Next.js handles
 * fallback or error propagation as normal.
 */
export function withStaticPropsLogging<
  P extends Record<string, any> = Record<string, any>,
>(gsp: GetStaticProps<P>): GetStaticProps<P> {
  return async (
    context: GetStaticPropsContext,
  ): Promise<GetStaticPropsResult<P>> => {
    const start = performance.now()

    // Build a best-effort path string from params
    const params = context.params ?? {}
    const paramStr = Object.entries(params)
      .map(([k, v]) => `${k}=${Array.isArray(v) ? v.join('/') : v}`)
      .join('&')

    try {
      const result = await gsp(context)
      const durationMs = Math.round(performance.now() - start)

      try {
        const log = {
          event: 'static_props.render',
          params: paramStr,
          duration_ms: durationMs,
          ok: true,
          is_not_found: 'notFound' in result && !!(result as any).notFound,
          is_redirect: 'redirect' in result,
        }
        console.log(JSON.stringify(log))
      } catch {
        // logging must never crash
      }

      return result
    } catch (err) {
      const durationMs = Math.round(performance.now() - start)

      try {
        const log = {
          event: 'static_props.render',
          params: paramStr,
          duration_ms: durationMs,
          ok: false,
          error: err instanceof Error ? err.message : String(err),
          stack:
            err instanceof Error
              ? err.stack?.split('\n').slice(0, 5).join(' | ')
              : undefined,
        }
        console.error(JSON.stringify(log))
      } catch {
        // swallow
      }

      throw err
    }
  }
}

// ---------------------------------------------------------------------------
// SSR (getServerSideProps) wrapper
// ---------------------------------------------------------------------------

/**
 * Wrap getServerSideProps with structured logging.
 *
 * Measures render duration, extracts user context, and captures the
 * Cache-Control response header for observability into caching behavior.
 *
 * On error: logs with ok:false and re-throws so Next.js renders the
 * error page as normal.
 */
export function withSSRLogging(gssp: GetServerSideProps): GetServerSideProps {
  return async (
    context: GetServerSidePropsContext,
  ): Promise<GetServerSidePropsResult<Record<string, any>>> => {
    const start = performance.now()
    let userCtx: UserContext = {user_id: null, has_token: false}

    try {
      userCtx = extractUserContext(
        context.req.headers.cookie,
        context.req.headers.authorization,
      )
    } catch {
      // never crash on context extraction
    }

    try {
      const result = await gssp(context)
      const durationMs = Math.round(performance.now() - start)

      try {
        const cacheHeader = readHeaderValue(
          context.res.getHeader('Cache-Control'),
        )
        const cacheScopeHeader = readHeaderValue(
          context.res.getHeader('x-egghead-cache-scope'),
        )
        const cacheBlockerHeader = readHeaderValue(
          context.res.getHeader('x-egghead-cache-blocker'),
        )
        const varyHeader = readHeaderValue(context.res.getHeader('Vary'))
        const hasSetCookie = Boolean(context.res.getHeader('Set-Cookie'))

        const log: ServerLog = {
          event: 'ssr.render',
          path: context.resolvedUrl,
          duration_ms: durationMs,
          ok: true,
          user_id: userCtx.user_id,
          has_token: userCtx.has_token,
          cache_header: cacheHeader,
          cache_scope_header: cacheScopeHeader,
          cache_blocker_header: cacheBlockerHeader,
          vary_header: varyHeader,
          has_set_cookie: hasSetCookie,
          ...describeSSRResult(result),
        }
        console.log(JSON.stringify(log))
      } catch {
        // logging must never crash
      }

      return result
    } catch (err) {
      const durationMs = Math.round(performance.now() - start)

      try {
        const log: ServerLog = {
          event: 'ssr.render',
          path: context.resolvedUrl,
          duration_ms: durationMs,
          ok: false,
          user_id: userCtx.user_id,
          has_token: userCtx.has_token,
          error: err instanceof Error ? err.message : String(err),
        }
        console.error(JSON.stringify(log))
      } catch {
        // swallow
      }

      throw err
    }
  }
}
