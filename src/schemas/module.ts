import z from 'zod'
import {LessonResourceSchema} from './lesson'
import {ExerciseSchema} from './exercise'
import {CollectionSchema} from './collection'
import {SectionSchema} from './section'
import {TestimonialSchema} from './testimonial'

export const ModuleSchema = z
  .object({
    _id: z.string().optional(),
    moduleType: z.string(),
    ogImage: z.string().nullish(),
    image: z.string().nullish(),
    product: z.object({productId: z.string()}).nullish(),
    cta: z
      .object({
        body: z.array(z.any()).or(z.string()).nullish(),
        expiresAt: z.string().nullish(),
      })
      .nullish(),
    github: z
      .object({
        repo: z.string().nullish(),
      })
      .nullish(),
    slug: z.object({
      current: z.string().nullish(),
    }),
    lessons: z
      .array(z.intersection(LessonResourceSchema, ExerciseSchema))
      .nullish(),
    sections: z.array(SectionSchema).nullish(),
    testimonials: z.array(TestimonialSchema).nullish(),
  })
  .merge(CollectionSchema.omit({slug: true}))

export type Module = z.infer<typeof ModuleSchema>
