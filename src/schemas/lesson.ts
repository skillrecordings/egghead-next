import z from 'zod'

import {ResourceSchema} from './resource'

export const LessonResourceSchema = z
  .object({
    _id: z.string().optional(),
    _key: z.string().optional(),
    resources: z.array(ResourceSchema).nullish(),
  })
  .merge(ResourceSchema)

export type Lesson = z.infer<typeof LessonResourceSchema>
