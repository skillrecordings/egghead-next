import {FunctionComponent} from 'react'
import {isEmpty} from 'lodash'
import Link from 'next/link'
import {track} from '../../utils/analytics'
import Image from 'next/image'
import * as React from 'react'

const TagList: FunctionComponent<{tags: any; courseSlug: string}> = ({
  tags,
  courseSlug,
}) => {
  return (
    <>
      {!isEmpty(tags) && (
        <div className="flex space-x-4 items-center">
          {/* <div className="font-medium">Tech used:</div> */}
          <ul className="flex flex-wrap items-center space-x-4">
            {tags.slice(0, 1).map((tag: any, index: number) => (
              <li key={index} className="inline-flex items-center">
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
                      width={16}
                      height={16}
                      className="flex-shrink-0"
                    />
                    <span className="ml-1">{tag.label}</span>
                    {tag.version && (
                      <span className="ml-2">
                        <code>{tag.version}</code>
                      </span>
                    )}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}

export default TagList
