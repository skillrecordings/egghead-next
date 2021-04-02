import * as React from 'react'
import groq from 'groq'
import {sanityClient} from 'utils/sanity-client'
import Image from 'next/image'
import {useRouter} from 'next/router'
import Link from 'next/link'
import {sortBy} from 'lodash'
import prettifyUrl from 'utils/prettify-url'

const Portfolio: React.FC<{portfolios: any}> = (props) => {
  const {portfolios} = props
  const router = useRouter()
  const path = router.asPath

  return (
    <>
      <section className="mx-auto max-w-screen-xl py-8">
        <h1 className="max-w-screen-md lg:text-6xl md:text-5xl sm:text-4xl text-4xl font-bold leading-tighter">
          Great Developer Portfolios
        </h1>
        <h2 className="text-lg pt-4 text-gray-700 dark:text-gray-200">
          We've gathered up a bunch of portfolios we think are great examples of
          how to present your work.
        </h2>
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 sm:gap-8 gap-5 pt-16">
          {sortBy(portfolios, 'title', 'asc').map((portfolio: any) => {
            return (
              <article className="relative overflow-hidden rounded-md border border-gray-200 dark:border-transparent dark:bg-gray-800 shadow-sm hover:shadow-lg  text-gray-700 dark:text-gray-200 transition-all ease-in-out duration-200">
                <header>
                  {portfolio.image && (
                    <Link href={`${path}/${portfolio.slug}`}>
                      <a>
                        <Image
                          src={portfolio.image}
                          alt={portfolio.title}
                          width={1280}
                          height={810}
                          quality={100}
                          className="rounded-t-md hover:scale-105 transform transition-transform ease-in-out duration-700"
                        />
                      </a>
                    </Link>
                  )}
                </header>
                <main className="flex flex-col mt-3 pl-5 pb-5">
                  <h2 className="max-w-screen-md lg:text-xl md:text-xl sm:text-lg text-lg w-full font-semibold leading-tighter">
                    <Link href={`${path}/${portfolio.slug}`}>
                      <a className="hover:text-blue-500">{portfolio.title}</a>
                    </Link>
                  </h2>
                  <p className="text-xs mt-2 text-gray-500 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400 transition">
                    <Link href={portfolio.url}>
                      <a>{prettifyUrl(portfolio.url)}</a>
                    </Link>
                  </p>
                  <div className="flex flex-wrap mt-2">
                    {portfolio.tags &&
                      portfolio.tags.map((tag: any) => {
                        return (
                          <div className="pointer-events-none items-center capitalize rounded-md mt-2 font-medium py-1 px-3 mr-2 bg-blue-100 dark:bg-blueGray-700 text-blue-500 dark:text-blue-200 text-xs">
                            {tag.label}
                          </div>
                        )
                      })}
                  </div>
                </main>
              </article>
            )
          })}
        </section>
      </section>
    </>
  )
}

const query = groq`*[_type == "resource" && type == 'portfolio']{
  "slug": slug.current,
  image,
  title,
  url,
  tags
}`

export async function getStaticProps(context: any) {
  const portfolios = await sanityClient.fetch(query)

  return {
    props: {portfolios},
    revalidate: 1,
  }
}

export default Portfolio
