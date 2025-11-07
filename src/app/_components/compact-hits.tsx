'use client'

import React from 'react'
import {useHits} from 'react-instantsearch'
import Image from 'next/image'
import Link from 'next/link'
import cn from 'classnames'
import CourseInfo from './course-info'

const CompactHits = () => {
  const {hits} = useHits()

  if (!hits || hits.length === 0) {
    return (
      <div className="px-5 py-12 text-center text-gray-500">
        No results found
      </div>
    )
  }

  return (
    <div className="px-5">
      <div className="rounded-lg border dark:border-gray-800 border-gray-200 overflow-hidden dark:bg-gray-800/50 bg-white">
        {hits.map((hit: any, index: number) => {
          const title = hit.title || hit.name
          const type = hit.type || 'content'
          const slug = hit.slug || hit._id
          const thumbnail = hit.mux_playback_id
            ? `https://image.mux.com/${hit.mux_playback_id}/thumbnail.webp?width=120&height=120&fit_mode=smartcrop`
            : hit.image || hit.thumbnail?.url
          const instructor = hit.instructor?.full_name || hit.instructor?.name
          const courseName = hit.collection?.name || hit.course?.name
          const icon = hit.icon_url || hit.collection?.icon_url

          const instructorSlug = instructor
            ? instructor.toLowerCase().replace(/\s+/g, '-')
            : null

          return (
            <div
              key={hit.objectID}
              className={cn(
                'group relative',
                index !== hits.length - 1 &&
                  'border-b dark:border-gray-700/50 border-gray-200/50',
              )}
            >
              <div className="block px-4 py-3">
                <div className="flex items-start gap-4">
                  {/* Icon/Thumbnail */}
                  <div className="flex-shrink-0 w-10">
                    {icon ? (
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <Image
                          src={icon}
                          alt=""
                          width={40}
                          height={40}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : thumbnail ? (
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <Image
                          src={thumbnail}
                          alt=""
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : null}
                  </div>

                  {/* Content */}
                  <div className="flex-grow min-w-0 self-center">
                    <Link href={`/${slug}`}>
                      <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        {title}
                      </h3>
                    </Link>
                    {/* Display course info if it's a lesson that belongs to a course */}
                    <CourseInfo
                      resourceId={hit._id || hit.objectID}
                      belongsToResource={hit.belongs_to_resource}
                      belongsToResourceTitle={hit.belongs_to_resource_title}
                      belongsToResourceSlug={hit.belongs_to_resource_slug}
                    />

                    {/* Instructor and Type Badge - Mobile */}
                    <div className="flex items-center gap-2 mt-2 sm:hidden">
                      {instructor && instructorSlug && (
                        <Link
                          href={`/q/resources-by-${instructorSlug}`}
                          className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors"
                        >
                          {hit.instructor?.avatar_url && (
                            <Image
                              src={hit.instructor.avatar_url}
                              alt={instructor}
                              width={20}
                              height={20}
                              className="rounded-full"
                            />
                          )}
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {instructor}
                          </span>
                        </Link>
                      )}
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400 ml-auto">
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Instructor and Type Badge - Desktop */}
                  <div className="hidden sm:flex items-center gap-4 flex-shrink-0 self-center">
                    {instructor && instructorSlug && (
                      <Link
                        href={`/q/resources-by-${instructorSlug}`}
                        className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors"
                      >
                        {hit.instructor?.avatar_url && (
                          <Image
                            src={hit.instructor.avatar_url}
                            alt={instructor}
                            width={24}
                            height={24}
                            className="rounded-full"
                          />
                        )}
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {instructor}
                        </span>
                      </Link>
                    )}
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CompactHits
