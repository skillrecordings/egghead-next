import {inngest} from '@/inngest/inngest.server'
import {SANITY_COURSE_DOCUMENT_CREATED} from '@/inngest/events/sanity-course-document-created'
import {upsertCourseToTypesense} from './utils/upsertCourseToTypesense'
import {createCourseInRails} from './utils/createCourseInRails'
import {addLessonsToCourse} from './utils/addLessonsToCourse'
import {updateOwnerToInstructor} from './utils/updateOwnerToInstructor'
import {saveCourseDataToSanity} from './utils/saveCourseDataToSanity'
import {deleteDocument} from '../typesense/delete-document'

export let createCourse = inngest.createFunction(
  {id: 'create-course', name: 'Create Course'},
  {event: SANITY_COURSE_DOCUMENT_CREATED},
  async ({event, step}) => {
    let sanityBody = event.data.body

    let courseObject = await step.run('create-course-in-rails', async () => {
      return await createCourseInRails(sanityBody)
    })

    await step.run('add-lessons-to-course', async () => {
      return await addLessonsToCourse(
        sanityBody.lessonIds,
        courseObject.data.id,
      )
    })

    await step.run('update-owner-to-instructor', async () => {
      return await updateOwnerToInstructor(
        sanityBody.instructor.eggheadInstructorId,
        courseObject.data.id,
      )
    })

    await step.run('add-rails-id-to-sanity', async () => {
      return await saveCourseDataToSanity(sanityBody, courseObject.data)
    })

    if (
      courseObject.data.state === 'published' &&
      courseObject.data.visibility_state === 'indexed'
    ) {
      await step.run('upsert-course-to-typesense', async () => {
        return await upsertCourseToTypesense(courseObject.data)
      })
    } else {
      await step.invoke('delete-document-from-typesense', {
        function: deleteDocument,
        data: {
          courseId: courseObject.data.id,
          reason: 'Course is not published or indexed',
        },
      })
    }
  },
)
