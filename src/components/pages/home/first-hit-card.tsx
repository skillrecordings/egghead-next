import * as React from 'react'
import {
  Card,
  CardHeader,
  CardContent,
  CardBody,
  CardMeta,
  CardAuthor,
  CardFooter,
} from '@/components/card'
import Image from 'next/legacy/image'
import Link from 'next/link'
import Markdown from '@/components/markdown'
import {get, isEmpty} from 'lodash'
import {CardResource} from '@/types'
import {Textfit} from 'react-textfit'
import analytics from '@/utils/analytics'
import Heading from '@/components/card/heading'
import CheckIcon from '@/components/icons/check'
import cx from 'classnames'

const FirstHitCard: React.FC<
  React.PropsWithChildren<{
    resource: CardResource
    location?: string
    describe?: boolean
    className?: string
    small?: boolean
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p'
    completedCoursesIds?: number[]
    feature?: string
  }>
> = ({
  children,
  resource,
  location,
  className,
  describe = false,
  small = false,
  as,
  completedCoursesIds,
  feature,
  ...props
}) => {
  if (isEmpty(resource)) return null
  const {externalId} = resource
  const isCourseCompleted =
    !isEmpty(completedCoursesIds) &&
    externalId &&
    completedCoursesIds?.some((courseId: number) => courseId === externalId)

  const resourceType =
    resource.name === 'landing-page' ? 'guide' : resource.name
  return (
    <ResourceLink
      path={(resource.path || resource.url) as string}
      location={location as string}
      target={resource.url ? '_blank' : undefined}
      resource_type={resourceType || ''}
      instructor={resource?.instructor?.name}
      tag={resource.tag?.name}
      className={className}
      feature={feature}
    >
      {resource.image ? (
        <HitCardWithImage
          resource={resource}
          resourceType={resourceType}
          isCourseCompleted={isCourseCompleted}
          small={small}
          as={as}
          describe={describe}
          {...props}
        >
          {children}
        </HitCardWithImage>
      ) : (
        <HitCardNoImage
          resource={resource}
          resourceType={resourceType}
          isCourseCompleted={isCourseCompleted}
          small={small}
          as={as}
          describe={describe}
          {...props}
        >
          {children}
        </HitCardNoImage>
      )}
    </ResourceLink>
  )
}

interface HitCardProps {
  resource: CardResource
  resourceType: string
  isCourseCompleted?: number | boolean
  small?: boolean
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p'
  describe?: boolean
  children?: React.ReactNode
}

function HitCardWithImage({
  resource,
  resourceType,
  isCourseCompleted,
  small,
  as,
  describe,
  children,
  ...props
}: HitCardProps) {
  const trimmedDescription = truncateDescription(resource.description)
  return (
    <Card
      {...props}
      resource={resource}
      className="flex justify-center items-center rounded-md aspect-[3/4] w-full h-full transition-all ease-in-out duration-200 relative overflow-hidden group dark:bg-gray-800 bg-white dark:bg-opacity-60 shadow-smooth dark:hover:bg-gray-700 dark:hover:bg-opacity-50 px-8"
    >
      {resource.background && (
        <Image
          src={resource.background}
          layout="fill"
          objectFit="cover"
          alt=""
          aria-hidden="true"
        />
      )}
      <CardContent className="flex flex-col items-center p-2 pt-5">
        <CardHeader
          className={`
          w-fit
          relative 
          justify-center
          items-center
          ${cx({
            '-mx-5 -mt-5': resource.name === 'article',
          })}
          `}
        >
          <PreviewImage
            small={small}
            image={resource.image}
            title={resource.title || ''}
            resourceType={resourceType}
          />
        </CardHeader>
        <CardMeta
          className={`row-span-3 text-center flex flex-col items-center justify-center pt-6`}
        >
          {resource.name && (
            <div className="flex items-center mb-1">
              {isCourseCompleted && (
                <span title="Course completed" className=" text-green-500">
                  <CheckIcon />
                </span>
              )}
              <p
                aria-hidden
                className="uppercase font-medium lg:text-[0.65rem] text-[0.55rem] text-gray-700 dark:text-indigo-100 opacity-60"
              >
                {resourceType}
              </p>
            </div>
          )}
          <Textfit
            mode="multi"
            className={`lg:h-[70px] h-[45px] font-medium text-center leading-tight flex items-center justify-center w-full`}
            max={22}
          >
            <Heading as={as}>{resource.title}</Heading>
          </Textfit>
          {describe && (
            <CardBody className="prose dark:prose-dark max-w-none pb-4 text-center opacity-80 dark:prose-a:text-blue-300 prose-a:text-blue-500 leading-tight text-sm pt-2 sm:pt-0">
              <Markdown>{trimmedDescription}</Markdown>
            </CardBody>
          )}
          <CardFooter>
            <CardAuthor />
          </CardFooter>
        </CardMeta>
      </CardContent>
      {children}
    </Card>
  )
}

