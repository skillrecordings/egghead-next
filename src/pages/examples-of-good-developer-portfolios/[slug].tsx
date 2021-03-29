import * as React from 'react'
import groq from 'groq'
import {sanityClient} from 'utils/sanity-client'
import mdxComponents from 'components/mdx'
import renderToString from 'next-mdx-remote/render-to-string'
import Image from 'next/image'
import {NextSeo} from 'next-seo'
import {useRouter} from 'next/router'

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
      <article className="mx-auto max-w-screen-md lg:mt-14 md:mt-8 mt-3 mb-16">
        <header>
          <h2 className="max-w-screen-md lg:text-6xl md:text-5xl sm:text-4xl text-3xl w-full font-extrabold mb-8 lg:mb-10 leading-tighter">
            {title}
          </h2>
          {image && (
            <div className="mt-4">
              <Image
                src={image}
                alt={title}
                width={1280}
                height={720}
                quality={100}
                className="rounded-lg"
              />
            </div>
          )}
        </header>
        <main className="prose dark:prose-dark sm:prose-lg lg:prose-xl mt-5 max-w-none">
          {description}
        </main>
      </article>
    </>
  )
}

const query = groq`*[_type == "resource" && slug.current == $slug][0]{
  image,
  title,
  description
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
  console.log(allPortfolios)

  return {
    paths,
    fallback: false,
  }
}

export default Portfolio
