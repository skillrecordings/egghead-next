import * as React from 'react'
import groq from 'groq'
import Markdown from 'react-markdown'
import {sanityClient} from 'utils/sanity-client'
import Image from 'next/image'
import {NextSeo} from 'next-seo'
import Link from 'next/link'
import prettifyUrl from 'utils/prettify-url'

const Portfolio = (props: any) => {
  const {title, image, url, description = ''} = props

  // there's no `body` field or similar with MDX content in Sanity,
  // so MDX stuff is commented out and we're using description field as plain markdown for now
  const content = description // useHydrate(body, {components: mdxComponents})

  const defaultOgImage: string = `https://og-image-react-egghead.now.sh/article/${encodeURIComponent(
    title,
  )}?&theme=dark`

  const ogImage = defaultOgImage

  return (
    <>
      <NextSeo
        title={`Portfolio by ${title}`}
        description={description}
        openGraph={{
          title: title,
          description: '',
          url,
          images: [
            {
              url: ogImage,
              alt: title,
            },
          ],
        }}
        twitter={{
          cardType: 'summary_large_image',
          site: 'eggheadio',
          handle: '',
        }}
        canonical={url}
      />
      <div className="container mt-5">
        <article className="max-w-screen-lg pt-4 pb-16 mx-auto">
          <header>
            <Link href="/great-developer-portfolios">
              <a className="inline-flex items-center px-3 py-2 text-sm text-gray-600 transition-all duration-200 ease-in-out border border-gray-200 rounded-md dark:border-gray-700 dark:text-gray-300 hover:border-blue-400 hover:text-blue-600 dark:hover:bg-gray-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3 h-3 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>All Portfolios</span>
              </a>
            </Link>
            <div className="flex flex-col items-center justify-between w-full py-8 space-y-5 text-center sm:flex-row sm:text-left sm:space-y-0 sm:items-baseline">
              <h1 className="max-w-screen-md text-3xl font-bold lg:text-6xl md:text-5xl sm:text-4xl leading-tighter">
                {title}
              </h1>
              <Link href={url}>
                <a
                  target="_blank"
                  className="flex items-center space-x-1 text-lg transition-colors duration-200 ease-in-out hover:text-blue-500 dark:hover:text-blue-300"
                >
                  <span>{prettifyUrl(url)}</span>
                  <ExternalLinkIcon />
                </a>
              </Link>
            </div>

            {image && (
              <div className="flex -mx-5 overflow-hidden sm:mx-0 sm:rounded-md sm:border-2 border-gray-50">
                <Image
                  src={image}
                  alt={title}
                  width={1280}
                  height={810}
                  quality={100}
                />
              </div>
            )}
          </header>
          <main>
            <Markdown
              className="max-w-3xl mx-auto mt-10 prose dark:prose-dark dark:prose-a:text-blue-300 prose-a:text-blue-500 sm:prose-lg lg:prose-xl"
              source={content}
            />
          </main>
        </article>
      </div>
    </>
  )
}

const ExternalLinkIcon = () => {
  return (
    <svg
      className="w-4 h-4"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      <g
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeWidth="2"
        fill="none"
        stroke="currentColor"
      >
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
        <path d="M15 3h6v6"></path>
        <path d="M10 14L21 3"></path>
      </g>
    </svg>
  )
}

const query = groq`*[_type == "resource" && slug.current == $slug][0]{
  image,
  title,
  description,
  url
}`

export async function getStaticProps(context: any) {
  const {body = '', ...post} = await sanityClient.fetch(query, {
    slug: context.params.slug,
  })

  // const mdxSource = await renderToString(body, {
  //   components: mdxComponents,
  // })

  return {
    props: {
      ...post,
      // body: mdxSource
    },
    revalidate: 1,
  }
}

const allPortfoliosQuery = groq`
  *[_type == "resource" && type == "portfolio"]{
    "slug": slug.current
  }
`

export async function getStaticPaths() {
  const allPortfolios = await sanityClient.fetch(allPortfoliosQuery)

  const paths = allPortfolios.map((post: {slug: string}) => {
    return {
      params: {
        slug: post.slug,
      },
    }
  })

  return {
    paths,
    fallback: false,
  }
}

export default Portfolio
