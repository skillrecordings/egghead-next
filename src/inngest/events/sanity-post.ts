import {z} from 'zod'

export const POST_CREATION_REQUESTED_EVENT = 'video/post-creation-requested'

export type PostCreationRequested = {
  name: typeof POST_CREATION_REQUESTED_EVENT
  data: PostCreationRequestedEvent
}

export const PostCreationRequestedEventSchema = z.object({
  content: z.string(),
  requestId: z.string(),
  title: z.string(),
})

export type PostCreationRequestedEvent = z.infer<
  typeof PostCreationRequestedEventSchema
>
