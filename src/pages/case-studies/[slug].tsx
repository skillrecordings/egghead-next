import * as React from 'react'
import Link from 'next/link'
import Image from 'next/legacy/image'
import {NextSeo} from 'next-seo'
import {useRouter} from 'next/router'
import {MDXRemote} from 'next-mdx-remote'
import mdxComponents from '@/components/mdx'
import {serialize} from 'next-mdx-remote/serialize'
import {HIDDEN_CASE_STUDIES} from './index'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeHighlight from 'rehype-highlight'
import {withStaticPropsLogging} from '@/lib/logging'
import {GenericErrorBoundary} from '@/components/generic-error-boundary'
import {
  getCourseBuilderCaseStudy,
  getCourseBuilderCaseStudies,
} from '@/lib/get-course-builder-metadata'

type AuthorResource = {
  name: string
  image?: any
  twitter?: string
  website?: string
}

export type CaseStudyResource = {
  title: string
  subTitle: string
  author: AuthorResource
  seo: any
  coverImage: any
  source: any
  publishedAt: string
  resources?: any[]
}

const PortraitWithPattern: React.FC<
  React.PropsWithChildren<{
    coverImage: any
    title: string
  }>
> = ({coverImage, title}) => {
  return coverImage?.url ? (
    <div className="relative">
      <svg
        className="absolute top-0 right-0 w-full pl-8 sm:pl-12 md:pl-16"
        fill="none"
        viewBox="0 0 404 384"
        aria-hidden="true"
      >
        <rect
          width={404}
          height={384}
          fill="url(#de316486-4a29-4312-bdfc-fbce2132a2c1)"
        />
      </svg>
      {coverImage?.url && (
        <div className="relative pt-8 pr-8 sm:pt-12 sm:pr-12 md:pt-16 md:pr-16">
          <Image
            src={coverImage.url}
            alt={coverImage.alt || title}
            width={720}
            height={720}
            quality={100}
            layout="responsive"
            className="object-cover object-center rounded-lg shadow-lg"
          />
        </div>
      )}
    </div>
  ) : null
}

const CaseStudy = (props: CaseStudyResource) => {
  const {
    title = 'Missing title',
    author = {name: 'Unknown Author'},
    seo: originalSEO = {},
    coverImage,
    source,
  } = props

  const seo = originalSEO ? originalSEO : {}

  const router = useRouter()

  const url = process.env.NEXT_PUBLIC_DEPLOYMENT_URL + router.asPath
  const canonicalUrl = seo?.canonicalUrl ? seo.canonicalUrl : url

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

      <div className="container mt-5 mb-16 lg:mt-28 md:mt-12">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="col-span-8">
            <h1 className="w-full max-w-screen-md mb-8 text-3xl font-extrabold lg:text-6xl md:text-5xl sm:text-4xl lg:mb-10 leading-tighter">
              {title}
            </h1>
            {coverImage?.url && (
              <div className="mt-4 mb-4 lg:hidden md:block">
                <div className="max-w-md mx-auto">
                  <PortraitWithPattern coverImage={coverImage} title={title} />
                </div>
              </div>
            )}

            {author && <Author author={author} />}
          </div>

          <div className="hidden col-span-4 -translate-y-16 lg:block">
            <PortraitWithPattern coverImage={coverImage} title={title} />
          </div>
        </div>
        <article className="max-w-screen-md mx-auto mt-3 mb-16 lg:mt-14 md:mt-8">
          <main className="prose dark:prose-dark sm:prose-lg lg:prose-xl max-w-none dark:prose-a:text-blue-300 prose-a:text-blue-500">
            <GenericErrorBoundary>
              <MDXRemote {...source} components={mdxComponents} />
            </GenericErrorBoundary>
          </main>
        </article>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
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
      </svg>
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
          src={typeof image === 'string' ? image : image.url}
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

export const getStaticProps = withStaticPropsLogging(async (context: any) => {
  const slug = context.params?.slug as string

  const caseStudy = await getCourseBuilderCaseStudy(slug)

  if (!caseStudy) {
    console.error(
      JSON.stringify({
        event: 'case_study.not_found',
        slug,
        ok: false,
        error: 'Course Builder returned null for case study query',
      }),
    )
    return {notFound: true}
  }

  const {body, ...rest} = caseStudy

  if (!body) {
    console.error(
      JSON.stringify({
        event: 'case_study.missing_body',
        slug,
        ok: false,
        error: 'Case study found but body field is null or undefined',
      }),
    )
  } else {
    console.log(
      JSON.stringify({
        event: 'case_study.fetched',
        slug,
        ok: true,
        body_length: body.length,
        has_cover_image: !!rest.coverImage,
      }),
    )
  }

  let mdxSource: any = null
  try {
    mdxSource = await serialize(body ?? '', {
      blockJS: false,
      blockDangerousJS: true,
      mdxOptions: {
        useDynamicImport: true,
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug, rehypeHighlight],
      },
    })
  } catch (err) {
    console.error(
      JSON.stringify({
        event: 'case_study.serialize_error',
        slug,
        ok: false,
        error: err instanceof Error ? err.message : String(err),
        stack:
          err instanceof Error
            ? err.stack?.split('\n').slice(0, 5).join(' | ')
            : undefined,
      }),
    )
    return {notFound: true}
  }

  return {
    props: {
      title: rest.title,
      subTitle: rest.subtitle || '',
      author: rest.author ?? null,
      seo: rest.seo || {},
      coverImage: rest.coverImage || null,
      source: mdxSource,
      publishedAt: rest.publishedAt || '',
    },
    revalidate: 60,
  }
})

export async function getStaticPaths() {
  const allCaseStudies = await getCourseBuilderCaseStudies()

  // Filter out hidden case studies and build paths
  const paths = (allCaseStudies || [])
    .filter((cs) => !HIDDEN_CASE_STUDIES.includes(cs.slug))
    .map((caseStudy) => ({
      params: {slug: caseStudy.slug},
    }))

  return {
    paths,
    fallback: 'blocking',
  }
}

export default CaseStudy
