import {z} from 'zod'

export const INDEX_LESSONS_FOREVER = 'lessons/index'

export type IndexLessonsForever = {
  name: typeof INDEX_LESSONS_FOREVER
  data: IndexLessonsForeverEvent
}

export const IndexLessonsForeverEventSchema = z.object({
  page: z.number(),
})

export type IndexLessonsForeverEvent = z.infer<
  typeof IndexLessonsForeverEventSchema
>
