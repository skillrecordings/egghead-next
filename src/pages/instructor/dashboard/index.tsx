import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {GetServerSideProps} from 'next'
import groq from 'groq'
import {sanityClient} from 'utils/sanity-client'
import {Textfit} from 'react-textfit'
import ReactMarkdown from 'react-markdown'

import {ACCESS_TOKEN_KEY, getTokenFromCookieHeaders} from 'utils/auth'
import {getAbilityFromToken} from 'server/ability'
import fetchEggheadUser from 'api/egghead/users/from-token'
import {isEmpty, truncate} from 'lodash'
import cx from 'classnames'
import ExternalTrackedLink from 'components/external-tracked-link'
import {CardResource} from 'types'
import {
  Card,
  CardAuthor,
  CardBody,
  CardContent,
  CardFooter,
  CardHeader,
} from 'components/card'

type Dependency = {
  version: string
  description: string
  slug: string
  label: string
  image_url: string
}

type DraftCourse = {
  slug: string
  durationInMinutes: number
  dependencies: Dependency[]
  productionProcessState: string
  image: string
} & CardResource

const WIPCard: React.FC<{
  resource: DraftCourse
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
  return (
    <ExternalTrackedLink
      eventName="clicked on wip card"
      params={{location: '/instructor/dashboard'}}
      href={`https://app.egghead.io/playlists/${resource.slug}/edit`}
      target="_blank"
      rel="noopener"
      className="block"
    >
      <Card
        {...props}
        resource={resource}
        className="rounded-md transition-all ease-in-out duration-200 relative overflow-hidden group dark:bg-gray-800 bg-white dark:bg-opacity-60 shadow-smooth dark:hover:bg-gray-700 dark:hover:bg-opacity-50"
      >
        <CardContent className="grid grid-cols-8 gap-5 items-center px-5 py-7">
          <CardHeader className="col-span-3 flex items-center justify-center">
            <Image
              aria-hidden
              src={
                resource.image
                  ? resource.image
                  : resource.dependencies[0].image_url
              }
              width={100}
              height={100}
              quality={100}
              alt=""
            />
          </CardHeader>
          <CardBody className="col-span-5">
            {resource.productionProcessState && (
              <p
                aria-hidden
                className={`uppercase font-medium sm:text-[0.65rem] text-[0.55rem] text-indigo-100 px-2 py-[0.15rem] mb-2 w-fit rounded-lg ${cx(
                  {
                    'bg-blue-700': resource.productionProcessState === 'new',
                    'bg-orange-700':
                      resource.productionProcessState === 'drafting' ||
                      resource.productionProcessState === 'content review',
                    'bg-green-700':
                      resource.productionProcessState === 'pre release',
                  },
                )}`}
              >
                {resource.productionProcessState}
              </p>
            )}
            <Textfit
              mode="multi"
              className="font-medium leading-tight flex items-center h-fit"
              max={22}
            >
              <h3>{resource.title}</h3>
            </Textfit>
            {resource.description && describe && (
              <ReactMarkdown className="prose dark:prose-dark prose-sm dark:text-gray-300 text-gray-700 dark:prose-a:text-blue-300 prose-a:text-blue-500 sm:block hidden">
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
    </ExternalTrackedLink>
  )
}

const Dashboard: React.FunctionComponent<any> = ({courses}) => {
  console.log('queryResult:', courses)
  return (
    <section className="py-10">
      <div className="container mx-auto max-w-xl">
        <h1 className="text-2xl mb-12">Instructor Dashboard</h1>
        <section className="">
          <div className="my-4">
            <h2 className="text-xl">WIP Courses</h2>
            <p className="m-2 text-small leading-snug">
              This is list of your work in progress Courses. Currently when you
              select a course, you will be redirected to app.egghead while we
              build out the authoring experience on the new site.
            </p>
          </div>
          {courses.map((course: any) => {
            return <WIPCard resource={course} />
          })}
        </section>
      </div>
    </section>
  )
}

const transformNameToSanityCollaborator = (name: string) => {
  return `collaborator-instructor-${name.split(' ').join('-').toLowerCase()}`
}

export const getServerSideProps: GetServerSideProps = async function ({req}) {
  const {eggheadToken} = getTokenFromCookieHeaders(req.headers.cookie as string)
  const user = await fetchEggheadUser(eggheadToken, true)

  const sanityCollaborator = transformNameToSanityCollaborator(user.full_name)
  console.log({sanityCollaborator})

  const ability = await getAbilityFromToken(req.cookies[ACCESS_TOKEN_KEY])

  if (ability.can('upload', 'Video')) {
    const testQuery = groq`
    *[_type == 'course']
     ['${sanityCollaborator}' in collaborators[]._ref] 
     [productionProcessState != 'published' && productionProcessState != 'retired'] {
      title,
      description,
      'slug': slug.current,
      productionProcessState,
      durationInMinutes,
      'dependencies': softwareLibraries[]{
            version,
            ...library->{
              description,
              'slug': slug.current,
              path,
              name,
              'label': name,
              'image_url': image.url
            }
          }
    }`

    const courses: any = await sanityClient.fetch(testQuery)

    return {
      props: {
        courses,
      },
    }
  } else {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
}

export default Dashboard
