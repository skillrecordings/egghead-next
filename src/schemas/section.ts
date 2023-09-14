import z from 'zod'
import {LessonResourceSchema} from './lesson'
import {ExerciseSchema} from './exercise'
import {CollectionSchema} from './collection'

export const SectionSchema = z
  .object({
    _id: z.string().optional(),
    lessons: z
      .array(z.intersection(LessonResourceSchema, ExerciseSchema))
      .nullish(),
  })
  .merge(CollectionSchema)

export type Section = z.infer<typeof SectionSchema>
