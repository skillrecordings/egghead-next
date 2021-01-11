import React, {FunctionComponent} from 'react'
import Card from 'components/pages/home/card'
import Markdown from 'react-markdown'
import Link from 'next/link'
import Image from 'next/image'
import {track} from 'utils/analytics'
import {map} from 'lodash'
import Textfit from 'react-textfit'

type Resource = {
  path: string
  image: string
  name: string
  title: string
  byline: string
  description: string
  resources: Resource[]
}

type CollectionProps = {
  resource: Resource
  children?: React.ReactElement
  className?: string
}

const Collection: FunctionComponent<CollectionProps> = ({
  resource,
  className,
}) => {
  const {resources} = resource
  return (
    <ul>
      {map(resources, (resource) => {
        const {title, path, image, byline} = resource
        const isLesson = path.includes('lessons')
        const imageSize = isLesson ? 32 : 50
        return (
          <li
            key={resource.path}
            className={`flex items-center py-2 ${className ? className : ''}`}
          >
            {image && (
              <Link href={path}>
                <a
                  onClick={() => {
                    track('clicked home page resource', {
                      resource: path,
                      linkType: 'image',
                    })
                  }}
                  className="sm:w-12 w-12 flex-shrink-0 flex justify-center items-center "
                >
                  <Image
                    src={image}
                    width={imageSize}
                    height={imageSize}
                    alt={`illustration for ${title}`}
                  />
                </a>
              </Link>
            )}
            <div className="ml-3">
              <Link href={path}>
                <a
                  onClick={() => {
                    track('clicked home page resource', {
                      resource: path,
                      linkType: 'text',
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
