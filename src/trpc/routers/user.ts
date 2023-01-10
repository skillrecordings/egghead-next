/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */
import {router, baseProcedure} from '../trpc.server'
import {z} from 'zod'
import {ACCESS_TOKEN_KEY} from '../../utils/auth'
import {loadCurrentUser} from '../../lib/users'

export const userRouter = router({
  current: baseProcedure.query(async ({input, ctx}) => {
    // we want to load the token from cookie
    // could also pass in here, but cookie
    // is secure HTTP only so let's use it
    const token = ctx.req?.cookies[ACCESS_TOKEN_KEY]

    if (!token) return null

    return await loadCurrentUser(token)
  }),
})
