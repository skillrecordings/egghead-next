import Typesense from 'typesense'
import {z} from 'zod'
import {syncWithSearchProvider} from '@/lib/search'
import {inngest} from '@/inngest/inngest.server'
import {
  GUIDE_PUBLISHED_EVENT,
  GuidePublishedEventSchema,
} from '@/inngest/events/guide-published'

const client = new Typesense.Client({
  nearestNode: {
    host: process.env.NEXT_PUBLIC_TYPESENSE_HOST!,
    port: 443,
    protocol: 'https',
  },
  nodes: [
    {
      host: `${process.env
        .NEXT_PUBLIC_TYPESENSE_HOST_HASH!}-1.a1.typesense.net`,
      port: 443,
      protocol: 'https',
    },
    {
      host: `${process.env
        .NEXT_PUBLIC_TYPESENSE_HOST_HASH!}-2.a1.typesense.net`,
      port: 443,
      protocol: 'https',
    },
    {
      host: `${process.env
        .NEXT_PUBLIC_TYPESENSE_HOST_HASH!}-3.a1.typesense.net`,
      port: 443,
      protocol: 'https',
    },
  ],
  apiKey: process.env.TYPESENSE_WRITE_API_KEY!,
  connectionTimeoutSeconds: 2,
})

export const guideSchema = z.object({
  guideId: z.string(),
  title: z.string(),
  description: z.string().optional(),
  slug: z.string(),
  path: z.string(),
  image: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string(),
})

function transformGuideData(data: z.infer<typeof guideSchema>) {
  return {
    id: data.guideId,
    objectID: data.guideId,
    name: data.title,
    title: data.title,
    description: data.description ?? '',
    slug: data.slug,
    path: data.path,
    type: 'guide',
    resource_type: 'guide',
    state: 'published',
    published: true,
    image: data.image ?? '',
    square_cover_url: data.image ?? '',
    _tags: [],
    created_at: data.createdAt ?? data.updatedAt,
    published_at_timestamp: new Date(data.updatedAt).getTime(),
  }
}

function syncToTypeSense(data: any) {
  return client
    .collections(process.env.TYPESENSE_COLLECTION_NAME!)
    .documents()
    .upsert(data)
}

export const upsertGuideToTypesense = inngest.createFunction(
  {id: 'upsert-guide-to-typesense', name: 'Upsert Guide to Typesense'},
  {event: GUIDE_PUBLISHED_EVENT},
  async ({event, step}) => {
    await step.run('upsert-guide', async () => {
      return syncWithSearchProvider(
        guideSchema,
        event.data,
        syncToTypeSense,
        transformGuideData,
      )
    })
  },
)
