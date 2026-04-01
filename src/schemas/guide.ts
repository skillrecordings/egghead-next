import {z} from 'zod'

export const GuideResourceSchema = z.object({
  _id: z.string().optional().nullable(),
  title: z.string(),
  description: z.string().optional().nullable(),
  type: z
    .enum([
      'article',
      'course',
      'playlist',
      'collection',
      'project',
      'podcast',
      'guide',
      'talk',
      'landing-page',
    ])
    .nullable(),
  slug: z.string().nullable(),
  image: z.string().nullable(),
  url: z.string().nullable(),
  path: z.string().nullable(),
  lessonCount: z.number().optional().nullable(),
  instructor: z
    .object({
      name: z.string(),
      image: z.string(),
    })
    .optional()
    .nullable(),
  firstLesson: z
    .object({
      _id: z.string().nullable().optional(),
      path: z.string().nullable(),
    })
    .optional()
    .nullable(),
})

export const GuideSectionSchema = z.object({
  _id: z.string().optional().nullable(),
  title: z.string(),
  type: z.string().nullable(),
  description: z.string().nullable().optional(),
  resources: z.array(GuideResourceSchema).nullable().optional(),
})

export const GuideSchema = z.object({
  _id: z.string().optional().nullable(),
  _updatedAt: z.string(),
  _createdAt: z.string(),
  title: z.string(),
  slug: z.string().optional().nullable(),
  description: z.string().optional(),
  subTitle: z.string().nullable(),
  path: z.string().nullable(),
  image: z.string().optional(),
  ogImage: z.string().nullable().optional(),
  sections: z.array(GuideSectionSchema).optional().nullable(),
  state: z.enum(['published', 'draft', 'archived']).optional().nullable(),
})

export type Guide = z.infer<typeof GuideSchema>
export const GuidesSchema = z.array(GuideSchema)
export type GuideSection = z.infer<typeof GuideSectionSchema>
export type GuideResource = z.infer<typeof GuideResourceSchema>
