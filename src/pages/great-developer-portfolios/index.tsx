import * as React from 'react'
import groq from 'groq'
import {sanityClient} from 'utils/sanity-client'
import Image from 'next/image'
import {useRouter} from 'next/router'
import Link from 'next/link'

const Portfolio: React.FC<{portfolios: any}> = (props) => {
  const {portfolios} = props
  const router = useRouter()
  const url = process.env.NEXT_PUBLIC_DEPLOYMENT_URL + router.asPath

  return (
    <>
      <section className="mx-auto max-w-screen-lg lg:mt-14 md:mt-8 mt-3 mb-16">
        <h1 className="max-w-screen-md lg:text-6xl md:text-5xl sm:text-4xl text-4xl font-bold leading-tighter">
          Great Developer Portfolios
        </h1>
        <h2 className="text-lg mt-6 text-gray-700">
          We've gathered up a bunch of portfolios we think are great examples of
          how to present yourself and your work.
        </h2>
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-16">
          {portfolios.map((portfolio: any) => {
            return (
              <article className="mx-auto max-w-screen-md mb-6">
                <header>
                  {portfolio.image && (
                    <a href={`${url}/${portfolio.slug}`}>
                      <div className="mt-4 rounded-md border border-gray-200 hover:translate-y-3 hover:shadow transition duration-200">
                        <Image
                          src={portfolio.image}
                          alt={portfolio.title}
                          width={1280}
                          height={810}
                          quality={100}
                          className="rounded-md"
                        />
                      </div>
                    </a>
                  )}
                  <section className="flex mt-4">
                    <h2 className="flex-grow max-w-screen-md lg:text-xl md:text-xl sm:text-lg text-lg w-full font-regular leading-tighter text-gray-700 hover:text-blue-700 transition duration-200">
                      <Link href={`${url}/${portfolio.slug}`}>
                        {portfolio.title}
                      </Link>
                    </h2>
                    <div className="flex flex-col items-end">
                      <p className="text-base text-gray-500">
                        <Link href={portfolio.url}>{portfolio.url}</Link>
                      </p>
                      <p className="text-gray-500">
                        <Link href={`${url}/${portfolio.slug}`}>See more</Link>
                      </p>
                    </div>
                  </section>
                </header>
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
  description
}`

export async function getStaticProps(context: any) {
  const portfolios = await sanityClient.fetch(query)

  return {
    props: {portfolios},
    revalidate: 1,
  }
}

export default Portfolio
