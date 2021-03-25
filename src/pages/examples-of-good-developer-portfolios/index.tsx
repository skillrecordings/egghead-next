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
      {portfolios.map((portfolio: any) => {
        return (
          <article className="mx-auto max-w-screen-md lg:mt-14 md:mt-8 mt-3 mb-16">
            <header>
              <h1 className="max-w-screen-md lg:text-6xl md:text-5xl sm:text-4xl text-3xl w-full font-extrabold mb-8 lg:mb-10 leading-tighter">
                <Link href={`${url}/${portfolio.slug}`}>{portfolio.title}</Link>
              </h1>
              {portfolio.image && (
                <div className="mt-4">
                  <Image
                    src={portfolio.image}
                    alt={portfolio.title}
                    width={1280}
                    height={720}
                    quality={100}
                    className="rounded-lg"
                  />
                </div>
              )}
            </header>
            <main className="prose dark:prose-dark sm:prose-lg lg:prose-xl mt-5 max-w-none">
              described in depth
            </main>
          </article>
        )
      })}
    </>
  )
}

const query = groq`*[_type == "resource" && type == 'portfolio']{
  "slug": slug.current,
  image,
  title
}`

export async function getStaticProps(context: any) {
  const portfolios = await sanityClient.fetch(query)

  return {
    props: {portfolios},
    revalidate: 1,
  }
}

export default Portfolio
