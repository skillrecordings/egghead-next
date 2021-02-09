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
        const {title, path, image} = resource
        const getImageSize = (image: string) => {
          return image.includes('tags') ? 32 : 50
        }
        const byline = resource.byline || resource?.instructor?.name
        return (
          <li
            key={resource.path}
            className={`flex items-center py-2 ${className}`}
          >
            {image && path && (
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
                    width={getImageSize(get(image, 'src', image))}
                    height={getImageSize(get(image, 'src', image))}
                    alt={`illustration for ${title}`}
                  />
                </a>
              </Link>
            )}
            <div className={image ? 'ml-3' : ''}>
              {path && (
                <Link href={path}>
                  <a
                    onClick={() => {
                      track('clicked resource', {
                        resource: path,
                        linkType: 'text',
                        location,
                      })
                    }}
                    className="hover:text-blue-600 dark:hover:text-blue-300"
                  >
                    <h4 className="text-lg font-semibold leading-tight">
                      <Textfit mode="multi" min={14} max={17}>
                        {title}
                      </Textfit>
                    </h4>
                  </a>
                </Link>
              )}
              <div className="text-xs text-gray-600 dark:text-gray-300">
                {byline}
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export default Collection
