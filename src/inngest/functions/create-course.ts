import {inngest} from '@/inngest/inngest.server'
import {SANITY_COURSE_DOCUMENT_CREATED} from '@/inngest/events/sanity-course-document-created'
import {createClient} from '@sanity/client'
import {sendRequestWithEggAxios} from '@/utils/api-utils'

/**
 * Creates a course in egghead and saves the rails id to the sanity document
 */
export let createCourse = inngest.createFunction(
  {id: 'create-course', name: 'Create Course'},
  {event: SANITY_COURSE_DOCUMENT_CREATED},
  async ({event, step}) => {
    let sanityBody = event.data.body

    // Create the course in egghead using the sanity body and get the object back
    let courseObject = await step.run('create-course-in-rails', async () => {
      return await sendRequestWithEggAxios('/api/v1/playlists', {
        // This spread pattern is used to check if the sanity body has a value for the key and if it does, add it to the request body
        ...(sanityBody.title && {'playlist[title]': sanityBody.title}),
        ...(sanityBody.topicList && {
          'playlist[topic_list]': sanityBody.topicList.toString(),
        }),
        ...(sanityBody.description && {
          'playlist[description]': sanityBody.description,
        }),
        'playlist[published]': 'false',
      })
    })

    // If there are lessons in the sanity body, add them to the course by iterating over the lesson ids and patching the course with them
    await step.run('add-lessons-to-course', async () => {
      if (sanityBody.lessonIds && sanityBody.lessonIds.length > 0) {
        for (let lessonId of sanityBody.lessonIds) {
          await sendRequestWithEggAxios(
            `/api/v1/playlists/${courseObject.data.id}/items/add`,
            {
              'tracklistable[tracklistable_type]': 'lesson',
              'tracklistable[tracklistable_id]': String(lessonId),
            },
            'put',
          )
        }
      }
    })

    // The owner of the course has to be updated to the instructor since the course is created by a bot user.
    await step.run('update-owner-to-instructor', async () => {
      await sendRequestWithEggAxios(
        `/api/v1/playlists/${courseObject.data.id}`,
        {
          'playlist[instructor_id]': String(
            sanityBody.instructor.eggheadInstructorId,
          ),
        },
        'put',
      )
    })

    // Save the course record id from egghead to the sanity document
    await step.run('add-rails-id-to-sanity', async () => {
      let sanityClient = createClient({
        projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '',
        dataset: 'production',
        useCdn: false,
        apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
        token: process.env.SANITY_EDITOR_TOKEN,
      })

      return await sanityClient
        .patch(sanityBody._id)
        .set({
          railsCourseId: courseObject.data.id,
        })
        .commit()
    })
  },
)
