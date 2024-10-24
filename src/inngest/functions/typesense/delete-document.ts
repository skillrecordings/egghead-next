import Typesense from 'typesense'
import {inngest} from '@/inngest/inngest.server'
import {COURSE_UNPUBLISHED_EVENT} from '@/inngest/events/course-unpublished-event' // Assuming you have an event for course unpublishing

let client = new Typesense.Client({
  nodes: [
    {
      host: process.env.NEXT_PUBLIC_TYPESENSE_HOST!,
      port: 443,
      protocol: 'https',
    },
  ],
  apiKey: process.env.TYPESENSE_WRITE_API_KEY!,
  connectionTimeoutSeconds: 2,
})

export const deleteDocument = inngest.createFunction(
  {id: 'delete-document', name: 'Delete Document'},
  {event: COURSE_UNPUBLISHED_EVENT}, // Use the correct event here
  async ({event, step}) => {
    const {courseId, reason} = event.data

    await step.run('delete-document', async () => {
      console.log(`Deleting document with ID ${courseId}}`)
      if (reason) {
        console.log(`Reason: ${reason}`)
      }
      try {
        await client
          .collections(process.env.TYPESENSE_COLLECTION_NAME!)
          .documents(courseId)
          .delete()
        console.log(`Document with ID ${courseId} deleted successfully.`)
      } catch (err) {
        console.error(`Failed to delete document with ID ${courseId}:`, err)
      }
    })
  },
)
