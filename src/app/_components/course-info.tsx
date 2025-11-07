'use client'

import React from 'react'
import Link from 'next/link'
import {trpc} from '@/app/_trpc/client'

interface CourseInfoProps {
  resourceId: string | number
  belongsToResource?: string | number
  belongsToResourceTitle?: string
  belongsToResourceSlug?: string
}

const CourseInfo: React.FC<CourseInfoProps> = ({
  resourceId,
  belongsToResource,
  belongsToResourceTitle,
  belongsToResourceSlug,
}) => {
  // Otherwise fall back to fetching via tRPC
  const queryResourceId = belongsToResource ? String(belongsToResource) : null

  // Only fetch if there's a belongsToResource field
  const {data: course, isLoading} = trpc.course.getCourseByResourceId.useQuery(
    {resourceId: queryResourceId!},
    {
      enabled: !!queryResourceId,
      staleTime: 5 * 60 * 1000, // Cache for 5 minutes
      cacheTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    },
  )

  // If we already have the title and slug from hits, use them directly
  if (belongsToResourceTitle && belongsToResourceSlug) {
    return (
      <div className="min-h-4">
        <Link
          href={`/courses/${belongsToResourceSlug}`}
          className="text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          {belongsToResourceTitle}
        </Link>
      </div>
    )
  }

  if (!belongsToResource) {
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-4">
        <div className="h-3 w-60 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>
    )
  }

  if (!course) {
    return null
  }

  return (
    <div className="min-h-4">
      <Link
        href={`/courses/${course.slug}`}
        className="text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      >
        {course.title}
      </Link>
    </div>
  )
}

export default CourseInfo
