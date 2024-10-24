import Typesense from 'typesense'
import z from 'zod'
import {syncWithSearchProvider} from '@/lib/search'

let client = new Typesense.Client({
  nodes: [
    {
      host: process.env.NEXT_PUBLIC_TYPESENSE_HOST!,
      port: 443,
      protocol: 'https',
    },
  ],
  apiKey: process.env.TYPESENSE_WRITE_API_KEY!,
  connectionTimeoutSeconds: 2,
})

export const courseSchema = z.object({
  id: z.number(),
  updated_at: z.string(),
  title: z.string(),
  description: z.string().optional(),
  slug: z.string().optional(),
  path: z.string().optional(),
  state: z.string().optional(),
  visibility_state: z.string().optional(),
  summary: z.string().optional(),
  free_forever: z.boolean().optional(),
  type: z.literal('playlist').optional(),
  created_at: z.string().optional(),
  published: z.boolean().optional(),
  rating_out_of_5: z.number().optional(),
  square_cover_url: z.string().optional(),
  topic_list: z.array(z.string()).optional(),
  instructor: z
    .object({
      id: z.number(),
      full_name: z.string(),
    })
    .optional(),
  tags: z
    .array(
      z.object({
        name: z.string(),
        slug: z.string(),
        label: z.string(),
        image_url: z.string(),
        http_url: z.string(),
        description: z.string(),
      }),
    )
    .optional(),
})

export function transformCourseData(data: any) {
  return {
    ...data,
    id: String(data.id),
    published_at_timestamp: new Date(data.updated_at).getTime(),
    objectID: String(data.id),
    instructor_name: data.instructor.full_name || '',
    resource_type: 'course',
    name: data.title,
  }
}

export function syncToTypeSense(data: any) {
  return client
    .collections(process.env.TYPESENSE_COLLECTION_NAME!)
    .documents()
    .upsert(data)
}

export async function upsertCourseToTypesense(data: any) {
  return syncWithSearchProvider(
    courseSchema,
    data,
    syncToTypeSense,
    transformCourseData,
  )
}
