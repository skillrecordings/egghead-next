import {z} from 'zod'

export const GUIDE_PUBLISHED_EVENT = 'guide/published'

export type GuidePublished = {
  name: typeof GUIDE_PUBLISHED_EVENT
  data: GuidePublishedEvent
}

export const GuidePublishedEventSchema = z.object({
  guideId: z.string(),
  title: z.string(),
  description: z.string().optional(),
  slug: z.string(),
  path: z.string(),
  image: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string(),
})

export type GuidePublishedEvent = z.infer<typeof GuidePublishedEventSchema>
