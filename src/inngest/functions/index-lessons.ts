import {inngest} from '@/inngest/inngest.server'
import {INDEX_LESSONS_FOREVER} from '@/inngest/events/index-lessons-forever-event'
import {google} from 'googleapis'

const jwtClient = new google.auth.JWT(
  process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL,
  undefined,
  process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
  ['https://www.googleapis.com/auth/indexing'],
  undefined,
)
export const indexLessonsForever = inngest.createFunction(
  {id: `video-uploaded`, name: 'Video Uploaded'},
  {event: INDEX_LESSONS_FOREVER},
  async ({event, step}) => {
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
        const promises = lessons.map(async (lesson: any) => {
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
            console.log(`indexed ${url}`, res.data)
          } catch (e) {
            console.error(e)
          }
        })
        return await Promise.all(promises)
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
