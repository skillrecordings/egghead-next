import * as React from 'react'
import {HorizontalResourceCard} from 'components/card/new-horizontal-resource-card'
import {VerticalResourceCard} from 'components/card/new-vertical-resource-card'
import Search from 'components/pages/home/search'
import Topics from 'components/pages/home/topics'
import ReactMarkdown from 'react-markdown'
import {CardResource} from 'types'
import Grid from 'components/grid'
import Image from 'next/image'
import Link from 'next/link'
import {track} from 'utils/analytics'
import Jumbotron from 'components/pages/home/jumbotron'
import {Jumbotron as HolidayReleaseJumbotron} from 'components/pages/20-days-of-egghead/course-grid'

const Home: React.FC<any> = ({data, jumbotron, location}) => {
  return (
    <>
      <div className="md:container">
        <Jumbotron data={jumbotron} />
      </div>
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
                        switch (section.resources.length) {
                          case 3:
                            return i === 0 ? (
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
                          case 6:
                            return i === 0 || i === 1 ? (
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
                          case 7:
                            return i === 0 ? (
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
                          default:
                            return (
                              <VerticalResourceCard
                                key={resource.id}
                                resource={resource}
                                location={location}
                              />
                            )
                        }
                      },
                    )}
                  </Grid>
                  {section.path && (
                    <div className="flex justify-end mt-3">
                      <Link href={section.path} passHref>
                        <a
                          onClick={() => {
                            track('clicked browse all', {
                              section: section.title,
                            })
                          }}
                          className="flex items-center text-sm px-4 py-3 border-b-2 dark:border-gray-800 bg-transparent  border-gray-200 border-opacity-70 dark:hover:bg-gray-800 dark:hover:bg-opacity-50 opacity-80 hover:opacity-100 transition-all ease-in-out duration-200 group"
                        >
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
          <div className="md:container mb-16 rounded-lg dark:bg-gray-800 bg-white dark:bg-opacity-60 bg-opacity-100">
            <HolidayReleaseJumbotron />
          </div>
          <Search />
        </main>
      </div>
    </>
  )
}

export default Home
