import React, {FunctionComponent} from 'react'
import Link from 'next/link'
import {convertTimeWithTitles} from 'utils/time-utils'
import capitalize from 'lodash/capitalize'
import {track} from 'utils/analytics'
import config from 'lib/config'
import {CREATOR_DELINIATOR} from 'lib/search-url-builder'
import Image from 'next/image'

type HitComponentProps = {
  hit: any
}

const HitComponent: FunctionComponent<HitComponentProps> = ({hit}) => {
  const {
    path,
    image,
    title,
    slug,
    duration,
    type,
    instructor_url,
    instructor_name,
    instructor,
  } = hit

  const hasImage = image !== 'https://d2eip9sf3oo6c2.cloudfront.net/logo.svg'

  return (
    <div className="flex items-center py-3 w-100">
      {hasImage && (
        <div className="items-center flex justify-center">
          <Link href={path}>
            <a
              onClick={() => {
                track(`clicked search result image`, {
                  [type]: slug,
                })
              }}
              className="flex-shrink-0"
            >
              <Image src={image} width={64} height={64} />
            </a>
          </Link>
        </div>
      )}
      <div
        className={`${
          hasImage ? 'pl-4' : ''
        } flex sm:flex-row flex-col sm:items-center items-start w-full `}
      >
        <div className="flex flex-col justify-start items-start  w-full">
          <Link href={path}>
            <a
              onClick={() =>
                track(`clicked search result title`, {
                  [type]: slug,
                })
              }
              className="self-start"
            >
              <h2 className="sm:text-lg text-base dark:text-gray-200 font-semibold leading-tight hover:underline">
                {title}
              </h2>
            </a>
          </Link>
          <div className="sm:text-sm text-sm font-light text-gray-600 dark:text-gray-400">
            {instructor_name && !instructor_url && <>{instructor_name}・</>}
            {instructor_name && instructor?.slug && (
              <>
                <a
                  href={`${config.searchUrlRoot}/${CREATOR_DELINIATOR}-${instructor.slug}`}
                  onClick={() =>
                    track(`clicked search result creator`, {
                      instructor: instructor_name,
                    })
                  }
                  className="hover:underline"
                >
                  {instructor_name}
                </a>
                ・
              </>
            )}

            {duration && convertTimeWithTitles(duration) !== '' && (
              <>{convertTimeWithTitles(duration)}・</>
            )}
            {type.toLowerCase() === 'playlist' ? 'Course' : capitalize(type)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HitComponent
