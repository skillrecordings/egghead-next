import {ResourceSchema} from './resource'
import z from 'zod'
import {LessonResourceSchema} from './lesson'

export const ExerciseSchema = z
  .object({
    solution: z.nullable(LessonResourceSchema.optional()),
  })
  .merge(ResourceSchema)

export type Exercise = z.infer<typeof ExerciseSchema>
