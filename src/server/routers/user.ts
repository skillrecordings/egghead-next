/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */
import {router, baseProcedure} from '../trpc'
import {z} from 'zod'
import {ACCESS_TOKEN_KEY} from '../../utils/auth'

export const userRouter = router({
  current: baseProcedure.query(async ({input, ctx}) => {
    // we want to load the token from cookie
    // could also pass in here, but cookie
    // is secure HTTP only so let's use it
    const token = ctx.req?.cookies[ACCESS_TOKEN_KEY]

    if (!token) return null

    // the token we have is actually an oath doorkeeper token
    // and not the token prop on the user 🤡
    // we can get the user from the token, load their account users
    // and finally load the account
    // on the rails side we use the Rolify, which complicates this
    // but we could bring roles in and maybe query for them that way
    // because in this case we aren't going to verify account
    // ownership, just that this user is associated with the account
    const userToken = await ctx.prisma.oathAccessToken.findFirst({
      where: {
        token,
      },
      select: {
        user: {
          include: {
            account_users: {
              select: {
                account: true,
              },
            },
          },
        },
      },
    })

    return userToken?.user || null
  }),
})
