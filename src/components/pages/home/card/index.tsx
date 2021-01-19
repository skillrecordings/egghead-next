import React, {FunctionComponent} from 'react'
import Markdown from 'react-markdown'
import Link from 'next/link'
import {track} from 'utils/analytics'
import Image from 'next/image'

export type CardResource = {
  path: string
  slug: string
  image: string
  name: string
  title: string
  byline: string
  description?: string
  resources?: CardResource[]
  instructor?: any
}

type CardProps = {
  small?: boolean
  className?: string
  children: React.ReactNode
  padding?: string
  resource?: CardResource
}

const Card: FunctionComponent<CardProps> = ({
  small,
  className = '',
  children,
  padding,
  resource,
  ...restProps
}) => {
  const {name, title, image, resources, description, path} = resource || {}

  return (
    <div
      className={`bg-white shadow-sm rounded-lg overflow-hidden ${
        padding ? padding : 'sm:p-5 p-4'
      } ${className}`}
      {...restProps}
    >
      {image && path && (
        <Link href={path}>
          <a
            onClick={() => {
              track('clicked home page resource', {
                resource: path,
                linkType: 'image',
              })
            }}
            className="block flex-shrink-0 sm:w-auto w-20"
          >
            <Image
              src={image}
              width={160}
              height={160}
              alt={`illustration for ${title}`}
            />
          </a>
        </Link>
      )}
      <div className="flex flex-col justify-center">
        {name && (
          <h2 className="uppercase font-semibold text-xs mb-1 text-gray-700">
            {name}
          </h2>
        )}
        {title &&
          (path ? (
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
                <h3 className="text-xl font-bold tracking-tight leading-tight mb-2">
                  {title}
                </h3>
              </a>
            </Link>
          ) : (
            <h3 className="text-xl font-bold tracking-tight leading-tight mb-2">
              {title}
            </h3>
          ))}
        {description && (
          <Markdown className="prose prose-sm max-w-none mb-3">
            {description}
          </Markdown>
        )}
        {resources
          ? React.Children.map(children, (child) => {
              return React.cloneElement(child as React.ReactElement, {
                resource: resource,
              })
            })
          : children}
      </div>
    </div>
  )
}

export default Card
