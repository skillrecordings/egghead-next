import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {LatestCourse} from '@/lib/courses-query'
import {NewLessonsBadge} from './new-lessons-badge'

interface CourseCardProps {
  course: LatestCourse
}

export function CourseCard({course}: CourseCardProps) {
  return (
    <article className="flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <Link
        href={`/courses/${course.slug}`}
        className="group flex flex-col h-full"
      >
        {/* Course Image */}
        <div className="relative flex items-center justify-center p-6 pb-0">
          {course.image ? (
            <>
              <Image
                src={course.image}
                alt={course.title}
                width={150}
                height={150}
                className="object-contain"
              />
              {/* Badge overlay */}
              <div className="absolute top-2 right-2">
                <NewLessonsBadge
                  courseCreatedAt={course.createdAt}
                  recentLessonsCount={course.recentLessonsCount}
                />
              </div>
            </>
          ) : (
            <>
              <svg
                className="w-32 h-32 text-gray-400 dark:text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              {/* Badge for no-image state */}
              <div className="absolute top-2 right-2">
                <NewLessonsBadge
                  courseCreatedAt={course.createdAt}
                  recentLessonsCount={course.recentLessonsCount}
                />
              </div>
            </>
          )}
        </div>

        {/* Course Content */}
        <div className="flex flex-col flex-1 p-4">
          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-3 text-center">
            {course.title}
          </h3>

          {/* Metadata */}
          <div className="mt-auto flex flex-col items-center gap-2">
            {/* Lesson count */}
            {course.totalLessons > 0 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {course.totalLessons} lesson
                {course.totalLessons !== 1 ? 's' : ''}
              </span>
            )}

            {/* Instructor */}
            {course.instructor && (
              <div className="flex items-center text-sm sm:text-base text-gray-700 dark:text-gray-300">
                {course.instructor.image ? (
                  <Image
                    src={course.instructor.image}
                    alt={course.instructor.name}
                    width={24}
                    height={24}
                    className="rounded-full mr-2"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 mr-2" />
                )}
                <span>{course.instructor.name}</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </article>
  )
}

export default CourseCard
