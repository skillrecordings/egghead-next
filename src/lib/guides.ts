import groq from 'groq'
import {pickBy} from 'lodash'
import {sanityClient} from '@/utils/sanity-client'
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

export const getGuides = async () => {
  const query = groq`*[_type == "guide"]{
    _id,
    _updatedAt,
    _createdAt,
    state,
    title,
    "slug": slug.current,
    "description": summary,
    subTitle,
    path,
    state,
    image,
    ogImage
  }`
  const guides = await sanityClient.fetch(query)
  return GuidesSchema.parse(guides)
}

export const getGuide = async (slug: string) => {
  const query = groq`*[_type == "guide" && slug.current == $slug][0]{
    _id,
    _updatedAt,
    _createdAt,
    title,
    "slug": slug.current,
    description,
    subTitle,
    "type": "guide",
    path,
    image,
    ogImage,
    "sections": resources[type == 'collection'][]{
      title,
      type,
      description,
      "resources": resources[]{
        _type == 'reference' => @->{
          _id,
          "slug": slug.current,
          title,
          'instructor': collaborators[@->.role == 'instructor'][0]->{
            'name': person->.name,
            'image': person->.image.url
          },
          "description": summary,
          type,
          image,
          url,
          path,
          "lessonCount": count(resources),
          "firstLesson": resources[0]{_id, path},
        },
        // not all resources are references, some are inline
        _type != 'reference' => @{
          _id,
          "slug": slug.current,
          title,
          description,
          type,
          image,
          url,
          path
        },
       
      }
    }
  }`
  const guide = await sanityClient.fetch(query, {slug})
  return GuideSchema.parse(guide)
}
