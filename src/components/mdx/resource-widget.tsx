import Grid from 'components/grid'
import {VerticalResourceCard} from 'components/card/new-vertical-resource-card'
import {HorizontalResourceCard} from 'components/card/new-horizontal-resource-card'
import cx from 'classnames'
import Image from 'next/image'
import {
  Card,
  CardPreview,
  CardHeader,
  CardContent,
  CardBody,
  CardAuthor,
  CardFooter,
} from 'components/card'
import {CardResource} from 'types'
import {get, isEmpty, truncate} from 'lodash'
import {CheckIcon} from '@heroicons/react/solid'
import {Textfit} from 'react-textfit'
import ReactMarkdown from 'react-markdown'
import Link from 'next/link'
import analytics from 'utils/analytics'
import {twMerge} from 'tailwind-merge'

const ResourceLink: React.FC<
  React.PropsWithChildren<{
    path: string
    resource_type: string
    location: string
    tag?: any
    instructor?: string
    className?: string
    linkType?: string
    feature?: string
  }>
> = ({
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

export const PreviewImage: React.FC<
  React.PropsWithChildren<{title: string; image: any; name: string}>
> = ({image, name}) => {
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
      className={`relative flex items-center justify-center w-full top-28 ${cx({
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
        objectFit={name === 'article' ? 'cover' : 'contain'}
        quality={100}
        alt=""
      />
    </CardPreview>
  )
}

const SquareResourceCard: React.FC<
  React.PropsWithChildren<{
    resource: CardResource
    location?: string
    describe?: boolean
    className?: string
    completedCoursesIds?: number[]
    feature?: string
  }>
> = ({
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
    'rounded-md aspect-w-4 aspect-h-4 w-full h-full transition-all ease-in-out duration-200 relative overflow-hidden group dark:bg-gray-800 bg-white dark:bg-opacity-60 shadow-smooth dark:hover:bg-gray-700 dark:hover:bg-opacity-50 max-w-[344px]'
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
        <CardContent className="grid grid-rows-9 gap-2 items-center px-5 py-2">
          <CardHeader
            className={`row-span-3 flex items-center justify-center overflow-hidden ${cx(
              {
                '-mt-56 -mx-5': resource.name === 'article',
              },
            )}`}
          >
            <PreviewImage
              name={resourceType || ''}
              image={resource.image}
              title={resource.title || ''}
            />
          </CardHeader>
          <CardBody className="row-span-4">
            {resource.name && (
              <div className="flex items-center gap-1 mb-1">
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
                {resource.byline && (
                  <span className=" rounded-bl-none rounded-tr-none rounded-md transition-all ease-in-out duration-200 uppercase font-medium lg:text-[0.65rem] text-[0.55rem] text-gray-700 dark:text-indigo-100 opacity-60">
                    • {resource.byline}
                  </span>
                )}
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
                {truncate(resource.description, {length: 90})}
              </ReactMarkdown>
            )}
          </CardBody>
        </CardContent>
        {children}
      </Card>
    </ResourceLink>
  )
}

const VerticalResourceCardForWidget: React.FC<
  React.PropsWithChildren<{
    resource: any
    location?: string
    className?: string
  }>
> = ({resource, location, className}: any) => {
  return (
    <div className={twMerge('relative group', className)}>
      {resource?.byline && (
        <span className="absolute top-0 left-0 z-10 bg-gray-100 dark:bg-gray-800 rounded-bl-none rounded-tr-none rounded-md px-2 p-1 dark:group-hover:bg-gray-700 dark:group-hover:bg-opacity-50 transition-all ease-in-out duration-200 uppercase font-medium lg:text-[0.65rem] text-[0.55rem] text-gray-700 dark:text-indigo-100">
          {resource.byline}
        </span>
      )}
      <VerticalResourceCard
        location={location}
        key={resource.slug}
        resource={resource}
        className=""
      />
    </div>
  )
}

const HorizontalResourceCardForWidget: React.FC<
  React.PropsWithChildren<{
    resource: any
    location?: string
    className?: string
  }>
> = ({resource, location, className}: any) => {
  return (
    <div className={twMerge('relative group', className)}>
      {resource?.byline && (
        <span className="absolute top-0 left-0 z-10 bg-gray-100 dark:bg-gray-800 rounded-bl-none rounded-tr-none rounded-md px-2 p-1 dark:group-hover:bg-gray-700 dark:group-hover:bg-opacity-50 transition-all ease-in-out duration-200 uppercase font-medium lg:text-[0.65rem] text-[0.55rem] text-gray-700 dark:text-indigo-100">
          {resource.byline}
        </span>
      )}
      <SquareResourceCard
        location={location}
        key={resource.slug}
        resource={resource}
        className=""
      />
    </div>
  )
}

const ResourceWidget: React.FC<
  React.PropsWithChildren<{
    resource: any
    cta?: string
    location?: string
  }>
> = ({resource, location}: any) => {
  const {podcasts, talks, collections, articles} = resource
  return (
    <>
      {articles.length > 0 ? null : (
        <h3 className="prose dark:prose-dark sm:prose-xl lg:prose-2xl max-w-none dark:prose-a:text-blue-300 prose-a:text-blue-500 font-bold mb-4">
          {resource.title}
        </h3>
      )}
      {collections &&
        collections.map((collection: any) => {
          return (
            <div key={collection.slug}>
              <h4 className="prose dark:prose-dark sm:prose-lg lg:prose-xl mt-5 max-w-none dark:prose-a:text-blue-300 prose-a:text-blue-500 font-bold">
                {collection.title}
              </h4>
              <Grid>
                {collection.courses.map((resource: any, i: number) => {
                  switch (collection.courses.length) {
                    case 3:
                      return i === 0 ? (
                        <HorizontalResourceCardForWidget
                          location={location}
                          className="col-span-2"
                          key={resource.slug}
                          resource={resource}
                        />
                      ) : (
                        <VerticalResourceCardForWidget
                          location={location}
                          key={resource.slug}
                          resource={resource}
                        />
                      )
                    case 6:
                      return i === 0 || i === 1 ? (
                        <HorizontalResourceCardForWidget
                          location={location}
                          className="col-span-2"
                          key={resource.slug}
                          resource={resource}
                        />
                      ) : (
                        <VerticalResourceCardForWidget
                          location={location}
                          key={resource.slug}
                          resource={resource}
                        />
                      )
                    case 7:
                      return i === 0 ? (
                        <HorizontalResourceCardForWidget
                          location={location}
                          className="col-span-2"
                          key={resource.slug}
                          resource={resource}
                        />
                      ) : (
                        <VerticalResourceCardForWidget
                          location={location}
                          key={resource.slug}
                          resource={resource}
                        />
                      )
                    default:
                      return (
                        <VerticalResourceCardForWidget
                          location={location}
                          key={resource.slug}
                          resource={resource}
                        />
                      )
                  }
                })}
              </Grid>
            </div>
          )
        })}
      {articles.length > 0 && (
        <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-md">
          <h3 className="prose dark:prose-dark sm:prose-xl lg:prose-2xl max-w-none dark:prose-a:text-blue-300 prose-a:text-blue-500 font-bold mb-4">
            {resource.title}
          </h3>
          <p className="prose dark:prose-dark sm:prose-lg lg:prose-xl max-w-none dark:prose-a:text-blue-300 prose-a:text-blue-500 mb-4">
            {' '}
            {resource.description}{' '}
          </p>
          <Grid className="hidden sm:grid sm:grid-cols-4 gap-4">
            {articles?.map((article: any, i: number) => {
              switch (articles.length) {
                case 1: {
                  return (
                    <HorizontalResourceCard
                      location={location}
                      className="col-span-3 md:col-span-4 dark:bg-gray-600 rounded-md"
                      key={article.slug}
                      resource={article}
                    />
                  )
                }
                case 2: {
                  return i === 0 ? (
                    <SquareResourceCard
                      location={location}
                      className="col-span-2 dark:bg-gray-600 rounded-md"
                      key={article.slug}
                      resource={article}
                    />
                  ) : (
                    <SquareResourceCard
                      location={location}
                      key={article.slug}
                      resource={article}
                      className="col-span-2 dark:bg-gray-600 rounded-md"
                    />
                  )
                }
                default:
                  return (
                    <VerticalResourceCardForWidget
                      location={location}
                      key={article.slug}
                      resource={article}
                      className="dark:bg-gray-600 rounded-md"
                    />
                  )
              }
            })}
          </Grid>
          <Grid className="sm:hidden grid gap-4">
            {articles?.map((article: any, i: number) => {
              return (
                <HorizontalResourceCardForWidget
                  location={location}
                  className="col-span-2 dark:bg-gray-600"
                  key={article.slug}
                  resource={article}
                />
              )
            })}
          </Grid>
        </div>
      )}
      {(podcasts || talks) && (
        <Grid className="grid grid-cols-2 gap-2 md:grid-cols-4 xl:gap-5 sm:gap-3 ">
          {talks.map((talk: any) => {
            return (
              <VerticalResourceCard
                key={talk.slug}
                resource={talk}
                location={location}
              />
            )
          })}
          {podcasts.map((podcast: any) => {
            return (
              <VerticalResourceCard
                key={podcast.slug}
                resource={podcast}
                location={location}
              />
            )
          })}
        </Grid>
      )}
    </>
  )
}

export default ResourceWidget
