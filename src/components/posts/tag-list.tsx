'use client'

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
  return (
    <>
      {!isEmpty(tags) && (
        <ul
          className={cn(
            'flex justify-center md:justify-start flex-wrap gap-5 items-center',
            className,
          )}
        >
          {tags.map((tag: Tag) => (
            <li key={tag.name} className="inline-flex items-center mt-0">
              <Link
                href={`/q/${tag.name}`}
                onClick={() => {
                  track(`clicked view topic`, {
                    resource: resourceSlug,
                    topic: tag.name,
                  })
                }}
                className="inline-flex items-center hover:underline"
              >
                {tag?.image_url && tag?.image_url !== 'null' && (
                  <Image
                    src={tag.image_url}
                    alt={tag.name}
                    width={18}
                    height={18}
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
      )}
    </>
  )
}
