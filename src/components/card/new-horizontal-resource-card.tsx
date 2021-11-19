import * as React from 'react'
import {
  Card,
  CardPreview,
  CardHeader,
  CardContent,
  CardBody,
  CardMeta,
  CardAuthor,
  CardFooter,
} from './index'
import Image from 'next/image'
import Link from 'next/link'
import Markdown from '../markdown'
import {track} from 'utils/analytics'
import {get, isEmpty} from 'lodash'
import {CardResource} from 'types'
import {Textfit} from 'react-textfit'
import ReactMarkdown from 'react-markdown'

const HorizontalResourceCard: React.FC<{
  resource: CardResource
  location?: string
  describe?: boolean
  className?: string
}> = ({
  children,
  resource,
  location,
  className = '',
  describe = false,
  ...props
}) => {
  if (isEmpty(resource)) return null
  const defaultClassName =
    'rounded-md sm:aspect-w-4 aspect-w-3 sm:aspect-h-2 aspect-h-4 w-full h-full transition-all ease-in-out duration-200 relative overflow-hidden group dark:bg-gray-800 bg-white dark:bg-opacity-60 shadow-smooth dark:hover:bg-gray-700 dark:hover:bg-opacity-50'
  return (
    <ResourceLink
      path={resource.path}
      location={location}
      className={className}
    >
      <Card {...props} resource={resource} className={defaultClassName}>
        <CardContent className="grid sm:grid-cols-8 sm:gap-5 items-center px-5">
          <CardHeader className="sm:col-span-3 flex items-center justify-center">
            <PreviewImage image={resource.image} title={resource.title} />
          </CardHeader>
          <CardMeta className="sm:col-span-5">
            <p
              aria-hidden
              className="uppercase font-medium text-[0.65rem] pb-1 text-gray-700 dark:text-indigo-100 opacity-60"
            >
              {resource.name}
            </p>
            <Textfit
              mode="multi"
              className="sm:h-[70px] h-[50px] font-medium leading-tight flex items-center"
              max={22}
            >
              <h3>{resource.title}</h3>
            </Textfit>
            {resource.description && (
              <ReactMarkdown className="pt-2 prose dark:prose-dark prose-sm dark:text-gray-300 text-gray-700">
                {resource.description}
              </ReactMarkdown>
            )}
            <CardFooter>
              <CardAuthor className="flex items-center pt-4" />
            </CardFooter>
          </CardMeta>
          {describe && (
            <CardBody className="prose dark:prose-dark dark:prose-dark-sm prose-sm max-w-none">
              <Markdown>{resource.description}</Markdown>
            </CardBody>
          )}
        </CardContent>
        {children}
      </Card>
    </ResourceLink>
  )
}

export const ResourceLink: React.FC<{
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
}) => {
  if (!image) return null

  return (
    <CardPreview className="relative flex items-center justify-center w-full xl:max-w-[200px] sm:max-w-[150px] max-w-[150px]">
      <Image
        aria-hidden
        src={get(image, 'src', image)}
        width={200}
        height={200}
        quality={100}
        alt=""
      />
    </CardPreview>
  )
}
export {HorizontalResourceCard}
