import * as React from 'react'
import {
  Card,
  CardPreview,
  CardHeader,
  CardContent,
  CardBody,
  CardMeta,
} from './index'
import Image from 'next/image'
import Link from 'next/link'
import Markdown from '../markdown'
import {track} from 'utils/analytics'
import {get} from 'lodash'
import {CardResource} from 'types'

const VerticalResourceCard: React.FC<{
  resource: CardResource
  location?: string
  describe?: boolean
  className?: string
}> = ({
  children,
  resource,
  location,
  className = 'flex flex-col items-center justify-center p-5 py-6 overflow-hidden text-center bg-white border-none rounded-lg shadow-sm dark:bg-gray-800 dark:text-gray-200 sm:py-8',
  describe = false,
  ...props
}) => {
  return (
    <Card {...props} className={className}>
      {resource.image && resource.path ? (
        <ResourceLink path={resource.path} location={location} linkType="image">
          <PreviewImage image={resource.image} title={resource.title} />
        </ResourceLink>
      ) : (
        <PreviewImage image={resource.image} title={resource.title} />
      )}
      <CardContent>
        <CardHeader>
          <h2 className="mb-1 text-xs font-semibold text-gray-700 uppercase dark:text-gray-300">
            {resource.name}
          </h2>
          <ResourceLink path={resource.path} location={location}>
            <h3 className="py-3 text-lg font-bold leading-tighter dark:hover:text-blue-300 hover:text-blue-700">
              {resource.title}
            </h3>
          </ResourceLink>
        </CardHeader>
        <CardMeta className="mt-1 mb-2 text-xs text-gray-600 dark:text-gray-300">
          {resource.byline}
        </CardMeta>
        {describe && (
          <CardBody className="prose-sm prose dark:prose-dark dark:prose-dark-sm max-w-none">
            <Markdown>{resource.description}</Markdown>
          </CardBody>
        )}
      </CardContent>
      {children}
    </Card>
  )
}

const ResourceLink: React.FC<{
  path: string
  location?: string
  className?: string
  linkType?: string
}> = ({children, path, location, linkType = 'text', ...props}) => (
  <Link href={path}>
    <a
      onClick={() => {
        track('clicked resource', {
          resource: path,
          linkType,
          location,
        })
      }}
      {...props}
    >
      {children}
    </a>
  </Link>
)

const PreviewImage: React.FC<{title: string; image: any}> = ({
  title,
  image,
}) => (
  <CardPreview>
    <Image
      src={get(image, 'src', image)}
      width={200}
      height={200}
      quality={100}
      alt={`illustration for ${title}`}
    />
  </CardPreview>
)
export {VerticalResourceCard}
