import * as React from 'react'
import groq from 'groq'
import {sanityClient} from 'utils/sanity-client'
import imageUrlBuilder from '@sanity/image-url'
import mdxComponents from 'components/mdx'
import renderToString from 'next-mdx-remote/render-to-string'
import hydrate from 'next-mdx-remote/hydrate'
import {FunctionComponent} from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {NextSeo} from 'next-seo'
import {useRouter} from 'next/router'
import getTracer from '../../utils/honeycomb-tracer'
import {GetServerSideProps} from 'next'
import {setupHttpTracing} from '@vercel/tracing-js'
import {LessonResource} from '../../types'
import {loadBasicLesson} from '../../lib/lessons'

function urlFor(source: any): any {
  return imageUrlBuilder(sanityClient).image(source)
}

const Tag = (props: any) => {
  const {
    title = 'Missing title',
    categories,
    author,
    seo = {},
    coverImage,
    body = ``,
  } = props

  const content = hydrate(body, {components: mdxComponents})

  const router = useRouter()

  const url = process.env.NEXT_PUBLIC_DEPLOYMENT_URL + router.asPath
  const canonicalUrl = seo.canonicalUrl ? seo.canonicalUrl : url

  const defaultOgImage: string | undefined = title
    ? `https://og-image-react-egghead.now.sh/article/${encodeURIComponent(
        title,
      )}?author=${encodeURIComponent(author.name)}&theme=dark`
    : undefined

  const ogImage = seo.ogImage ? seo.ogImage : defaultOgImage

  return (
    <>
      <NextSeo
        title={title}
        description={seo.description}
        openGraph={{
          title: seo.ogTitle || title,
          description: seo.ogDescription,
          url,
          images: [
            {
              url: ogImage,
              alt: title,
            },
          ],
        }}
        twitter={{
          cardType: seo.cardType || 'summary_large_image',
          site: seo.site || 'eggheadio',
          handle: seo.handle,
        }}
        canonical={canonicalUrl}
      />
      <article className="mx-auto max-w-screen-md lg:mt-14 md:mt-8 mt-3 mb-16">
        <header>
          <h1 className="max-w-screen-md lg:text-6xl md:text-5xl sm:text-4xl text-3xl w-full font-extrabold mb-8 lg:mb-10 leading-tighter">
            {title}
          </h1>
          {author && <Author author={author} />}
          {coverImage?.url && (
            <div className="mt-4">
              <Image
                src={coverImage.url}
                alt={coverImage.alt || title}
                width={1280}
                height={720}
                quality={100}
                className="rounded-lg"
              />
            </div>
          )}
          {categories && (
            <ul>
              Posted in
              {categories.map((category: any) => (
                <li key={category}>{category}</li>
              ))}
            </ul>
          )}
        </header>
        <main className="prose dark:prose-dark sm:prose-lg lg:prose-xl mt-5 max-w-none">
          {content}
        </main>
      </article>
    </>
  )
}

const Author: FunctionComponent<{
  author: {
    name: string
    image?: any
    path?: string
  }
}> = ({author}) => {
  const {name, image, path} = author
  const Profile = () => (
    <>
      {image && (
        <Image
          src={image.url}
          width={48}
          height={48}
          alt={name}
          className="rounded-full"
        />
      )}
      <div className="leading-tighter">
        <span className="text-xs uppercase">author</span>
        <div className="font-semibold">{name}</div>
      </div>
    </>
  )
  return name ? (
    path ? (
      <Link href={path}>
        <a className="inline-flex items-center space-x-2">
          <Profile />
        </a>
      </Link>
    ) : (
      <div className="inline-flex items-center space-x-2">
        <Profile />
      </div>
    )
  ) : null
}

const query = groq`*[_type == "post" && slug.current == $slug][0]{
  title,
  "author": authors[][0].author->,
  "categories": categories[]->title,
  seo,
  coverImage,
  body
}`

const tracer = getTracer('article')

export const getServerSideProps: GetServerSideProps = async function ({
  req,
  res,
  params,
}) {
  setupHttpTracing({name: getServerSideProps.name, tracer, req, res})

  if (!params?.slug) {
    return {
      notFound: true,
    }
  }

  const {body, ...post} = await sanityClient.fetch(query, {
    slug: params?.slug,
  })

  console.log(post)

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

  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')
  return {
    props: {...post, body: mdxSource},
  }
}

export default Tag
