import * as React from 'react'
import groq from 'groq'
import Markdown from 'react-markdown'
import {sanityClient} from 'utils/sanity-client'
import mdxComponents from 'components/mdx'
import renderToString from 'next-mdx-remote/render-to-string'
import Image from 'next/image'
import {NextSeo} from 'next-seo'
import {useRouter} from 'next/router'
import useHydrate from 'next-mdx-remote/hydrate'
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
      <article className="mx-auto max-w-screen-lg pb-16 pt-4">
        <header>
          <Link href="/great-developer-portfolios">
            <a className="text-sm text-gray-600 rounded-md border border-gray-200 dark:border-gray-700 dark:text-gray-300 inline-flex px-3 py-2 transition-all ease-in-out duration-200 hover:border-blue-400 hover:text-blue-600 items-center dark:hover:bg-gray-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 mr-1"
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
          <div className="flex sm:flex-row flex-col sm:text-left text-center sm:space-y-0 space-y-5 w-full justify-between sm:items-baseline items-center py-8">
            <h1 className="max-w-screen-md lg:text-6xl md:text-5xl sm:text-4xl text-3xl font-bold leading-tighter">
              {title}
            </h1>
            <Link href={url}>
              <a
                target="_blank"
                className="text-lg flex items-center space-x-1 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200 ease-in-out"
              >
                <span>{prettifyUrl(url)}</span>
                <ExternalLinkIcon />
              </a>
            </Link>
          </div>

          {image && (
            <div className="flex overflow-hidden sm:mx-0 -mx-5 sm:rounded-md sm:border-2 border-gray-50">
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
            className="prose dark:prose-dark sm:prose-lg lg:prose-xl mt-10 max-w-3xl mx-auto"
            source={content}
          />
        </main>
      </article>
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
