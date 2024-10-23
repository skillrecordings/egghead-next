import {z} from 'zod'

export const COURSE_UNPUBLISHED_EVENT = 'course/unpublished'

export type CourseUnpublished = {
  name: typeof COURSE_UNPUBLISHED_EVENT
  data: CourseUnpublishedEvent
}

export const CourseUnpublishedEventSchema = z.object({
  courseId: z.string(),
  reason: z.string().optional(),
})

export type CourseUnpublishedEvent = z.infer<
  typeof CourseUnpublishedEventSchema
>
