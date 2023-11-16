import {fetchRequestHandler} from '@trpc/server/adapters/fetch'
import type {NextRequest} from 'next/server'
import {appRouter} from '@/server/routers/_app'
import {prisma} from '@/server/prisma'
import {ACCESS_TOKEN_KEY} from '@/utils/auth'

type Prisma = typeof prisma

export type TrpcContext = {
  links?: any
  transformer?: any
  prisma: Prisma
  req?: NextRequest | null
  userId?: number | undefined
  userToken?: string | undefined
}

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => {
      return {
        prisma,
        req,
        userId: JSON.parse(req?.cookies?.get('eh_user')?.value || '{}').id,
        userToken: req?.cookies?.get(ACCESS_TOKEN_KEY)?.value,
      }
    },
    onError({error}) {
      if (error.code === 'INTERNAL_SERVER_ERROR') {
        console.error('Caught TRPC error:', error)
      }
    },
  })

export {handler as GET, handler as POST}
