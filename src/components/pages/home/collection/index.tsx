import React, {FunctionComponent} from 'react'
import {CardResource} from 'components/pages/home/card'
import Link from 'next/link'
import Image from 'next/image'
import {track} from 'utils/analytics'
import {map, get} from 'lodash'
import Textfit from 'react-textfit'

type CollectionProps = {
  resource?: CardResource
  children?: React.ReactElement
  className?: string
  location?: string
}

const Collection: FunctionComponent<CollectionProps> = ({
  resource,
  className = '',
  location = 'home',
}) => {
  const {resources} = resource || {}
  return (
    <ul>
      {map(resources, (resource) => {
        const {title, path, image, byline} = resource
        const isLesson = path.includes('lessons')
        const imageSize = isLesson ? 32 : 50
        return (
          <li
            key={resource.path}
            className={`flex items-center py-2 ${className}`}
          >
            {image && (
              <Link href={path}>
                <a
                  onClick={() => {
                    track('clicked resource', {
                      resource: path,
                      linkType: 'image',
                      location,
                    })
                  }}
                  className="sm:w-12 w-12 flex-shrink-0 flex justify-center items-center "
                  tabIndex={-1}
                >
                  <Image
                    src={get(image, 'src', image)}
                    width={imageSize}
                    height={imageSize}
                    alt={`illustration for ${title}`}
                  />
                </a>
              </Link>
            )}
            <div className={image ? 'ml-3' : ''}>
              <Link href={path}>
                <a
                  onClick={() => {
                    track('clicked resource', {
                      resource: path,
                      linkType: 'text',
                      location,
                    })
                  }}
                  className="hover:text-blue-600"
                >
                  <h4 className="text-lg font-semibold leading-tight">
                    <Textfit mode="multi" min={14} max={17}>
                      {title}
                    </Textfit>
                  </h4>
                </a>
              </Link>
              <div className="text-xs text-gray-600">{byline}</div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export default Collection
