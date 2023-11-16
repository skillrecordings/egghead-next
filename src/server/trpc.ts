import {initTRPC} from '@trpc/server'
import {TrpcContext} from '@/app/api/trpc/[trpc]/route'
import {transformer} from './transformer'

const t = initTRPC.context<TrpcContext>().create({
  transformer,
  errorFormatter({shape}) {
    return shape
  },
})

/* 
Interesting idea to auth a procedure instead of doing all of the manually checks for userToken in each router
const isAuthed = t.middleware(async ({ ctx, next }) => {
  if (!ctx.auth?.userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Not authenticated",
    });
  }

  return next({
    ctx: {
      ...ctx,
      auth: ctx.auth,
    },
  });
});

*/

export const router = t.router
export const baseProcedure = t.procedure
