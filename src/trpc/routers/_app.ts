/**
 * This file contains the root router of your tRPC-backend
 */
import {baseProcedure, router} from '../trpc.server'
import {userRouter} from './user'
import {subscriptionDetailsRouter} from './subscription-detail'
import {stripeRouter} from './stripe'
import {progressRouter} from './progress'

export const appRouter = router({
  healthcheck: baseProcedure.query(() => 'yay!'),
  user: userRouter,
  subscriptionDetails: subscriptionDetailsRouter,
  stripe: stripeRouter,
  progress: progressRouter,
})

export type AppRouter = typeof appRouter
