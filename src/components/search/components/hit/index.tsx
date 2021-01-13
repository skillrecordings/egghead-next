import React, {FunctionComponent} from 'react'
import Link from 'next/link'
import {convertTimeWithTitles} from 'utils/time-utils'
import capitalize from 'lodash/capitalize'
import {track} from 'utils/analytics'
import config from '../../../../lib/config'
import {CREATOR_DELINIATOR} from '../../../../lib/search-url-builder'

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
    <div className="flex items-center py-3 w-full">
      {hasImage && (
        <div className="col-span-1 items-center flex justify-center">
          <Link href={path}>
            <a
              onClick={() => {
                track(`clicked search result image`, {
                  [type]: slug,
                })
              }}
              className="flex-shrink-0"
            >
              <img
                className={`${
                  type === 'lesson'
                    ? 'w-8 h-8 m-4'
                    : 'sm:w-16 sm:h-16 w-12 h-12'
                } `}
                src={`${image}`}
                alt={`illustration for ${title}`}
              />
            </a>
          </Link>
        </div>
      )}
      <div
        className={`${
          hasImage ? 'pl-4' : ''
        } flex sm:flex-row flex-col sm:items-center items-start w-full`}
      >
        <div className="flex flex-col sm:w-3/4 w-full">
          <Link href={path}>
            <a
              onClick={() =>
                track(`clicked search result title`, {
                  [type]: slug,
                })
              }
              className="self-start"
            >
              <h2 className="sm:text-lg text-base font-semibold leading-tight hover:underline">
                {title}
              </h2>
            </a>
          </Link>
          <div className="sm:text-sm text-sm font-light text-gray-600">
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
