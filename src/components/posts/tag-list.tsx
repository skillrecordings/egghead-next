'use client'

import {useState} from 'react'
import {isEmpty} from 'lodash'
import Image from 'next/image'
import Link from 'next/link'
import {cn} from '@/ui/utils'
import {track} from '@/utils/analytics'
import type {Tag} from '@/schemas/post'

interface TagListProps {
  tags: Tag[]
  resourceSlug: string
  className?: string
}

export function TagList({tags, resourceSlug, className}: TagListProps) {
  const [showAll, setShowAll] = useState(false)
  const MAX_VISIBLE_TAGS = 3

  const displayTags = showAll ? tags : tags.slice(0, MAX_VISIBLE_TAGS)
  const hasMoreTags = tags.length > MAX_VISIBLE_TAGS

  return (
    <>
      {!isEmpty(tags) && (
        <div
          className={cn('flex flex-col items-start sm:items-end', className)}
        >
          <ul
            className={cn('flex sm:justify-end flex-wrap gap-2 items-center')}
          >
            {displayTags.map((tag: Tag) => (
              <li key={tag.name} className="inline-flex items-center mt-0">
                <Link
                  href={`/q/${tag.name}`}
                  onClick={() => {
                    track(`clicked view topic`, {
                      resource: resourceSlug,
                      topic: tag.name,
                    })
                  }}
                  className="inline-flex items-center hover:underline px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md text-sm transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  {tag?.image_url && tag?.image_url !== 'null' && (
                    <Image
                      src={tag.image_url}
                      alt={tag.name}
                      width={16}
                      height={16}
                      className="flex-shrink-0"
                      quality={100}
                    />
                  )}
                  <span className="ml-1">{tag.label}</span>
                </Link>
                {tag.version && (
                  <div className="ml-2 opacity-70">
                    <code>{tag.version}</code>
                  </div>
                )}
              </li>
            ))}
          </ul>
          {hasMoreTags && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-2"
            >
              {showAll
                ? 'Show less'
                : `+${tags.length - MAX_VISIBLE_TAGS} more`}
            </button>
          )}
        </div>
      )}
    </>
  )
}
