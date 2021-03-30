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
      <section className="mx-auto max-w-screen-xl lg:mt-14 md:mt-8 mt-3 mb-16">
        <h1 className="max-w-screen-md lg:text-6xl md:text-5xl sm:text-4xl text-4xl font-bold leading-tighter">
          Great Developer Portfolios
        </h1>
        <h2 className="text-lg mt-6 text-gray-700">
          We've gathered up a bunch of portfolios we think are great examples of
          how to present your work.
        </h2>
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20">
          {portfolios.map((portfolio: any) => {
            return (
              <article className="mx-auto max-w-screen-md">
                <section className="rounded-md border border-gray-200 shadow-sm hover:shadow-md  text-gray-700 hover:text-blue-700 transition duration-200">
                  {portfolio.image && (
                    <a href={`${url}/${portfolio.slug}`}>
                      <Image
                        src={portfolio.image}
                        alt={portfolio.title}
                        width={1280}
                        height={810}
                        quality={100}
                        className="rounded-t-md"
                      />
                    </a>
                  )}
                  <section className="flex flex-col mt-3 pl-5 pb-5">
                    <h2 className="max-w-screen-md lg:text-xl md:text-xl sm:text-lg text-lg w-full font-semibold leading-tighter">
                      <Link href={`${url}/${portfolio.slug}`}>
                        {portfolio.title}
                      </Link>
                    </h2>
                    <p className="text-xs mt-2 text-gray-400 hover:text-gray-500 transition">
                      <Link href={portfolio.url}>{portfolio.url}</Link>
                    </p>
                    {portfolio.tags &&
                      portfolio.tags.map((tag: any) => {
                        return <p>{tag.label}</p>
                      })}
                  </section>
                </section>
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
