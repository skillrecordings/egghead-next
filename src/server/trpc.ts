import {initTRPC} from '@trpc/server'
import {TrpcContext} from '@/app/api/trpc/[trpc]/route'
import {transformer} from './transformer'

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
