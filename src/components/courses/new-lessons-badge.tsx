import React from 'react'
import {shouldShowNewLessonsBadge} from '@/lib/courses-query'

interface NewLessonsBadgeProps {
  courseCreatedAt: Date | string
  recentLessonsCount: number
  className?: string
}

export function NewLessonsBadge({
  courseCreatedAt,
  recentLessonsCount,
  className = '',
}: NewLessonsBadgeProps) {
  // Check if badge should be shown based on business logic
  if (!shouldShowNewLessonsBadge(courseCreatedAt, recentLessonsCount)) {
    return null
  }

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 tracking-wide uppercase ${className}`}
    >
      {/* <svg
        className="mr-1 h-3 w-3"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg> */}
      {recentLessonsCount} New Lessons
    </span>
  )
}

export default NewLessonsBadge
