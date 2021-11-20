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

const VerticalResourceCard: React.FC<{
  resource: CardResource
  location?: string
  describe?: boolean
  className?: string
}> = ({
  children,
  resource,
  location,
  className = 'rounded-md aspect-w-3 aspect-h-4 w-full h-full transition-all ease-in-out duration-200 relative overflow-hidden group dark:bg-gray-800 bg-white dark:bg-opacity-60 shadow-smooth dark:hover:bg-gray-700 dark:hover:bg-opacity-50',
  describe = false,
  ...props
}) => {
  if (isEmpty(resource)) return null

  return (
    <ResourceLink path={resource.path} location={location}>
      <Card {...props} resource={resource} className={className}>
        <CardContent className="grid grid-rows-7">
          <CardHeader className="flex items-center justify-center row-span-4">
            <PreviewImage image={resource.image} title={resource.title} />
          </CardHeader>
          <CardMeta className="row-span-2 px-5 text-center">
            <p
              aria-hidden
              className="uppercase font-medium text-[0.65rem] pb-1 text-gray-700 dark:text-indigo-100 opacity-60"
            >
              {resource.name}
            </p>
            <Textfit
              mode="multi"
              className="sm:h-[70px] h-[50px] font-medium text-center leading-tight flex items-center justify-center"
              max={22}
            >
              <h3>{resource.title}</h3>
            </Textfit>
            <CardFooter>
              <CardAuthor />
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
    <CardPreview className="relative flex items-center justify-center w-full xl:max-w-[180px] sm:max-w-[150px] max-w-[90px]">
      <Image
        aria-hidden
        src={get(image, 'src', image)}
        width={180}
        height={180}
        quality={100}
        alt=""
      />
    </CardPreview>
  )
}
export {VerticalResourceCard}
