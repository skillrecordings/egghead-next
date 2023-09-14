import z from 'zod'

export const TestimonialSchema = z.object({
  _id: z.string(),
  _type: z.string(),
  _updatedAt: z.string().optional(),
  body: z.nullable(z.any().array().optional()),
  author: z.object({
    name: z.string().optional(),
    image: z.string().optional(),
  }),
})

export type Testimonial = z.infer<typeof TestimonialSchema>
