import React, {FunctionComponent} from 'react'
import Markdown from 'react-markdown'
import Link from 'next/link'
import {track} from 'utils/analytics'
import Image from 'next/image'
import {get} from 'lodash'

export type CardResource = {
  path: string
  slug: string
  image: string | {src: string; alt: string}
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
  children?: React.ReactNode
  resource?: CardResource
  location?: string
}

const Card: FunctionComponent<CardProps> = ({
  small,
  className,
  children,
  resource,
  location = 'home',
  ...restProps
}) => {
  const {name, title, image, byline, resources, description, path} =
    resource || {}

  return (
    <div
      className={`bg-white dark:bg-trueGray-800 dark:text-trueGray-200 shadow-sm rounded-lg overflow-hidden sm:p-5 p-4 ${
        className ? className : ''
      }`}
      {...restProps}
    >
      <div>
        {image && path && (
          <Link href={path}>
            <a
              onClick={() => {
                track('clicked home page resource', {
                  resource: path,
                  linkType: 'image',
                  location,
                })
              }}
              className="block flex-shrink-0 sm:w-auto w-20 mx-auto"
            >
              <Image
                src={get(image, 'src', image)}
                width={140}
                height={140}
                alt={`illustration for ${title}`}
              />
            </a>
          </Link>
        )}
        <div className="flex flex-col justify-center">
          {name && (
            <h2 className="uppercase font-semibold text-xs mb-1 text-gray-700 dark:text-gray-300">
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
                      location,
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
          {byline && (
            <div className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              {byline}
            </div>
          )}
          {description && (
            <Markdown className="prose prose-sm dark:prose-dark dark:prose-dark-sm max-w-none mb-3">
              {description}
            </Markdown>
          )}
        </div>
      </div>
      {resources
        ? React.Children.map(children, (child) => {
            return React.cloneElement(child as React.ReactElement, {
              resource: resource,
              location,
            })
          })
        : children}
    </div>
  )
}

export default Card
