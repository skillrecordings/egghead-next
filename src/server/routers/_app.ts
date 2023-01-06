/**
 * This file contains the root router of your tRPC-backend
 */
import {baseProcedure, router} from '../trpc'
import {userRouter} from './user'

export const appRouter = router({
  healthcheck: baseProcedure.query(() => 'yay!'),
  user: userRouter,
})

export type AppRouter = typeof appRouter
