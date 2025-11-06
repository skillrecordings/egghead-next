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
    <article className="relative flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden py-6">
      <Link
        href={`/courses/${course.slug}`}
        className="group flex flex-col h-full"
      >
        <div className="absolute top-2 right-2">
          <NewLessonsBadge
            courseCreatedAt={course.createdAt}
            recentLessonsCount={course.recentLessonsCount}
          />
        </div>
        {/* Course Image */}
        <div className="flex items-center justify-center p-6 pb-0">
          {course.image ? (
            <Image
              src={course.image}
              alt={course.title}
              width={150}
              height={150}
              className="object-contain rounded-lg"
            />
          ) : (
            <div className="w-[150px] h-[150px]" />
          )}
        </div>

        {/* Course Content */}
        <div className="flex flex-col flex-1 px-4 py-10">
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
