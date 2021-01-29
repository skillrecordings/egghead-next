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
          <ul className="flex flex-col sm:flex-row flex-wrap items-center space-y-1 sm:space-y-0 sm:space-x-4">
            {tags.map((tag: any, index: number) => (
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
        </div>
      )}
    </>
  )
}

export default TagList
