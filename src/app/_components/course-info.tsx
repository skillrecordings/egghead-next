'use client'

import React from 'react'
import Link from 'next/link'
import {trpc} from '@/app/_trpc/client'

interface CourseInfoProps {
  resourceId: string | number
  belongsToResource?: string | number
}

const CourseInfo: React.FC<CourseInfoProps> = ({
  resourceId,
  belongsToResource,
}) => {
  // Use the belongsToResource value to find what course this resource belongs to
  const queryResourceId = belongsToResource ? String(belongsToResource) : null

  // Only fetch if there's a belongsToResource field
  const {data: course} = trpc.course.getCourseByResourceId.useQuery(
    {resourceId: queryResourceId!},
    {
      enabled: !!queryResourceId,
      staleTime: 5 * 60 * 1000, // Cache for 5 minutes
      cacheTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    },
  )

  if (!belongsToResource || !course) {
    return null
  }

  return (
    <Link
      href={`/courses/${course.slug}`}
      className="text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
    >
      {course.title}
    </Link>
  )
}

export default CourseInfo
