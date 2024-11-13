/**
 * This file contains the root router of your tRPC-backend
 */
import {baseProcedure, router} from '../trpc'
import {userRouter} from './user'
import {subscriptionDetailsRouter} from './subscription-detail'
import {stripeRouter} from './stripe'
import {progressRouter} from './progress'
import {instructorRouter} from './instructor'
import {topicRouter} from './topics'
import {customerIORouter} from './customer-io'
import {tipsRouter} from './tips'
import {lessonRouter} from './lesson'
import {likesRouter} from './likes'
import {courseRouter} from './course'

export const appRouter = router({
  healthcheck: baseProcedure.query(() => 'yay!'),
  user: userRouter,
  instructor: instructorRouter,
  subscriptionDetails: subscriptionDetailsRouter,
  stripe: stripeRouter,
  progress: progressRouter,
  topics: topicRouter,
  customerIO: customerIORouter,
  tips: tipsRouter,
  lesson: lessonRouter,
  likes: likesRouter,
  course: courseRouter,
})

export type AppRouter = typeof appRouter
