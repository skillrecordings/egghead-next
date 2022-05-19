import {NextApiRequest, NextApiResponse} from 'next'
import emailIsValid from 'utils/email-is-valid'
import {isEmpty} from 'lodash'

import {Prisma, PrismaClient} from '@prisma/client'

if (!process.env.EGGHEAD_SUPPORT_BOT_TOKEN) {
  throw new Error('no egghead support+bot token found')
}
const checkProStatus = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const {email} = req.body
    if (!emailIsValid(email)) {
      res.status(400).end()
    } else {
      const prisma = new PrismaClient()

      // Unfortunately, cannot do this at the moment until we have un-ignored
      // the `users_roles` model in `prisma/schema.prisma`. Be cause it doesn't
      // have a primary key, the Prisma Client isn't able to handle it.
      //
      // const getUser: object | null = await prisma.users.findMany({
      //   where: {
      //     email: email,
      //   },
      //   select: {
      //     email: true,
      //     first_name: true,
      //     users_roles: {
      //       select: {
      //         role_id: true,
      //         roles: {
      //           where: {
      //             name: 'pro',
      //           },
      //           select: {
      //             name: true,
      //           },
      //         },
      //       },
      //     },
      //   },
      // })

      const result: Array<object> = await prisma.$queryRaw(
        Prisma.sql`
        select users.email, roles.name
        from users
        join users_roles
          on users.id = users_roles.user_id
        join roles
          on roles.id = users_roles.role_id
        where users.email = ${email}
          and (roles.name = 'pro' or
               roles.name = 'instructor')
        `,
      )

      // if a user has at least one of the roles: `pro` or `instructor`, then
      // they are considered to have pro access.
      const hasProAccess = !isEmpty(result)

      res.status(200).json({hasProAccess})
    }
  } else {
    res.statusCode = 404
    res.end()
  }
}

export default checkProStatus
