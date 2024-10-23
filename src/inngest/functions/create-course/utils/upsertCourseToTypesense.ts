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

const courseSchema = z.object({
  id: z.number(),
  slug: z.string(),
  state: z.string(),
  visibility_state: z.string(),
  summary: z.string(),
  free_forever: z.boolean(),
  type: z.literal('playlist'),
  created_at: z.string(),
  published: z.boolean(),
  rating_out_of_5: z.number(),
  square_cover_url: z.string(),
  topic_list: z.array(z.string()),
  updated_at: z.string(),
  instructor: z.object({
    id: z.number(),
    full_name: z.string(),
  }),
  tags: z.array(
    z.object({
      name: z.string(),
      slug: z.string(),
      label: z.string(),
      image_url: z.string(),
      http_url: z.string(),
      description: z.string(),
    }),
  ),
  title: z.string(),
  description: z.string(),
  path: z.string(),
})

function transformCourseData(data: any) {
  return {
    ...data,
    id: String(data.id),
    published_at_timestamp: new Date(data.updated_at).getTime(),
    objectID: String(data.id),
    instructor_name: data.instructor.full_name,
    resource_type: 'course',
    name: data.title,
  }
}

function syncToTypeSense(data: any) {
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
