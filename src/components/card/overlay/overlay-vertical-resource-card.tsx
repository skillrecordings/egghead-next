import * as React from 'react'
import {
  Card,
  CardHeader,
  CardContent,
  CardMeta,
  CardAuthor,
  CardFooter,
  CardPreview,
} from '../index'
import Image from 'next/image'
import Link from 'next/link'
import {get, isEmpty} from 'lodash'
import {CardResource} from 'types'
import analytics from 'utils/analytics'
import {twMerge} from 'tailwind-merge'

const VerticalResourceCard: React.FC<{
  resource: CardResource
  location?: string
  className?: string
  feature?: string
}> = ({children, resource, location, className, feature, ...props}) => {
  if (isEmpty(resource)) return null

  return (
    <ResourceLink
      path={(resource.path || resource.url) as string}
      location={location as string}
      className={className}
      resource_type={resource.name || ''}
      instructor={resource.instructor?.name}
      tag={resource.tag?.name}
      feature={feature}
    >
      <Card
        {...props}
        resource={resource}
        className="rounded-md aspect-w-3 aspect-h-4 w-full h-full transition-all ease-in-out duration-200  dark:bg-gray-800 bg-white dark:bg-opacity-60 shadow-smooth dark:hover:bg-gray-700 dark:hover:bg-opacity-50 overflow-hidden"
      >
        <CardContent className="flex flex-col items-center justify-center xl:p-5 p-2 pt-5">
          <CardPreview className="flex flex-col items-center">
            <div className="relative">
              <Image
                src={get(resource.image, 'src', resource.image)}
                width={120}
                height={120}
                layout="fixed"
                className="transition ease-in-out hover:scale-110 duration-100 object-cover rounded-md"
                alt={`illustration for ${resource.title}`}
              />
            </div>
          </CardPreview>
          <CardMeta
            className={`row-span-3 text-center flex flex-col items-center justify-center `}
          >
            <CardHeader className="mx-4 mt-4 mb-2">
              <h3 className="text-lg lg:text-xl font-semi-bold leading-tighter dark:text-white dark:hover:text-blue-300 text-center">
                {resource.title}
              </h3>
            </CardHeader>
            <CardFooter>
              <CardAuthor />
            </CardFooter>
          </CardMeta>
        </CardContent>
      </Card>
    </ResourceLink>
  )
}

export const ResourceLink: React.FC<{
  path: string
  resource_type: string
  location: string
  tag?: any
  className?: string
  instructor?: string
  linkType?: string
  target?: '_blank' | '_self'
  feature?: string
}> = ({
  children,
  path,
  tag,
  resource_type,
  instructor,
  location,
  className,
  linkType = 'text',
  target,
  feature,
  ...props
}) => (
  <Link
    href={path}
    className={twMerge('flex flex-col justify-center items-center', className)}
  >
    <a
      onClick={() => {
        if (feature) {
          analytics.events.activityInternalLinkClick(
            resource_type,
            location,
            tag,
            path,
            instructor,
            feature,
          )
        } else {
          analytics.events.activityInternalLinkClick(
            resource_type,
            location,
            tag,
            path,
            instructor,
          )
        }
      }}
      target={target || '_self'}
      {...props}
    >
      {children}
    </a>
  </Link>
)

export {VerticalResourceCard}
