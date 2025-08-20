import {z} from 'zod'

// Schema definitions
export const PostTypeSchema = z.union([
  z.literal('article'),
  z.literal('lesson'),
  z.literal('podcast'),
  z.literal('tip'),
  z.literal('course'),
])

export const PostStateSchema = z.union([
  z.literal('draft'),
  z.literal('published'),
  z.literal('archived'),
  z.literal('deleted'),
])

export const PostVisibilitySchema = z.union([
  z.literal('public'),
  z.literal('private'),
  z.literal('unlisted'),
])

export const PostAccessSchema = z.union([z.literal('free'), z.literal('pro')])

export const FieldsSchema = z.object({
  title: z.string(),
  postType: PostTypeSchema.default('lesson'),
  summary: z.string().optional().nullable(),
  body: z.string().nullable().optional(),
  state: PostStateSchema.default('draft'),
  visibility: PostVisibilitySchema.default('public'),
  access: PostAccessSchema.default('pro'),
  eggheadLessonId: z.number().nullish(),
  eggheadPlaylistId: z.number().nullish(),
  slug: z.string(),
  description: z.string().nullish(),
  github: z.string().nullish(),
  gitpod: z.string().nullish(),
  primaryTagId: z.string().nullish(),
  ogImage: z.string().nullish(),
})

export const PostSchema = z.object({
  id: z.string().optional(),
  type: z.string().optional(),
  createdById: z.string().optional(),
  fields: FieldsSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullish(),
  currentVersionId: z.string().optional(),
  organizationId: z.string().nullish(),
  createdByOrganizationMembershipId: z.string().nullish(),
  name: z.string().nullish(),
  image: z.string().nullish(),
})

export const CourseSchema = z
  .object({
    title: z.string(),
    slug: z.string(),
    image: z.string().nullish(),
    description: z.string(),
    id: z.string(),
    position: z.number(),
    totalLessons: z.number(),
  })
  .nullish()

// Export types
export type PostType = z.infer<typeof PostTypeSchema>
export type Fields = z.infer<typeof FieldsSchema>
export type Post = z.infer<typeof PostSchema>
export type Course = z.infer<typeof CourseSchema>

// MDX and component prop types
export type MDXSource = {
  compiledSource: string
  scope?: Record<string, unknown>
  frontmatter: Record<string, unknown>
}

export type Tag = {
  name: string
  label: string
  image_url?: string
  version?: string
}

export interface PostPageProps {
  mdxSource: MDXSource
  post: Post
  course: Course
  instructor: {
    full_name: string
    avatar_url: string
    path?: string
  }
  videoResource: {
    fields: {
      muxPlaybackId: string
      transcript?: string
    }
  }
  tags: Tag[]
  primaryTagName?: string | null
}

export interface ParsedSlug {
  hashFromSlug: string
  originalSlug: string
}
