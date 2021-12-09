import * as React from 'react'
import {
  Card,
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
  small?: boolean
}> = ({
  children,
  resource,
  location,
  className = 'rounded-md aspect-w-3 aspect-h-4 w-full h-full transition-all ease-in-out duration-200 relative overflow-hidden group dark:bg-gray-800 bg-white dark:bg-opacity-60 shadow-smooth dark:hover:bg-gray-700 dark:hover:bg-opacity-50',
  describe = false,
  small = false,
  ...props
}) => {
  if (isEmpty(resource)) return null

  return (
    <ResourceLink path={resource.path} location={location}>
      <Card {...props} resource={resource} className={className}>
        <CardContent className="grid grid-rows-6 xl:p-5 p-2 pt-5">
          <CardHeader className={`row-span-3 relative `}>
            <PreviewImage
              small={small}
              image={resource.image}
              title={resource.title}
            />
          </CardHeader>
          <CardMeta
            className={`row-span-3 text-center flex flex-col items-center justify-center `}
          >
            {resource.name && (
              <p
                aria-hidden
                className="uppercase font-medium lg:text-[0.65rem] text-[0.55rem] pb-1 text-gray-700 dark:text-indigo-100 opacity-60"
              >
                {resource.name}
              </p>
            )}
            <Textfit
              mode="multi"
              className={`lg:h-[70px] h-[45px] font-medium text-center leading-tight flex items-center justify-center`}
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

const PreviewImage: React.FC<{title: string; image: any; small?: boolean}> = ({
  title,
  image,
  small,
}) => {
  if (!image) return null

  return (
    <Image
      aria-hidden
      src={get(image, 'src', image)}
      objectFit="contain"
      layout="fill"
      quality={100}
      alt=""
    />
  )
}
export {VerticalResourceCard}
