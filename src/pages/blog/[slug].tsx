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
import {withProse} from 'utils/remark/with-prose'

function urlFor(source: any): any {
  return imageUrlBuilder(sanityClient).image(source)
}

const Tag = (props: any) => {
  const {
    title = 'Missing title',
    categories,
    author = {name: 'Unknown Author'},
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
        <main>{content}</main>
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

export async function getStaticProps(context: any) {
  const {body, ...post} = await sanityClient.fetch(query, {
    slug: context.params.slug,
  })

  const mdxSource = await renderToString(body, {
    components: mdxComponents,
    mdxOptions: {
      remarkPlugins: [
        withProse,
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

const allPostsQuery = groq`
  *[_type == "post" && publishedAt < now() && !(_id in path("drafts.**"))]{
    "slug": slug.current
  }
`

export async function getStaticPaths() {
  const allPosts = await sanityClient.fetch(allPostsQuery)

  const paths = allPosts.map((post: {slug: string}) => {
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

export default Tag
