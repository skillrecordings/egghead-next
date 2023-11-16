import {z} from 'zod'
import slugify from 'slugify'
import {customAlphabet} from 'nanoid'
import {groupBy} from 'lodash'
import {v4} from 'uuid'
import {baseProcedure, router} from '../trpc'
import {sanityWriteClient} from '@/utils/sanity-server'
import {getAllTips, getTip, getCoursesRelatedToTip, TipSchema} from '@/lib/tips'
import {getAbilityFromToken} from '@/server/ability'
import gql from 'graphql-tag'
import graphqlConfig from '@/lib/config'
import {GraphQLClient} from 'graphql-request'
import {inngest} from '@/inngest/inngest.server'
import groq from 'groq'

export const tipsRouter = router({
  create: baseProcedure
    .input(
      z.object({
        title: z.string(),
        body: z.string().optional(),
        slug: z.string().optional(),
        awsFilename: z.string(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      if (!ctx?.userToken) return new Response('Unauthorized', {status: 401})
      const ability = await getAbilityFromToken(ctx?.userToken)

      const {title, body, slug, awsFilename} = input

      if (ability.can('upload', 'Video')) {
        const videoResourceId = v4()

        const videoResource = {
          _id: videoResourceId,
          _type: 'videoResource',
          filename: `${slugify(title.toLowerCase())}-video-resource`,
          originalVideoUrl: awsFilename,
        }

        const tipSlug = slugify(`${title}`.toLowerCase(), {
          remove: /[*+~.()'"!:@]/g,
        })

        const {instructor_id: instructorId} = JSON.parse(
          ctx.req?.cookies.get('eh_user')?.value ?? "{instructor_id: ''}",
        )

        let sanityInstructorId = await sanityWriteClient.fetch(groq`
          *[_type == 'collaborator' && eggheadInstructorId == '${instructorId}'][0] {
            _id,
          }
        `)

        const tip = {
          _id: v4(),
          _type: 'tip',
          title,
          body,
          accessLevel: 'free',
          slug: {current: tipSlug},
          state: 'new',
          collaborators: [
            {
              _key: v4(),
              _type: 'reference',
              _ref: sanityInstructorId._id,
            },
          ],
        }
        await sanityWriteClient
          .createOrReplace(tip)
          .then((res) => console.log(res))

        // await inngest.send({
        //   name: VIDEO_UPLOADED_EVENT,
        //   data: {
        //     originalMediaUrl: awsFilename,
        //     fileName: `${slugify(title.toLowerCase())}-video-resource`,
        //     title: `${slugify(title.toLowerCase())}-video-resource`,
        //     moduleSlug: tip._id,
        //   },
        // })
      }

      return new Response('Unauthorized', {status: 401})
    }),
  update: baseProcedure
    .input(
      z.object({
        slug: z.string(),
        body: z.string().optional().nullable(),
        title: z.string().optional(),
        _id: z.string(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const ability = await getAbilityFromToken(ctx?.userToken)

      if (ability.can('create', 'Content')) {
        const tip = await sanityWriteClient
          .patch(input._id)
          .set({
            title: input.title,
            body: input.body,
            slug: {
              current: input.slug,
            },
          })
          .commit()
        return await getTip(tip.slug.current)
      }

      throw new Error('Unauthorized')
    }),
  published: baseProcedure
    .input(z.object({limit: z.number().optional()}).optional())
    .query(async ({input}) => {
      const tips = await getAllTips({onlyPublished: true, limit: input?.limit})

      return tips
    }),
  all: baseProcedure
    .input(
      z
        .object({
          grouped: z.boolean().optional(),
        })
        .optional(),
    )
    .query(async ({input}) => {
      const tips = await getAllTips({onlyPublished: false})

      const tipGroups = groupBy(tips, 'state')
      const tipGroupsArray = Object.entries(tipGroups).map(([key, value]) => {
        return {state: key, tips: value.map((t) => TipSchema.parse(t))}
      })
      return tipGroupsArray.reverse()
    }),
  bySlug: baseProcedure
    .input(
      z.object({
        slug: z.string(),
      }),
    )
    .query(async ({ctx, input}) => {
      const lesson = await getTip(input.slug)

      if (!lesson) {
        throw new Error('Could not find lesson')
      }

      return lesson
    }),
  relatedContent: baseProcedure
    .input(
      z.object({
        slug: z.string(),
      }),
    )
    .query(async ({ctx, input}) => {
      const lesson = await getCoursesRelatedToTip(input.slug)

      return lesson
    }),
  markTipComplete: baseProcedure
    .input(
      z.object({
        tipId: z.number(),
      }),
    )
    .mutation(async ({input, ctx}) => {
      const token = ctx?.userToken

      if (!token) return null
      const {tipId} = input

      const headers = {
        Authorization: `Bearer ${token}`,
        'X-SITE-CLIENT': process.env.NEXT_PUBLIC_CLIENT_ID as string,
        'Content-Type': 'application/json',
      }
      // This is posting to /watch/download since it creates the proper amount of segments watched on the lesson view where /watch/manual_complete does not.
      let res = await fetch(
        `${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/watch/download`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify({
            lesson_view: {
              lesson_id: tipId,
            },
          }),
        },
      ).then((res) => res.json())

      if (res?.complete_url) {
        const res2 = await fetch(res.complete_url, {
          method: 'PUT',
          headers,
          body: JSON.stringify({
            id: tipId,
          }),
        }).then((res) => res.json())
        return res2
      }

      return res
    }),
  loadTipProgress: baseProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({input, ctx}) => {
      const token = ctx?.userToken
      if (!token) return null

      const {id} = input

      const query = gql`
        query getTipCompletion($id: String!) {
          lesson_by_id(id: $id) {
            id
            completed
          }
        }
      `
      const graphQLClient = new GraphQLClient(graphqlConfig.graphQLEndpoint, {
        headers: graphqlConfig.headers,
      })
      graphQLClient.setHeader('Authorization', `Bearer ${token}`)

      const variables = {
        id: String(id),
      }
      const {lesson_by_id} = await graphQLClient.request(query, variables)

      return {tipCompleted: lesson_by_id?.completed as boolean}
    }),
})
