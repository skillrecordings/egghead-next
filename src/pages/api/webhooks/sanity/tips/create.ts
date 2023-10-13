import type {NextApiRequest, NextApiResponse} from 'next'
import {isValidSignature, SIGNATURE_HEADER_NAME} from '@sanity/webhook'
import client from '@sanity/client'
import axios from 'axios'
import _get from 'lodash/get'

const secret = process.env.SANITY_WEBHOOK_CREATED_SECRET || ''
const railsToken = process.env.EGGHEAD_ADMIN_TOKEN || ''
const EGGHEAD_AUTH_DOMAIN = process.env.NEXT_PUBLIC_AUTH_DOMAIN || ''

const sanityClient = client({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_EDITOR_TOKEN,
})

const eggAxios = axios.create({
  baseURL: EGGHEAD_AUTH_DOMAIN,
  headers: {
    Authorization: `Bearer ${railsToken}`,
  },
})

/**
 * link to webhook {@link} https://www.sanity.io/organizations/om9qNpcXE/project/z9io1e0u/api/webhooks/xV5ZY6656qclI76i
 *
 * @param req
 * @param res
 */
const createSanityTipsWebhook = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const signature = req.headers[SIGNATURE_HEADER_NAME] as string
  const isValid = isValidSignature(JSON.stringify(req.body), signature, secret)

  try {
    if (isValid) {
      const {_id, title, slug, instructorId} = req.body.data
      console.info('processing Sanity webhook: Lesson created', _id)

      // create a lesson in rails
      // patch lesson resources array with ref using the video resource id
      try {
        const body = new URLSearchParams({
          'lesson[instructor_id]': instructorId,
          'lesson[title]': title,
        })

        const lesson = await eggAxios.post('/api/v1/lessons', body)

        await sanityClient
          .patch(_id)
          .set({
            eggheadRailsLessonId: lesson.data.id,
            eggheadRailsCreatedAt: new Date().toISOString(),
          })
          .commit()

        return res.status(200).json({success: true})
      } catch (e) {
        console.error(e)
        return res.status(500).json({success: false})
      }
    } else {
      return res.status(500).json({success: false})
    }
  } catch (e) {
    // Sentry.captureException(e)
    return res.status(200).json({success: true})
  }
}

export default createSanityTipsWebhook

export const config = {
  api: {
    externalResolver: true,
  },
}
