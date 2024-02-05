import {NextApiRequest, NextApiResponse} from 'next'
import {isValidSignature, SIGNATURE_HEADER_NAME} from '@sanity/webhook'
import client from '@sanity/client'
import {z} from 'zod'
import groq from 'groq'
import {prisma} from '@/server/prisma'

const sanityClient = client({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_EDITOR_TOKEN,
})

const secret = process.env.SANITY_WEBHOOK_SIGNATURE_SECRET || ''

const WebhookBodySchema = z.object({
  operation: z.enum(['create', 'update', 'delete']),
  data: z.object({
    _id: z.string(),
    _type: z.string(),
    duration: z.number().nullable(),
  }),
})

/**
 * link to webhook {@link} https://www.sanity.io/organizations/om9qNpcXE/project/z9io1e0u/api/webhooks/xV5ZY6656qclI76i
 *
 * @param req
 * @param res
 */
const sanityLessonUpdatedWebhook = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const signature = req.headers[SIGNATURE_HEADER_NAME] as string
  const isValid = isValidSignature(JSON.stringify(req.body), signature, secret)

  try {
    if (isValid) {
      const result = WebhookBodySchema.safeParse(req.body)
      if (result.success) {
        const {
          data: {_id, duration},
          operation,
        } = result.data
        console.info(
          `processing Sanity webhook: VideoResource ${operation}`,
          _id,
        )

        // we only need to sync the `duration` value if it is set
        if (duration === null) {
          return res.status(200).json({success: true})
        }

        // 1. Request the referencing objects via a Sanity GROQ query
        const query = groq`
          *[references('${_id}')]{
            _id,
            eggheadRailsLessonId
          }
        `

        const referencingResources: Array<{
          _id: string
          eggheadRailsLessonId: string
        }> = await sanityClient.fetch(query)
        const validReferencingResources = referencingResources.filter(
          (resource) => resource.eggheadRailsLessonId !== null,
        )

        // we only need to sync when there is a corresponding egghead-rails resource
        if (validReferencingResources.length === 0) {
          return res.status(200).json({success: true})
        }

        const eggheadRailsLessonIds = referencingResources
          .map((resource) => Number.parseInt(resource.eggheadRailsLessonId))
          .filter((id) => !Number.isNaN(id))

        // 2. Make Prisma requests to update egghead-rails objects
        await prisma.lesson.updateMany({
          where: {
            id: {
              in: eggheadRailsLessonIds,
            },
          },
          data: {
            duration,
          },
        })

        res.status(200).json({success: true})
      } else {
        res.status(200).json({
          success: false,
          message: `unexpected shape for webhook request body, ${result.error}`,
        })
      }
    } else {
      res.status(500).json({success: false})
    }
  } catch (e) {
    // Sentry.captureException(e)
    res.status(200).json({success: true})
  }
}

export default sanityLessonUpdatedWebhook

export const config = {
  api: {
    externalResolver: true,
  },
}
