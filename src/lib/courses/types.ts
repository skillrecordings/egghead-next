import {z} from 'zod'

// Schema for a course with activity tracking
// Note: Dates will be strings (ISO format) when serialized for transport
export const LatestCourseSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string().nullish(),
  image: z.string().nullish(),
  createdAt: z.union([z.date(), z.string()]),
  updatedAt: z.union([z.date(), z.string()]),
  totalLessons: z.number(),
  recentLessonsCount: z.number(),
  latestLessonDate: z.union([z.date(), z.string()]).nullish(),
  lastActivityDate: z.union([z.date(), z.string()]),
  instructor: z
    .object({
      name: z.string(),
      image: z.string().nullish(),
    })
    .nullish(),
})

// Schema for new lessons badge props
export const NewLessonsBadgePropsSchema = z.object({
  courseCreatedAt: z.union([z.date(), z.string()]),
  recentLessonsCount: z.number(),
  latestLessonDate: z.union([z.date(), z.string()]).nullish(),
})

// Export types
export type LatestCourse = z.infer<typeof LatestCourseSchema>
export type NewLessonsBadgeProps = z.infer<typeof NewLessonsBadgePropsSchema>

// Type for the raw database row
export interface LatestCourseRow {
  id: string
  type: string
  createdById: string
  fields: any
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
  currentVersionId: string | null
  organizationId: string | null
  title: string
  slug: string
  image: string | null
  description: string | null
  total_lessons: number
  recent_lessons_count: number
  latest_lesson_date: Date | null
  last_activity_date: Date
  name: string | null
  user_image: string | null
}
