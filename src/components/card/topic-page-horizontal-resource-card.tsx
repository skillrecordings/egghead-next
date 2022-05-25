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

const Button = ({path, cta}: any) => {
  return (
    <Link href={path}>
      <a className="inline-flex text-center justify-center items-center mt-4 px-5 py-3 rounded-md bg-blue-600 text-white transition-all hover:bg-blue-700 ease-in-out duration-200 sm:block hidden">
        {cta}
      </a>
    </Link>
  )
}

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
  left = true,
  ...props
}) => {
  if (isEmpty(resource)) return null
  const defaultClassName =
    'rounded-md aspect-w-4 aspect-h-2 w-full h-full transition-all ease-in-out duration-200 relative overflow-hidden group shadow-smooth'
  return (
    <Card {...props} resource={resource} className={defaultClassName}>
      <CardContent className="grid grid-cols-8 gap-5 items-center px-8 py-2">
        {left && (
          <CardHeader className="col-span-3 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <ResourceLink
                path={(resource.path || resource.url) as string}
                location={location}
                className={className}
              >
                <PreviewImage
                  name={resource.byline}
                  image={resource.image}
                  title={resource.title}
                />
                <Button cta={resource.cta} path={resource.path} />
              </ResourceLink>
            </div>
          </CardHeader>
        )}
        <CardBody className="col-span-5">
          <ResourceLink
            path={(resource.path || resource.url) as string}
            location={location}
            className={className}
          >
            <Textfit
              mode="multi"
              className="h-[46px] font-medium leading-tight flex items-center"
              max={22}
            >
              <h3>{resource.title}</h3>
            </Textfit>
          </ResourceLink>
          {resource.byline && (
            <p
              aria-hidden
              className="mt-1 uppercase font-medium sm:text-[0.65rem] text-[0.55rem] text-gray-700 dark:text-indigo-100 opacity-60"
            >
              {resource.byline}
            </p>
          )}
          {resource.meta && (
            <p
              aria-hidden
              className="mt-1 font-medium sm:text-[0.65rem] text-[0.55rem] text-gray-700 dark:text-indigo-100 opacity-60"
            >
              {resource.meta}
            </p>
          )}
          {resource.description && describe && (
            <ReactMarkdown className="py-2 prose dark:prose-dark prose-sm dark:text-gray-300 text-gray-700 dark:prose-a:text-blue-300 prose-a:text-blue-500 sm:block hidden">
              {truncate(resource.description, {length: 450})}
            </ReactMarkdown>
          )}
          <CardFooter>
            <CardAuthor className="flex items-center md:pt-0 pt-2" />
          </CardFooter>
        </CardBody>
        {!left && (
          <CardHeader className="col-span-3 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <PreviewImage
                name={resource.byline}
                image={resource.image}
                title={resource.title}
              />
              <Button cta={resource.cta} path={resource.path} />
            </div>
          </CardHeader>
        )}
      </CardContent>
      {children}
    </Card>
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
