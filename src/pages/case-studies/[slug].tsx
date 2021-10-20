import * as React from 'react'
import groq from 'groq'
import Link from 'next/link'
import Image from 'next/image'
import {NextSeo} from 'next-seo'
import {useRouter} from 'next/router'
import {MDXRemote} from 'next-mdx-remote'
import mdxComponents from 'components/mdx'
import {sanityClient} from 'utils/sanity-client'
import {serialize} from 'next-mdx-remote/serialize'
import {withProse} from 'utils/remark/with-prose'

type AuthorResource = {
  name: string
  image?: any
  twitter?: string
  website?: string
}

type CaseStudyResource = {
  title: string
  author: AuthorResource
  seo: any
  coverImage: any
  source: any
}

const CaseStudy = (props: CaseStudyResource) => {
  const {
    title = 'Missing title',
    author = {name: 'Unknown Author'},
    seo = {},
    coverImage,
    source,
  } = props

  const router = useRouter()

  const url = process.env.NEXT_PUBLIC_DEPLOYMENT_URL + router.asPath
  const canonicalUrl = seo.canonicalUrl ? seo.canonicalUrl : url

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
              url: seo.ogImage,
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

      <div className="mx-auto max-w-screen-2xl lg:mt-24 md:mt-8 mt-3 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3">
          <div className="col-span-2">
            <h1 className="max-w-screen-md lg:text-6xl md:text-5xl sm:text-4xl text-3xl w-full font-extrabold mb-8 lg:mb-10 leading-tighter">
              {title}
            </h1>
            {coverImage?.url && (
              <div className="mt-4 lg:hidden md:block mb-4">
                <Image
                  src={coverImage.url}
                  alt={coverImage.alt || title}
                  width={820}
                  height={820}
                  quality={100}
                  layout="responsive"
                  className="rounded-lg shadow-lg object-cover object-center"
                />
              </div>
            )}

            {author && <Author author={author} />}
          </div>

          <div className="relative col-start-3">
            <svg
              className="hidden lg:block absolute top-0 right-0 -mt-20 -mr-20"
              width={404}
              height={384}
              fill="none"
              viewBox="0 0 404 384"
              aria-hidden="true"
            >
              <defs>
                <pattern
                  id="de316486-4a29-4312-bdfc-fbce2132a2c1"
                  x={0}
                  y={0}
                  width={20}
                  height={20}
                  patternUnits="userSpaceOnUse"
                >
                  <rect
                    x={0}
                    y={0}
                    width={4}
                    height={4}
                    className="text-gray-400"
                    fill="currentColor"
                  />
                </pattern>
              </defs>
              <rect
                width={404}
                height={384}
                fill="url(#de316486-4a29-4312-bdfc-fbce2132a2c1)"
              />
            </svg>
            <div className="relative text-base mx-auto max-w-prose lg:max-w-none">
              <div className="aspect-w-12 aspect-h-7 lg:aspect-none">
                {coverImage?.url && (
                  <div className="mt-4">
                    <Image
                      src={coverImage.url}
                      alt={coverImage.alt || title}
                      width={820}
                      height={820}
                      quality={100}
                      layout="responsive"
                      className="rounded-lg shadow-lg object-cover object-center"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <article className="mx-auto max-w-screen-md lg:mt-14 md:mt-8 mt-3 mb-16">
        <main>
          <MDXRemote {...source} components={mdxComponents} />
        </main>
      </article>
    </>
  )
}

const Author = ({author}: any) => {
  const {name, image, twitter, website} = author

  const path = twitter || website

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

const query = groq`*[_type == "caseStudy" && slug.current == $slug][0]{
  title,
  "author": authors[][0].author->,
  seo,
  coverImage,
  body
}`

export async function getStaticProps(context: any) {
  const {body, ...caseStudy} = await sanityClient.fetch(query, {
    slug: context.params.slug,
  })

  const mdxSource = await serialize(body, {
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
    props: {...caseStudy, source: mdxSource},
    revalidate: 1,
  }
}

const allCaseStudiesQuery = groq`
  *[_type == "caseStudy" && publishedAt < now()]{
    "slug": slug.current
  }
`

export async function getStaticPaths() {
  const allCaseStudies = await sanityClient.fetch(allCaseStudiesQuery)

  const paths = allCaseStudies.map((caseStudy: {slug: string}) => {
    return {
      params: {
        slug: caseStudy.slug,
      },
    }
  })

  return {
    paths,
    fallback: false,
  }
}

export default CaseStudy
