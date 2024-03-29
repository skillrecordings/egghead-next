import {inngest} from '@/inngest/inngest.server'
import {INDEX_LESSONS_FOREVER} from '@/inngest/events/index-lessons-forever-event'
import {google} from 'googleapis'

const base64EncodedServiceAccount =
  process.env.GOOGLE_SERVICE_ACCOUNT_ENCODED ?? ('' as string)
const decodedServiceAccount = Buffer.from(
  base64EncodedServiceAccount,
  'base64',
).toString('utf-8')
const credentials = decodedServiceAccount
  ? JSON.parse(decodedServiceAccount)
  : ''

const jwtClient = new google.auth.JWT(
  credentials.client_email,
  undefined,
  credentials.private_key,
  ['https://www.googleapis.com/auth/indexing'],
)

export const indexLessonsForever = inngest.createFunction(
  {id: `index-all-lessons-forever`, name: 'Index 200 Lessons'},
  {event: INDEX_LESSONS_FOREVER},
  async ({event, step}) => {
    if (process.env.NODE_ENV === 'development') return 'no index in dev'

    const lessons = await step.run('load a page of lessons', async () => {
      return fetch(
        `https://app.egghead.io/api/v1/lessons?state=published&page=${event.data.page}&size=200`,
      ).then((res) => res.json())
    })

    if (lessons.length === 0) {
      await step.sendEvent('restart from the beginning', {
        name: INDEX_LESSONS_FOREVER,
        data: {
          page: 1,
        },
      })
    } else {
      await step.run('index the lessons', async () => {
        const results = []

        for (const lesson of lessons) {
          try {
            const url = `https://egghead.io/lessons/${lesson.slug}`
            const res = await jwtClient.request({
              url: 'https://indexing.googleapis.com/v3/urlNotifications:publish',
              method: 'POST',
              data: {
                url,
                type: 'URL_UPDATED',
              },
            })
            results.push(res.data)
          } catch (e) {
            console.error(e)
          }
        }
        return results
      })
      await step.sleep('sleep for a day', `24.25h`)
      await step.sendEvent('index the next page', {
        name: INDEX_LESSONS_FOREVER,
        data: {
          page: event.data.page + 1,
        },
      })
    }
  },
)
