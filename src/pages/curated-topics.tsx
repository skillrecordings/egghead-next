import React, {FunctionComponent} from 'react'
import Link from 'next/link'
import Image from 'next/image'
import find from 'lodash/find'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'
import {track} from 'utils/analytics'
import axios from 'utils/configured-axios'
import {CardResource} from 'types'
import {
  VerticalResourceCard,
  ResourceLink,
} from 'components/card/new-vertical-resource-card'
import PlayIcon from 'components/pages/courses/play-icon'
import {CourseGrid} from 'lib/holiday-sale'
import Grid from 'components/grid'
import groq from 'groq'
import {sanityClient} from 'utils/sanity-client'
import {loadHolidayCourses, holidaySaleOn} from 'lib/holiday-sale'
import {useRouter} from 'next/router'
import {Form, Formik} from 'formik'
import {NextSeo} from 'next-seo'
import ReactMarkdown from 'react-markdown'
import {HorizontalResourceCard} from 'components/card/new-horizontal-resource-card'

const CuratedTopics: FunctionComponent<any> = ({data, holidayCourses}) => {
  const location = 'home landing'
  const jumbotron = find(data.sections, {slug: 'jumbotron'})
  const ogImage = get(jumbotron, 'resources[0].ogImage')

  return (
    <>
      <NextSeo
        // canonical={process.env.NEXT_PUBLIC_DEPLOYMENT_URL}
        openGraph={{
          images: [
            {
              url: ogImage
                ? ogImage
                : 'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1632239045/og-image-assets/egghead-og-image.png',
            },
          ],
        }}
      />
      <div className="dark:bg-gray-900 bg-gray-100">
        {!isEmpty(holidayCourses) ? (
          <div className="container">
            <CourseGrid data={holidayCourses} />
          </div>
        ) : (
          <div className="md:container">
            <Jumbotron data={jumbotron} />
          </div>
        )}
        <div className="container">
          <main className="sm:pt-16 pt-8">
            {data.sections
              .filter((s: any) => s.slug !== 'jumbotron')
              .map((section: any, i: number) => {
                return section.slug === 'topics' ? (
                  <Topics data={section} />
                ) : (
                  <section className="pb-16" key={section.id}>
                    {!section.image && !section.description ? (
                      // simple section
                      <div className="flex w-full pb-6 items-center justify-between">
                        <h2 className="lg:text-2xl sm:text-xl text-lg dark:text-white font-semibold leading-tight">
                          {section.title}
                        </h2>
                      </div>
                    ) : (
                      // section with image and description
                      <div className="flex md:flex-row flex-col md:items-start items-center justify-center w-full mb-5 pb-8">
                        {section.image && (
                          <div className="flex-shrink-0 md:max-w-none max-w-[200px]">
                            <Image
                              aria-hidden
                              src={section.image}
                              quality={100}
                              width={320}
                              height={320}
                              alt=""
                            />
                          </div>
                        )}
                        <div>
                          <h2 className="w-full lg:text-2xl sm:text-xl text-lg dark:text-white font-semibold leading-tight pb-4">
                            {section.title}
                          </h2>
                          {section.description && (
                            <ReactMarkdown className="prose sm:prose prose-sm dark:prose-dark dark:text-gray-300 text-gray-700">
                              {section.description}
                            </ReactMarkdown>
                          )}
                        </div>
                      </div>
                    )}
                    <Grid>
                      {section.resources.map(
                        (resource: CardResource, i: number) => {
                          // if there are only 3 resources, the first one will use HorizontalResourceCard
                          return section.resources.length === 3 && i === 0 ? (
                            <HorizontalResourceCard
                              className="col-span-2"
                              key={resource.id}
                              resource={resource}
                              location={location}
                            />
                          ) : (
                            <VerticalResourceCard
                              key={resource.id}
                              resource={resource}
                              location={location}
                            />
                          )
                        },
                      )}
                    </Grid>
                    {section.path && (
                      <div className="flex justify-end mt-3">
                        <Link href={section.path} passHref>
                          <a className="flex items-center text-sm px-4 py-3 border-b-2 dark:border-gray-800 bg-transparent  border-gray-200 border-opacity-70 dark:hover:bg-gray-800 dark:hover:bg-opacity-50 opacity-80 hover:opacity-100 transition-all ease-in-out duration-200 group">
                            Browse all{' '}
                            <span
                              className="pl-1 group-hover:translate-x-1 transition-all ease-in-out duration-200"
                              aria-hidden
                            >
                              →
                            </span>
                          </a>
                        </Link>
                      </div>
                    )}
                  </section>
                )
              })}
            <Search />
          </main>
        </div>
      </div>
    </>
  )
}

export default CuratedTopics

