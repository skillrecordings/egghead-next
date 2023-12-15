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
import {TIP_VIDEO_UPLOADED_EVENT} from '@/inngest/events/tips'
import groq from 'groq'
import {loadCurrentUser} from '@/lib/users'

export const tipsRouter = router({
  create: baseProcedure
    .input(
      z.object({
        s3Url: z.string(),
        fileName: z.string().nullable(),
        title: z.string(),
        description: z.string().optional().nullable(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      if (!ctx?.userToken) throw new Error('Unauthorized')
      const ability = await getAbilityFromToken(ctx?.userToken)

      if (ability.can('upload', 'Video')) {
        const newVideoResource = await sanityWriteClient.create({
          _id: `videoResource-${v4()}`,
          _type: 'videoResource',
          state: 'new',
          filename: input.fileName,
          originalVideoUrl: input.s3Url,
        })
        if (newVideoResource._id) {
          // control the id that is used so we can reference it immediately
          const id = v4()

          const nanoid = customAlphabet(
            '1234567890abcdefghijklmnopqrstuvwxyz',
            5,
          )
          const {instructor_id: instructorId} = await loadCurrentUser(
            ctx?.userToken,
          )
          if (!instructorId) throw new Error('Instructor ID not found')

          let sanityInstructor = await sanityWriteClient.fetch(groq`
          *[_type == 'collaborator' && eggheadInstructorId == '${instructorId}'][0] {
            _id,
          }`)
          if (!sanityInstructor)
            throw new Error('Sanity Instructor ID not found')

          const tipResource = await sanityWriteClient.create({
            _id: `tip-${id}`,
            _type: 'tip',
            title: input.title,
            body: input?.description,
            state: 'new',
            accessLevel: 'free',
            slug: {
              // since title is unique, we can use it as the slug with a random string
              current: `${slugify(input.title.toLowerCase())}~${nanoid()}`,
            },
            collaborators: [
              {
                _key: v4(),
                _type: 'reference',
                _ref: sanityInstructor._id,
              },
            ],
            resources: [
              {
                _key: v4(),
                _type: 'reference',
                _ref: newVideoResource._id,
              },
            ],
          })

          // load the complete tip from sanity so we can return it
          // we are reloading it because the query for `getTip` "normalizes"
          // the data and that's what we expect client-side
          const tip = await getTip(tipResource.slug.current)

          if (tip) {
            await inngest.send({
              name: TIP_VIDEO_UPLOADED_EVENT,
              data: {
                tipId: tip._id,
                videoResourceId: newVideoResource._id,
              },
            })
          }

          const parsedTip = TipSchema.safeParse(tip)

          if (parsedTip.success) {
            return parsedTip.data
          } else {
            throw new Error('Could not create tip')
          }
        } else {
          throw new Error('Could not create video resource')
        }
      }

      throw new Error('Unauthorized')
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
      if (process.env.NODE_ENV === 'development') {
        return true
      }
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

      try {
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
      } catch (error) {
        return {tipCompleted: false}
      }
    }),
})
