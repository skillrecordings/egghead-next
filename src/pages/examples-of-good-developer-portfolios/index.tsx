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
          Gold Star Developer Portfolios
        </h1>
        <section className="grid sm:grid-cols-2 grid-cols-1 sm:gap-8 gap-5 mt-12">
          {portfolios.map((portfolio: any) => {
            return (
              <article className="mx-auto max-w-screen-md">
                <header>
                  <h2 className="max-w-screen-md lg:text-2xl md:text-2xl sm:text-xl text-xl w-full font-regular mb-4 lg:mb-6 leading-tighter">
                    <Link href={`${url}/${portfolio.slug}`}>
                      {portfolio.title}
                    </Link>
                  </h2>
                  {portfolio.image && (
                    <div className="mt-4 rounded border-solid border border-gray-200">
                      <Image
                        src={portfolio.image}
                        alt={portfolio.title}
                        width={1280}
                        height={720}
                        quality={100}
                        className=""
                      />
                    </div>
                  )}
                </header>
                <main className="prose dark:prose-dark sm:prose-lg lg:prose-xl mt-5 max-w-none">
                  <p>{portfolio.description}</p>
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