const Jumbotron: React.FC<any> = ({data}) => {
  const resource = data.resources[0]
  return (
    <ResourceLink location="jumbotron" path={resource.path} className="group">
      <header className="md:aspect-w-16 md:aspect-h-6 relative h-full rounded-b-lg text-white ">
        <div className="flex items-center justify-center relative z-10 md:pb-16 pb-32 md:px-0 px-5 md:pt-0 pt-10">
          <div className="w-full max-w-screen-md flex md:flex-row flex-col items-center justify-center md:text-left text-center ">
            <div
              aria-hidden
              className="flex-shrink-0 relative flex items-center justify-center lg:max-w-none md:max-w-[220px] max-w-[180px] p-5"
            >
              <Image
                src={resource.image}
                alt={resource.title}
                width={240}
                height={240}
                quality={100}
                loading="eager"
                priority
                className="group-hover:scale-95 group-hover:opacity-90 transition-all ease-in-out duration-300"
              />
              <div
                aria-hidden
                className="absolute flex items-center justify-center group-hover:opacity-100 opacity-0 group-hover:scale-100 scale-0 transition-all ease-in-out duration-300 w-10 h-10 rounded-full bg-white bg-opacity-80 shadow-smooth"
              >
                <PlayIcon className="w-4 text-black" />
              </div>
            </div>
            <div className="md:pl-10">
              <p className="uppercase font-mono text-xs pb-1 opacity-80">
                Fresh Course
              </p>
              <h1 className="md:pt-0 pt-5 leading-tighter lg:text-3xl sm:text-2xl text-xl tracking-tight font-bold">
                {resource.title}
              </h1>
              <div className="flex items-center md:justify-start justify-center py-4">
                <div className="flex items-center justify-center rounded-full overflow-hidden">
                  <Image
                    aria-hidden
                    alt={resource.instructor.name}
                    src={resource.instructor.image}
                    width={32}
                    height={32}
                  />
                </div>
                <p className="pl-2 text-sm opacity-80 leading-none">
                  <span className="sr-only">{resource.type} by </span>
                  {resource.instructor.name}
                </p>
              </div>
              <p className="opacity-80 text-sm">{resource.description}</p>
            </div>
          </div>
        </div>
        <Image
          aria-hidden
          alt=""
          src={data.image}
          layout="fill"
          priority={true}
          quality={100}
          className="pointer-events-none md:object-contain object-cover"
        />
      </header>
    </ResourceLink>
  )
}

const Search = () => {
  const router = useRouter()
  return (
    <div className="pt-8 pb-24 flex flex-col items-center w-full">
      <Image
        src="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1637330011/egghead-next-pages/home-page/monocle-eggo.png"
        alt=""
        aria-hidden
        width={200}
        height={200}
      />

      <Formik
        initialValues={{
          query: '',
        }}
        onSubmit={(values) => {
          if (isEmpty(values.query)) {
            router.push(`/q`)
            track('clicked search icon with no query', {
              location: 'home',
            })
          } else {
            router.push(`/q?q=${values.query?.split(' ').join('+')}`)
            track('searched for query', {
              query: values.query,
              location: 'home',
            })
          }
        }}
      >
        {({values, handleChange}) => {
          return (
            <Form role="search" className="w-full">
              <h2 className="text-center lg:text-2xl sm:text-xl text-lg font-medium leading-tighter pb-8">
                What are you going to learn today?
              </h2>
              <div className="max-w-lg w-full mx-auto relative flex items-center">
                <input
                  name="query"
                  value={values.query}
                  onChange={handleChange}
                  type="search"
                  placeholder={`React, TypeScript, AWS, CSS...`}
                  autoComplete="off"
                  className="w-full py-4 px-5 pr-16 lg:text-lg sm:text-base text-sm rounded-lg dark:bg-gray-1000 border dark:border-gray-800 bg-white border-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-400"
                />
                <button
                  type="submit"
                  className="sm:text-base text-sm absolute px-5 text-white right-0 bg-gradient-to-t from-blue-600 to-blue-500 h-full rounded-r-lg transition-all ease-in-out duration-200"
                >
                  Search egghead
                </button>
              </div>
            </Form>
          )
        }}
      </Formik>
    </div>
  )
}

const Topics: React.FC<{data: any}> = ({data}) => {
  const {topics} = data
  return (
    <div className="sm:pt-10 sm:pb-32 pt-0 pb-16">
      <h2 className="text-center lg:text-2xl sm:text-xl text-lg dark:text-white font-semibold leading-tight pb-6">
        {data.title}
      </h2>
      <div className="grid lg:grid-cols-8 sm:grid-cols-4 grid-cols-3 xl:gap-5 gap-3 max-w-screen-lg mx-auto">
        {topics?.map(({path, title, slug, image}: any) => {
          return (
            <Link href={path}>
              <a
                className="flex flex-col items-center hover:shadow-smooth justify-center px-5 py-8 rounded-lg dark:bg-gray-800 dark:bg-opacity-60 dark:hover:bg-opacity-100 hover:bg-white ease-in-out transition-all duration-200"
                onClick={() => {
                  track('clicked home page topic', {
                    topic: title,
                  })
                  axios.post(`/api/topic`, {
                    topic: slug,
                    amount: 1,
                  })
                }}
              >
                <div className="sm:w-auto w-8">
                  {image && (
                    <Image
                      aria-hidden
                      src={image}
                      width={48}
                      height={48}
                      alt={title}
                    />
                  )}
                </div>
                <h3 className="sm:text-base text-sm text-center sm:pt-3 pt-2">
                  {title}
                </h3>
              </a>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

const homepageQuery = groq`*[_type == 'resource' && slug.current == "curated-home-page"][0]{
    title,
    'sections': resources[]{
      'id': _id,
      title,
      'slug': slug.current,
      image,
      path,
      description,
      'topics': resources[]{
        'id': _id,
        title,
        path,
        image,
      },
      resources[]->{
        'id': _id,
        title,
        'name': type,
        'description': summary,
        path,
        image,
        images,
        'ogImage': images[label == 'og-image'][0].url,
        'instructor': collaborators[]->[role == 'instructor'][0]{
            'name': person->name,
            'image': person->image.url
            },
        }
    }
  }`

export async function getStaticProps() {
  const data = await sanityClient.fetch(homepageQuery)

  const holidayCourses = holidaySaleOn ? await loadHolidayCourses() : {}

  return {
    props: {
      holidayCourses,
      data,
    },
  }
}
