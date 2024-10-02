import * as React from 'react'
import groq from 'groq'
import {sanityClient} from '@/utils/sanity-client'
import imageUrlBuilder from '@sanity/image-url'
import mdxComponents from '@/components/mdx'
import {serialize} from 'next-mdx-remote/serialize'
import {MDXRemote} from 'next-mdx-remote'
import {FunctionComponent} from 'react'
import Image from 'next/legacy/image'
import Link from 'next/link'
import {ArticleJsonLd, NextSeo, SocialProfileJsonLd} from 'next-seo'
import {useRouter} from 'next/router'
import CourseWidget from '@/components/mdx/course-widget'
import ResourceWidget from '@/components/mdx/resource-widget'
import ArticleSeriesList from '@/components/mdx/article-series-list'
import find from 'lodash/find'
import {useScrollTracker} from 'react-scroll-tracker'
import analytics from '@/utils/analytics'
import EmailSubscribeWidget from '@/components/mdx/email-subscribe-widget'
import remarkGfm from 'remark-gfm'
import truncate from 'lodash/truncate'
import removeMarkdown from 'remove-markdown'
import friendlyTime from 'friendly-time'

const UpdatedAt: React.FunctionComponent<
  React.PropsWithChildren<{date: string}>
> = ({date}) => <div>{date}</div>

function urlFor(source: any): any {
  return imageUrlBuilder(sanityClient).image(source)
}

const Tag = (props: any) => {
  const [hiddenCTA, setHiddenCTA] = React.useState(false)
  const {
    title = 'Missing title',
    categories,
    author = {name: 'Unknown Author'},
    seo: originalSEO = {},
    coverImage,
    source,
    articleResources,
    resources,
    slug,
    updatedAt,
    publishedAt,
  } = props

  const seo = originalSEO ? originalSEO : {}

  const router = useRouter()

  const url = process.env.NEXT_PUBLIC_DEPLOYMENT_URL + router.asPath
  const canonicalUrl = seo?.canonicalUrl ? seo.canonicalUrl : url

  const defaultOgImage: string | undefined = title
    ? `https://og-image-react-egghead.now.sh/article/${encodeURIComponent(
        title,
      )}?author=${encodeURIComponent(author?.name ?? 'Instructor')}&theme=dark`
    : undefined

  const ogImage = seo.ogImage ? seo.ogImage : defaultOgImage

  const {scrollY} = useScrollTracker([10, 25, 50, 75, 100])

  React.useEffect(() => {
    if (scrollY > 0) {
      analytics.events.engagementReadArticle(router.asPath, scrollY)
    }
  }, [scrollY])

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
      <SocialProfileJsonLd
        type="Person"
        name={author?.name}
        url={`https://egghead.io/q/resources-by-${author?.slug?.current}`}
        sameAs={[author?.twitter, author?.website]}
      />
      <ArticleJsonLd
        url={canonicalUrl}
        title={title}
        images={[ogImage]}
        datePublished={publishedAt}
        dateModified={updatedAt}
        authorName={author?.name}
        description={truncate(removeMarkdown(seo?.description), {length: 155})}
        publisherName="egghead.io"
        publisherLogo="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1567198446/og-image-assets/eggo.svg"
      />
      <div className="container">
        <article className="max-w-4xl mx-auto mb-16">
          <header className="sm:pt-16 pt-8">
            <Link
              href="/blog"
              className="opacity-75 text-sm mb-5 inline-flex hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              ← Articles
            </Link>
            <h1 className="w-full text-balance max-w-screen-mdtext-3xl font-extrabold lg:text-6xl md:text-5xl sm:text-4xl text-2xl pb-10 sm:pb-24 leading-tighter">
              {title}
            </h1>
            <div className="flex justify-between items-center">
              {author && <Author author={author} />}
              <div className="flex flex-col w-40 text-sm leading-tighter justify-between">
                <span className="uppercase text-xs">Published</span>
                {publishedAt && (
                  <div className="font-semibold place-content-end opacity-90">
                    <UpdatedAt date={friendlyTime(new Date(publishedAt))} />
                  </div>
                )}
              </div>
            </div>
          </header>
          <main className="prose dark:prose-dark sm:prose-lg lg:prose-xl max-w-none dark:prose-a:text-blue-300 prose-a:text-blue-500 py-8">
            <MDXRemote
              {...source}
              components={{
                ...mdxComponents,
                CourseWidget: ({course: courseSlug, ...props}: any) => {
                  const course = find(resources, {slug: courseSlug})
                  return course ? (
                    <div className="not-prose my-8">
                      <CourseWidget course={course} {...props} />
                    </div>
                  ) : null
                },
                ResourceWidget: ({resource: resourceSlug, ...props}: any) => {
                  const resource = find(articleResources, {slug: resourceSlug})
                  return resource ? (
                    <div className="not-prose my-8">
                      <ResourceWidget
                        resource={resource}
                        location={resource.location}
                        {...props}
                      />
                    </div>
                  ) : null
                },
                ArticleSeriesList: ({
                  resource: resourceSlug,
                  ...props
                }: any) => {
                  const resource = find(articleResources, {slug: resourceSlug})
                  return resource ? (
                    <div className="not-prose my-8">
                      <ArticleSeriesList
                        resource={resource}
                        location={resource.location}
                        {...props}
                      />
                    </div>
                  ) : null
                },
                EmailSubscribeWidget: (props: any) => {
                  return (
                    <div className="not-prose my-8">
                      <EmailSubscribeWidget
                        slug={slug}
                        author={author}
                        hideCTAState={[hiddenCTA, setHiddenCTA]}
                      />
                    </div>
                  )
                },
              }}
            />
          </main>
        </article>
      </div>
    </>
  )
}

