import {initTRPC} from '@trpc/server'
import {TrpcContext} from '@/app/api/trpc/[trpc]/route'
import {transformer} from './transformer'
import {ACCESS_TOKEN_KEY} from '@/utils/auth'

function fnv1a32(input: string): string {
  // Small, stable fingerprint for grouping high-cardinality strings in logs.
  // Output: 8-char hex (uint32).
  let hash = 2166136261
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return (hash >>> 0).toString(16).padStart(8, '0')
}

function sanitizeErrorMessage(input: unknown): string | null {
  if (input == null) return null
  const raw = typeof input === 'string' ? input : String(input)

  // Avoid leaking secrets/PII in logs.
  const redacted = raw
    .replace(/Bearer\\s+[A-Za-z0-9._\\-]+/g, 'Bearer [redacted]')
    .replace(/(sk|rk|pk)_(live|test)_[A-Za-z0-9]+/g, '[redacted_key]')
    .replace(
      /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}/g,
      '[redacted_email]',
    )

  const oneLine = redacted.replace(/\\s+/g, ' ').trim()
  if (!oneLine) return null
  const max = 300
  return oneLine.length > max ? `${oneLine.slice(0, max)}...` : oneLine
}

const t = initTRPC.context<TrpcContext>().create({
  transformer,
  errorFormatter({shape}) {
    return shape
  },
})

const logMiddleware = t.middleware(
  async ({path, type, next, ctx, rawInput}) => {
    const start = performance.now()
    const result = await next()
    const duration_ms = Math.round(performance.now() - start)
    const trpcCtx = ctx as TrpcContext

    const trpcError =
      !result.ok && 'error' in result ? (result as any).error : null
    const error_message = sanitizeErrorMessage(trpcError?.message)
    const error_code = trpcError?.code ?? null
    const error_name = trpcError?.name ?? null
    const error_fingerprint =
      error_message || error_code
        ? fnv1a32(`${String(error_code ?? '')}:${String(error_message ?? '')}`)
        : null

    // On errors, capture auth cookie state so we can distinguish
    // "no token at all" vs "stale token Rails rejected" vs "cookie mismatch".
    const is403 = !result.ok && error_message?.includes('Code: 403')
    let authDiag: Record<string, unknown> | undefined
    if (!result.ok && is403) {
      const cookies = trpcCtx.req?.cookies
      const hasAccessCookie = !!cookies?.get(ACCESS_TOKEN_KEY)?.value
      const hasUserCookie = !!cookies?.get('eh_user')?.value
      const tokenVal = trpcCtx.userToken
      authDiag = {
        auth_has_access_cookie: hasAccessCookie,
        auth_has_user_cookie: hasUserCookie,
        auth_token_len: tokenVal ? tokenVal.length : 0,
        // First 8 chars: enough to identify token generation/format, not a secret
        auth_token_prefix: tokenVal ? tokenVal.slice(0, 8) : null,
        auth_user_id_from_cookie: trpcCtx.userId ?? null,
      }
    }

    const log = {
      event: 'trpc.call',
      path,
      type,
      ok: result.ok,
      duration_ms,
      user_id: trpcCtx.userId ?? null,
      has_token: !!trpcCtx.userToken,
      request_id: trpcCtx.req?.headers?.get('x-egghead-request-id') ?? null,
      ...(rawInput && typeof rawInput === 'object'
        ? {input_keys: Object.keys(rawInput as Record<string, unknown>)}
        : {}),
      ...(!result.ok
        ? {
            error_code,
            error_name,
            error_message,
            error_fingerprint,
          }
        : {}),
      ...(authDiag ?? {}),
    }

    if (result.ok) {
      console.log(JSON.stringify(log))
    } else {
      console.error(JSON.stringify(log))
    }

    return result
  },
)

export const router = t.router
export const baseProcedure = t.procedure.use(logMiddleware)
