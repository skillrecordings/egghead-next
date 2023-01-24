import {initTRPC} from '@trpc/server'
import superjson from 'superjson'
import {TrpcContext} from './trpc-context'

const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
})

export const router = t.router
export const baseProcedure = t.procedure