const Author: FunctionComponent<
  React.PropsWithChildren<{
    author: {
      name: string
      image?: any
      path?: string
    }
  }>
> = ({author}) => {
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
      <Link href={path} className="inline-flex items-center space-x-2">
        <Profile />
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
  body,
  publishedAt,
  _updatedAt,
  "slug": slug.current,
  "articleResources": resources[type == "collection"]{
    "location": content[0].text,
    title,
    description,
    "slug": slug.current,
    "podcasts": resources[type == "podcast"]{
      title,
      image,
      path,
      "description": byline,
      "slug": slug.current,
      "name": type,
    },
    "collections": resources[type == "collection"]{
     title,
     'courses': resources[]->{
        type,
        title,
        image,
        path,
        "description": summary,
        byline,
        'instructor': collaborators[@->.role == 'instructor'][0]->{
          title,
          'slug': person->slug.current,
          'name': person->name,
          'path': person->website,
          'twitter': person->twitter,
          'image': person->image.url
        },
      },
    },
    "articles": resources[type == "article"]{
      title,
      image,
      path,
      byline,
      description,
      "name": type,
      "slug": slug.current,
      'instructor': collaborators[][0]->{
        title,
        'slug': person->slug.current,
        'name': person->name,
        'path': person->website,
        'twitter': person->twitter,
        'image': person->image.url
      },
    },
    "talks": resources[_type == "reference"]->{
      title,
      image,
      "description": byline,
      byline,
      path,
      "name": type,
    }
  },
  "resources": resources[]-> {
    title,
    'instructor': collaborators[@->.role == 'instructor'][0]->{
       'full_name': person->.name
     },
    path,
    "slug": slug.current,
    "image_thumb_url": image,
    "lessons": resources[] {
      title,
      path
    }
  }
}`

export async function getStaticProps(context: any) {
  const slug: string = context.params.slug

  const {body, ...post} = await sanityClient.fetch(query, {
    slug,
  })

  const mdxSource = await serialize(body, {
    mdxOptions: {
      remarkPlugins: [
        remarkGfm,
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
    props: {...post, slug, source: mdxSource},
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
