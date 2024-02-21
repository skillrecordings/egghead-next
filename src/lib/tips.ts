import {sanityClient} from '@/utils/sanity-client'
import groq from 'groq'
import z from 'zod'
import {sanityQuery} from '@/utils/sanity-server'

export const TipSchema = z.object({
  _id: z.string(),
  _type: z.string(),
  _updatedAt: z.string().optional(),
  _createdAt: z.string().optional(),
  title: z.string(),
  slug: z.string(),
  description: z.nullable(z.string()).optional(),
  body: z.string().optional().nullable(),
  summary: z.string().optional().nullable(),
  eggheadRailsLessonId: z.nullable(z.number()).optional(),
  tags: z.nullable(
    z
      .array(
        z.object({
          name: z.string(),
          label: z.string(),
          image_url: z.string(),
          http_url: z.string(),
        }),
      )
      .optional(),
  ),
  duration: z.number().optional().nullable(),
  muxPlaybackId: z.nullable(z.string()).optional(),
  state: z.enum(['new', 'processing', 'reviewing', 'published', 'retired']),
  sandpack: z
    .array(
      z.object({
        file: z.string(),
        code: z.string(),
        active: z.boolean(),
      }),
    )
    .optional()
    .nullable(),
  videoResourceId: z.nullable(z.string()).optional(),
  transcript: z.nullable(z.string()).optional(),
  srt: z.nullable(z.string()).optional(),
  tweetId: z.nullable(z.string()).optional(),
  instructor: z
    .nullable(
      z.object({
        title: z.string(),
        slug: z.string(),
        name: z.string(),
        path: z.string(),
        twitter: z.string(),
        image: z.string(),
      }),
    )
    .optional(),
})

export const CoursesFromTagSchema = z.object({
  tag: z.string(),
  moreCoursesFromTag: z
    .array(
      z.object({
        image: z.string(),
        paths: z.string(),
        slug: z.string(),
        title: z.string(),
      }),
    )
    .optional()
    .nullable(),
})

export type CoursesFromTag = z.infer<typeof CoursesFromTagSchema>

export const TipsSchema = z.array(TipSchema)

export type Tip = z.infer<typeof TipSchema>

const GetAllTipsOptionsSchema = z.object({
  onlyPublished: z.boolean(),
  limit: z.number().optional(),
})

type GetAllTipsOptions = z.infer<typeof GetAllTipsOptionsSchema>

export const getAllTips = async (
  options: GetAllTipsOptions = {onlyPublished: true},
): Promise<Tip[]> => {
  const {onlyPublished, limit} = GetAllTipsOptionsSchema.parse(options)

  // determine filtering conditions
  const filterConditions = ['_type == "tip"']
  if (onlyPublished) {
    filterConditions.push('state == "published"')
  }
  const filter = filterConditions.join(' && ')

  // determine slice clause limiting number of fetched results
  const validLimit = limit && limit > 0
  const sliceClause = validLimit ? `[0...${limit}]` : ''

  const query = groq`*[${filter}] | order(_updatedAt desc) {
    _id,
    _type,
    _updatedAt,
    _createdAt,
    title,
    state,
    description,
    eggheadRailsLessonId,
    summary,
    body,
    'tags': softwareLibraries[] {
      ...(library-> {
        name,
        'label': slug.current,
        'http_url': url,
        'image_url': image.url
      }),
    },
    "videoResourceId": resources[@->._type == 'videoResource'][0]->_id,
    "muxPlaybackId": resources[@->._type == 'videoResource'][0]-> muxAsset.muxPlaybackId,
    "duration": resources[@->._type == 'videoResource'][0]->duration,
    "slug": slug.current,
    "transcript": resources[@->._type == 'videoResource'][0]-> castingwords.transcript,
    "tweetId":  resources[@._type == 'tweet'][0].tweetId,
    'instructor': collaborators[@->.role == 'instructor'][0]->{
      title,
      'slug': person->slug.current,
      'name': person->name,
      'path': person->website,
      'twitter': person->twitter,
      'image': person->image.url
    },
  }${sliceClause}`

  const tips = await sanityQuery<Tip[]>(query)

  return tips
}

export const getTip = async (slug: string): Promise<Tip | null> => {
  if (!slug) {
    return null
  }
  const tip =
    await sanityQuery<Tip>(groq`*[_type == "tip" && slug.current == "${slug}"][0] {
    _id,
    _type,
    _updatedAt,
    _createdAt,
    title,
    state,
    description,
    eggheadRailsLessonId,
    summary,
    body,
    'tags': softwareLibraries[] {
      ...(library-> {
        name,
        'label': slug.current,
        'http_url': url,
        'image_url': image.url
      }),
    },
    "videoResourceId": resources[@->._type == 'videoResource'][0]->_id,
    "muxPlaybackId": resources[@->._type == 'videoResource'][0]-> muxAsset.muxPlaybackId,
    "duration": resources[@->._type == 'videoResource'][0]->duration,
    "slug": slug.current,
    "transcript": resources[@->._type == 'videoResource'][0]->transcript.text,
    "tweetId":  resources[@._type == 'tweet'][0].tweetId,
    'instructor': collaborators[@->.role == 'instructor'][0]->{
      title,
      'slug': person->slug.current,
      'name': person->name,
      'path': person->website,
      'twitter': person->twitter,
      'image': person->image.url
    },
  }`)

  return tip
}

export const getCoursesRelatedToTip = async (
  slug: string,
): Promise<CoursesFromTag> => {
  const coursesFromTag = await sanityClient.fetch(
    groq`*[_type == "tip" && slug.current == $slug][0] {
        "tag": softwareLibraries[0].library._ref,
        "moreCoursesFromTag": *[_type == "resource" && type == "course" && ^.softwareLibraries[0].library._ref == softwareLibraries[0].library._ref][0..10] {title, "slug": slug.current, image, path},
    }`,
    {slug},
  )

  return coursesFromTag
}
