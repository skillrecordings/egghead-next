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
import analytics from 'utils/analytics'
import CheckIcon from 'components/icons/check'

const HorizontalResourceCard: React.FC<{
  resource: CardResource
  location?: string
  describe?: boolean
  className?: string
  completedCoursesIds?: number[]
  feature?: string
}> = ({
  children,
  resource,
  location,
  className = '',
  describe = true,
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

  const defaultClassName =
    'rounded-md aspect-w-4 aspect-h-2 w-full h-full transition-all ease-in-out duration-200 relative overflow-hidden group dark:bg-gray-800 bg-white dark:bg-opacity-60 shadow-smooth dark:hover:bg-gray-700 dark:hover:bg-opacity-50'
  return (
    <ResourceLink
      path={(resource.path || resource.url) as string}
      location={location as string}
      className={className}
      resource_type={resourceType || ''}
      instructor={resource.instructor?.name}
      tag={resource.tag?.name}
      feature={feature}
    >
      <Card {...props} resource={resource} className={defaultClassName}>
        <CardContent className="grid grid-cols-8 gap-5   items-center px-5 py-2">
          <CardHeader
            className={`col-span-3 flex items-center justify-center ${cx({
              '-ml-32 -my-64': resource.name === 'article',
            })}`}
          >
            <PreviewImage
              name={resourceType || ''}
              image={resource.image}
              title={resource.title || ''}
            />
          </CardHeader>
          <CardBody className="col-span-5">
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
  resource_type: string
  location: string
  tag?: any
  instructor?: string
  className?: string
  linkType?: string
  feature?: string
}> = ({
  children,
  path,
  tag,
  resource_type,
  instructor,
  location,
  linkType = 'text',
  feature,
  ...props
}) => (
  <Link href={path}>
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
      case 'article':
        return 500
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
        'object-cover': name === 'article',
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