function HitCardNoImage({
  resource,
  resourceType,
  isCourseCompleted,
  small,
  as,
  describe,
  children,
  ...props
}: HitCardProps) {
  const shortDescription = truncateDescription(resource.description)

  console.log(shortDescription)
  return (
    <Card
      {...props}
      resource={resource}
      className="flex justify-center items-center rounded-md aspect-[3/4] w-full h-full transition-all ease-in-out duration-200 relative overflow-hidden group dark:bg-gray-800 bg-white dark:bg-opacity-60 shadow-smooth dark:hover:bg-gray-700 dark:hover:bg-opacity-50 px-8"
    >
      {resource.background && (
        <Image
          src={resource.background}
          layout="fill"
          objectFit="cover"
          alt=""
          aria-hidden="true"
        />
      )}
      <CardContent className="flex flex-col p-2 pt-5">
        <CardHeader
          className={`
          w-fit
          relative 
          justify-center
          items-center
          -mx-5 -mt-5
          `}
        >
          <Textfit
            mode="multi"
            className={`lg:h-[70px] h-[45px] font-medium text-center leading-tight flex items-center justify-center w-full`}
            max={22}
          >
            <Heading as={as} className="text-xl">
              {resource.title}
            </Heading>
          </Textfit>
        </CardHeader>
        <CardMeta
          className={`row-span-3 text-center flex flex-col items-center justify-center pt-6`}
        >
          {resource.name && (
            <div className="flex items-center mb-1">
              {isCourseCompleted && (
                <span title="Course completed" className=" text-green-500">
                  <CheckIcon />
                </span>
              )}
              <p
                aria-hidden
                className="uppercase font-medium lg:text-[0.65rem] text-[0.55rem] text-gray-700 dark:text-indigo-100 opacity-60"
              >
                {resourceType}
              </p>
            </div>
          )}
          {describe && (
            <CardBody className="prose dark:prose-dark max-w-none pb-4 text-center opacity-80 dark:prose-a:text-blue-300 prose-a:text-blue-500 leading-tight text-sm pt-2 sm:pt-0">
              <Markdown>{shortDescription}</Markdown>
            </CardBody>
          )}
          <CardFooter>
            <CardAuthor />
          </CardFooter>
        </CardMeta>
      </CardContent>
      {children}
    </Card>
  )
}

function truncateDescription(description: string) {
  if (!description) return ''
  const cleanedDescription = description.replace(/\n/g, ' ').trim()
  console.log({cleanedDescription})
  return `${cleanedDescription.split('.')[0].substring(0, 120)}...`
}

export const ResourceLink: React.FC<
  React.PropsWithChildren<{
    path: string
    resource_type: string
    location: string
    tag?: any
    className?: string
    instructor?: string
    linkType?: string
    target?: '_blank' | '_self'
    feature?: string
  }>
> = ({
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
    className={className}
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
  </Link>
)

const PreviewImage: React.FC<
  React.PropsWithChildren<{
    title: string
    image: any
    small?: boolean
    resourceType: string
  }>
> = ({title, image, small, resourceType}) => {
  if (!image) return null

  return (
    <Image
      aria-hidden
      src={get(image, 'src', image)}
      objectFit={resourceType === 'article' ? 'cover' : 'contain'}
      width={150}
      height={150}
      quality={100}
      alt=""
    />
  )
}
export {FirstHitCard}
