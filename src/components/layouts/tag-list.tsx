import {FunctionComponent} from 'react'
import {isEmpty} from 'lodash'
import Link from 'next/link'
import {track} from '../../utils/analytics'
import Image from 'next/image'
import * as React from 'react'

const TagList: FunctionComponent<
  React.PropsWithChildren<{
    tags: any
    courseSlug: string
    className?: string
  }>
> = ({
  tags,
  courseSlug,
  className = 'flex justify-center md:justify-start flex-wrap items-center',
}) => {
  return (
    <>
      {!isEmpty(tags) && (
        <ul className={className}>
          {tags.map((tag: any, index: number) => (
            <li key={index} className="inline-flex items-center mr-4 mt-0">
              <Link href={`/q/${tag.name}`}>
                <a
                  onClick={() => {
                    track(`clicked view topic`, {
                      course: courseSlug,
                      topic: tag.name,
                    })
                  }}
                  className="inline-flex items-center hover:underline"
                >
                  <Image
                    src={tag.image_url}
                    alt={tag.name}
                    width={18}
                    height={18}
                    className="flex-shrink-0"
                    quality={100}
                  />
                  <span className="ml-1">{tag.label}</span>
                </a>
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

export default TagList
