import {initTRPC} from '@trpc/server'
import {TrpcContext} from '@/app/api/trpc/[trpc]/route'
import {transformer} from './transformer'

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

    const log = {
      event: 'trpc.call',
      path,
      type,
      ok: result.ok,
      duration_ms,
      user_id: trpcCtx.userId ?? null,
      has_token: !!trpcCtx.userToken,
      ...(rawInput && typeof rawInput === 'object'
        ? {input_keys: Object.keys(rawInput as Record<string, unknown>)}
        : {}),
      ...(!result.ok && 'error' in result
        ? {error_code: (result as any).error?.code}
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
