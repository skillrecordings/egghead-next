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
  error?: string
}

// ---------------------------------------------------------------------------
// User context extraction
// ---------------------------------------------------------------------------

type UserContext = {
  user_id: number | null
  has_token: boolean
}

/**
 * Extract user identity from cookie or Authorization header.
 *
 * Parses the `eh_user` cookie for `user_id` and checks for the presence
 * of the access token cookie. Falls back to the Authorization header.
 *
 * NEVER throws — returns a safe default on any error.
 */
export function extractUserContext(
  cookieHeader?: string | null,
  authHeader?: string | null,
): UserContext {
  try {
    if (cookieHeader) {
      const cookies = serverCookie.parse(cookieHeader)

      let userId: number | null = null
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

      const hasToken = !!cookies[ACCESS_TOKEN_KEY]

      return {user_id: userId, has_token: hasToken}
    }

    // Fallback: Authorization header
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return {user_id: null, has_token: true}
    }

    return {user_id: null, has_token: false}
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
      // App Router uses req.cookies (RequestCookies API)
      let userId: number | null = null
      const rawUser = req.cookies.get(EGGHEAD_USER_COOKIE_KEY)?.value
      if (rawUser) {
        try {
          const parsed = JSON.parse(decodeURIComponent(rawUser))
          if (parsed && typeof parsed.id === 'number') {
            userId = parsed.id
          }
        } catch {
          // malformed cookie
        }
      }

      const hasToken = !!req.cookies.get(ACCESS_TOKEN_KEY)?.value
      userCtx = {user_id: userId, has_token: hasToken}
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
        const cacheHeader =
          (context.res.getHeader('Cache-Control') as string | undefined) ??
          undefined

        const log: ServerLog = {
          event: 'ssr.render',
          path: context.resolvedUrl,
          duration_ms: durationMs,
          ok: true,
          user_id: userCtx.user_id,
          has_token: userCtx.has_token,
          cache_header: cacheHeader,
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
