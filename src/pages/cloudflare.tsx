import * as React from 'react'
import groq from 'groq'
import {sanityClient} from 'utils/sanity-client'
import find from 'lodash/find'
import Link from 'next/link'
import {serialize} from 'next-mdx-remote/serialize'
import mdxComponents from 'components/mdx'
import {MDXRemote} from 'next-mdx-remote'
import Image from 'next/image'
import type {CaseStudyResource} from './case-studies/[slug]'
import {NextSeo} from 'next-seo'
import Head from 'next/head'
import {convertTimeToMins} from 'utils/time-utils'

const CASE_STUDY_SLUG = 'cloudflare'

const CloudflarePage: React.FC<{caseStudy: CaseStudyResource; source: any}> = ({
  caseStudy,
  source,
}) => {
  const {title, subTitle, publishedAt, resources, seo} = caseStudy
  return (
    <>
      <NextSeo
        title={seo.title}
        description={seo.description}
        openGraph={{
          title: seo.ogTitle || title,
          description: seo.ogDescription,
          images: [
            {
              url: seo.ogImage,
              alt: title,
            },
          ],
        }}
      />
      <Head>
        <meta name="twitter:label1" content="Reading time" />
        <meta name="twitter:data1" content="5 mins to read" />
      </Head>
      <article>
        <header className="text-center">
          <div className="sm:pt-24 pt-12 sm:pb-16 pb-12 px-5">
            <h1 className="pb-4 lg:text-7xl sm:text-6xl text-4xl dark:text-slate-200 text-slate-800 tracking-tight leading-tight inline-flex">
              {title}
              <sup className="pt-3 sm:pl-0 pl-2">
                <Image
                  src="https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/293/square_128/cloudflare-2000.png"
                  width={50}
                  height={50}
                  alt="cloudflare logo"
                />
              </sup>
            </h1>
            {subTitle && (
              <h2 className="sm:text-xl text-lg font-light dark:text-orange-300 text-orange-500 leading-tight">
                {subTitle}
              </h2>
            )}
          </div>
          <div className="flex flex-col max-w-[960px] mx-auto w-full">
            <div className="drop-shadow-2xl">
              <Image
                quality={100}
                width={1920 / 2}
                height={1080 / 2}
                src={caseStudy.coverImage.url}
                alt={caseStudy.coverImage.alt}
                className="lg:rounded-xl"
              />
            </div>

            <div className="flex items-center justify-between lg:px-0 px-3 pt-1 uppercase font-mono font-medium tracking-wide sm:text-xs text-[0.65rem] opacity-60 text-gray-700 dark:text-gray-300 text-left">
              <span>case study</span>
              <span>
                {new Date(publishedAt).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>
        </header>
        <main className="container px-5 sm:pt-16 pt-5 pb-16">
          <div className="max-w-screen-md mx-auto sm:prose-lg lg:prose-xl prose dark:prose-dark dark:prose-p:font-light prose-a:font-normal dark:prose-a:font-light dark:prose-p:text-gray-200 dark:prose-a:text-orange-300 dark:hover:prose-a:text-orange-200 hover:prose-a:text-orange-600 prose-a:text-orange-500">
            <MDXRemote
              {...source}
              components={{
                ...mdxComponents,
                blockquote: Blockquote,
                CourseWidget: ({course: courseSlug, ...props}: any) => {
                  const course = find(resources, {slug: courseSlug})
                  return course ? (
                    <div className="not-prose my-8">
                      <CourseWidget course={course} {...props} />
                    </div>
                  ) : null
                },
              }}
            />
          </div>
        </main>
      </article>
    </>
  )
}

const Blockquote: React.FC = ({children}) => {
  return (
    <blockquote className="not-prose p-5 dark:border-gray-700 border-gray-300 border-l-[3px] dark:bg-gray-800 bg-gray-100 dark:text-gray-200 text-gray-800 relative not-italic font-normal">
      <div className="absolute -right-3 -top-3 w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="85"
          height="70"
          fill="none"
          viewBox="0 0 85 70"
          className="w-4 fill-white"
        >
          <path d="M18.857.143c-3.343 5.4-6.428 10.8-9 16.457-4.886 9.514-9 21.6-9 31.114 0 14.4 9 21.857 19.286 21.857 10.285 0 19.285-7.457 19.285-20.571C39.428 38.714 33 29.714 24 28.428L30.428.143h-11.57zm45 0c-3.343 5.4-6.428 10.8-9 16.457-4.886 9.514-9 21.6-9 31.114 0 14.4 9 21.857 19.286 21.857 10.285 0 19.286-7.457 19.286-20.571C84.429 38.714 78 29.714 69 28.428L75.429.143H63.857z" />
        </svg>
      </div>
      {children}
    </blockquote>
  )
}

const CourseWidget: React.FC<{course: any; cta?: string}> = ({course, cta}) => {
  const {title, path, lessons, instructor, duration, image_thumb_url} = course
  return (
    <div className="sm:grid grid-cols-2 dark:bg-gray-1000 bg-gray-100 bg-opacity-80 dark:bg-opacity-100 rounded-lg overflow-hidden">
      <div className="sm:p-6 p-5 flex flex-col justify-between">
        <img
          src={image_thumb_url}
          alt={title}
          width={160}
          height={160}
          className="-m-3"
        />
        <div className="sm:pt-8 pt-5">
          <p className="uppercase text-xs font-semibold pb-2 dark:text-orange-300 text-orange-500">
            course
          </p>
          <h2 className="text-xl font-medium leading-tight dark:text-white text-black">
            <Link href={path}>
              <a className="group">
                <span className="group-hover:underline">{title}</span>{' '}
                {instructor?.full_name && (
                  <span className="text-lg dark:text-gray-400 text-gray-500 font-normal">
                    – by {instructor.full_name}
                  </span>
                )}
              </a>
            </Link>
          </h2>
        </div>
      </div>
      <div className="sm:border-l dark:border-gray-800 border-gray-200 border-t sm:border-t-0 flex flex-col h-full">
        <div className="px-3.5 pt-5 pb-2 flex items-center text-xs justify-between">
          <span className="font-medium uppercase dark:text-gray-400 text-gray-500">
            {lessons.length} lessons
          </span>
          {duration && (
            <span className="font-medium text-gray-400">
              {convertTimeToMins(Number(duration))}
            </span>
          )}
        </div>
        <ul className="h-[320px] overflow-y-auto">
          {lessons.map((lesson: any) => {
            return (
              <li key={lesson.path}>
                <a
                  href={`https://egghead.io${lesson.path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between space-x-1 px-2 py-2 dark:hover:bg-gray-900 hover:bg-gray-200 group transition"
                >
                  <div className="flex items-center">
                    <PlayIcon />
                    <span className="leading-tighter text-sm dark:text-gray-300 text-gray-700 dark:group-hover:text-white group-hover:text-gray-900 transition">
                      {lesson.title}
                    </span>
                  </div>
                  {duration && (
                    <div className="text-xs pr-2 pl-1 text-gray-500">
                      {convertTimeToMins(Number(lesson.duration))}
                    </div>
                  )}
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

const PlayIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    fill="none"
    viewBox="0 0 20 20"
    className="p-1.5 dark:group-hover:text-orange-300 group-hover:text-orange-500 text-gray-500 transition flex-shrink-0"
    aria-hidden="true"
  >
    <path
      fill="currentColor"
      d="M4 3.323A1.25 1.25 0 015.939 2.28l10.32 6.813a1.25 1.25 0 010 2.086L5.94 17.992A1.25 1.25 0 014 16.949V3.323z"
    />
  </svg>
)

const caseStudyQuery = groq`
*[_type == "caseStudy" && slug.current == $slug][0] {
  title,
  subTitle,
  "author": authors[][0].author->,
  seo,
  coverImage,
  body,
  publishedAt,
  'slug': slug.current,
  "resources": resources[]-> {
      title,
      'instructor': collaborators[]->[role == 'instructor'][0]{
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
}
`

export async function getStaticProps() {
  const caseStudy = await sanityClient.fetch(caseStudyQuery, {
    slug: CASE_STUDY_SLUG,
  })

  const mdxSource = await serialize(caseStudy.body, {
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
    props: {
      caseStudy,
      source: mdxSource,
    },
  }
}

export default CloudflarePage
