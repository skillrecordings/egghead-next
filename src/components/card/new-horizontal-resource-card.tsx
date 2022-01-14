import * as React from 'react'
import {
  Card,
  CardPreview,
  CardHeader,
  CardContent,
  CardBody,
  CardAuthor,
  CardFooter,
} from './index'
import Image from 'next/image'
import Link from 'next/link'
import {track} from 'utils/analytics'
import {get, isEmpty} from 'lodash'
import {CardResource} from 'types'
import {Textfit} from 'react-textfit'
import ReactMarkdown from 'react-markdown'
import cx from 'classnames'
import truncate from 'lodash/truncate'

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
  describe = true,
  ...props
}) => {
  if (isEmpty(resource)) return null
  const defaultClassName =
    'rounded-md aspect-w-4 aspect-h-2 w-full h-full transition-all ease-in-out duration-200 relative overflow-hidden group dark:bg-gray-800 bg-white dark:bg-opacity-60 shadow-smooth dark:hover:bg-gray-700 dark:hover:bg-opacity-50'
  return (
    <ResourceLink
      path={(resource.path || resource.url) as string}
      location={location}
      className={className}
    >
      <Card {...props} resource={resource} className={defaultClassName}>
        <CardContent className="grid grid-cols-8 gap-5 items-center px-5 py-2">
          <CardHeader className="col-span-3 flex items-center justify-center">
            <PreviewImage
              name={resource.name}
              image={resource.image}
              title={resource.title}
            />
          </CardHeader>
          <CardBody className="col-span-5">
            {resource.name && (
              <p
                aria-hidden
                className="uppercase font-medium sm:text-[0.65rem] text-[0.55rem] pb-1 text-gray-700 dark:text-indigo-100 opacity-60"
              >
                {resource.name}
              </p>
            )}
            <Textfit
              mode="multi"
              className="lg:h-[65px] md:h-[50px] sm:h-[50px] h-[46px] font-medium leading-tight flex items-center"
              max={22}
            >
              <h3>{resource.title}</h3>
            </Textfit>
            {resource.description && describe && (
              <ReactMarkdown className="py-2 prose dark:prose-dark prose-sm dark:text-gray-300 text-gray-700 dark:prose-a:text-blue-300 prose-a:text-blue-500 sm:block hidden">
                {truncate(resource.description, {length: 120})}
              </ReactMarkdown>
            )}
            <CardFooter>
              <CardAuthor className="flex items-center md:pt-0 pt-2" />
            </CardFooter>
          </CardBody>
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

const PreviewImage: React.FC<{title: string; image: any; name: string}> = ({
  image,
  name,
}) => {
  if (!image) return null

  const getSize = (name: string) => {
    switch (name) {
      case 'lesson':
        return 40
      case 'talk':
        return 80
      default:
        return 200
    }
  }
  return (
    <CardPreview
      className={`relative flex items-center justify-center w-full ${cx({
        'max-w-[40px]': name === 'lesson',
        'max-w-[80px]': name === 'talk',
        'xl:max-w-[200px] sm:max-w-[150px] max-w-[100px]': name === 'course',
      })}`}
    >
      <Image
        aria-hidden
        src={get(image, 'src', image)}
        width={getSize(name)}
        height={getSize(name)}
        quality={100}
        alt=""
      />
    </CardPreview>
  )
}
export {HorizontalResourceCard}
