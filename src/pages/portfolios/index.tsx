import * as React from 'react'
import groq from 'groq'
import {sanityClient} from 'utils/sanity-client'
import Image from 'next/image'
import {useRouter} from 'next/router'
import Link from 'next/link'
import {sortBy} from 'lodash'
import prettifyUrl from 'utils/prettify-url'

const Portfolio: React.FC<React.PropsWithChildren<{portfolios: any}>> = (
  props,
) => {
  const {portfolios} = props
  const router = useRouter()
  const path = router.asPath

  return (
    <>
      <section className="container py-8 mt-5">
        <h1 className="max-w-screen-md text-4xl font-bold lg:text-6xl md:text-5xl sm:text-4xl leading-tighter">
          Great Developer Portfolios
        </h1>
        <h2 className="pt-4 text-lg text-gray-700 dark:text-gray-200">
          We've gathered up a bunch of portfolios we think are great examples of
          how to present your work.
        </h2>
        <section className="grid grid-cols-1 gap-5 pt-16 md:grid-cols-2 lg:grid-cols-3 sm:gap-8">
          {sortBy(portfolios, 'title', 'asc').map((portfolio: any) => {
            return (
              <article className="relative overflow-hidden text-gray-700 transition-all duration-200 ease-in-out border border-gray-200 rounded-md shadow-sm dark:border-transparent dark:bg-gray-800 hover:shadow-lg dark:text-gray-200">
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
                          className="transition-transform duration-700 ease-in-out rounded-t-md hover:scale-105"
                        />
                      </a>
                    </Link>
                  )}
                </header>
                <main className="flex flex-col pb-5 pl-5 mt-3">
                  <h2 className="w-full max-w-screen-md text-lg font-semibold lg:text-xl md:text-xl sm:text-lg leading-tighter">
                    <Link href={`${path}/${portfolio.slug}`}>
                      <a className="hover:text-blue-500">{portfolio.title}</a>
                    </Link>
                  </h2>
                  <p className="mt-2 text-xs text-gray-500 transition hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400">
                    <Link href={portfolio.url}>
                      <a>{prettifyUrl(portfolio.url)}</a>
                    </Link>
                  </p>
                  <div className="flex flex-wrap mt-2">
                    {portfolio.tags &&
                      portfolio.tags.map((tag: any) => {
                        return (
                          <div className="items-center px-3 py-1 mt-2 mr-2 text-xs font-medium text-blue-500 capitalize bg-blue-100 rounded-md pointer-events-none dark:bg-blueGray-700 dark:text-blue-200">
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
