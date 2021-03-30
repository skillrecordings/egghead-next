import * as React from 'react'
import groq from 'groq'
import {sanityClient} from 'utils/sanity-client'
import mdxComponents from 'components/mdx'
import renderToString from 'next-mdx-remote/render-to-string'
import Image from 'next/image'
import {NextSeo} from 'next-seo'
import {useRouter} from 'next/router'
import Link from 'next/link'

const Portfolio = (props: any) => {
  const {title = 'Missing title', image, description = ''} = props

  // const content = hydrate(description, {components: mdxComponents})

  const router = useRouter()

  const url = process.env.NEXT_PUBLIC_DEPLOYMENT_URL + router.asPath
  const canonicalUrl = url

  const defaultOgImage: string = `https://og-image-react-egghead.now.sh/article/${encodeURIComponent(
    title,
  )}?&theme=dark`

  const ogImage = defaultOgImage

  return (
    <>
      <NextSeo
        title={title}
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
        canonical={canonicalUrl}
      />
      <article className="mx-auto max-w-screen-lg lg:mt-14 md:mt-8 mt-3 mb-16">
        <header>
          <div className="flex mb-12 text-gray-400 rounded-full border border-gray-300 inline-flex px-3 py-1 transition duration-200 hover:border-blue-400 hover:text-blue-600 items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            <Link href="/great-developer-portfolios">
              Back to all portfolios
            </Link>
          </div>
          <div className="flex flex-col md:flex-row items-baseline justify-between mb-7">
            <h1 className="max-w-screen-md lg:text-6xl md:text-5xl sm:text-4xl text-3xl font-bold leading-tighter">
              {title}
            </h1>
            <div className="inline-flex items-center text-gray-400 transition duration-200  hover:text-blue-600 md:pt-0 pt-2 sm:text-base text-sm">
              <svg
                className="h-4 w-4 mr-1"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
              <Link href={url}>{url}</Link>
            </div>
          </div>
          {image && (
            <div className="mt-4">
              <Image
                src={image}
                alt={title}
                width={1280}
                height={810}
                quality={100}
                className="rounded-md"
              />
            </div>
          )}
        </header>
        <main className="prose dark:prose-dark sm:prose-lg lg:prose-xl mt-10 max-w-3xl mx-auto">
          {description}
        </main>
      </article>
    </>
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

  console.log(context.params.slug)

  const mdxSource = await renderToString(body, {
    components: mdxComponents,
    mdxOptions: {
      remarkPlugins: [
        require(`remark-slug`),
        require(`remark-footnotes`),
        require(`remark-code-titles`),
      ],
      rehypePlugins: [
        [
          require(`rehype-shiki`),
          {
            theme: `./src/styles/material-theme-dark.json`,
            useBackground: false,
          },
        ],
      ],
    },
  })
  return {
    props: {...post, body: mdxSource},
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
