import {GetServerSideProps, GetStaticPaths} from 'next'
import MuxPlayer from '@mux/mux-player-react'
import * as mysql from 'mysql2/promise'
import {ConnectionOptions, RowDataPacket} from 'mysql2/promise'
import {NextSeo} from 'next-seo'
import * as React from 'react'
import {MDXRemote} from 'next-mdx-remote'
import mdxComponents from '@/components/mdx'
import find from 'lodash/find'
import CourseWidget from '@/components/mdx/course-widget'
import ResourceWidget from '@/components/mdx/resource-widget'
import ArticleSeriesList from '@/components/mdx/article-series-list'
import EmailSubscribeWidget from '@/components/mdx/email-subscribe-widget'
import {serialize} from 'next-mdx-remote/serialize'
import remarkGfm from 'remark-gfm'
import {truncate} from 'lodash'
import removeMarkdown from 'remove-markdown'
import ReactMarkdown from 'react-markdown'

const access: ConnectionOptions = {
  uri: process.env.COURSE_BUILDER_DATABASE_URL,
}

function convertToSerializeForNextResponse(result: any) {
  for (const resultKey in result) {
    if (result[resultKey] instanceof Date) {
      result[resultKey] = result[resultKey].toISOString()
    } else if (
      result[resultKey]?.constructor?.name === 'Decimal' ||
      result[resultKey]?.constructor?.name === 'i'
    ) {
      result[resultKey] = result[resultKey].toNumber()
    } else if (result[resultKey]?.constructor?.name === 'BigInt') {
      result[resultKey] = Number(result[resultKey])
    } else if (result[resultKey] instanceof Object) {
      result[resultKey] = convertToSerializeForNextResponse(result[resultKey])
    }
  }

  return result
}

export const getStaticPaths: GetStaticPaths = async () => {
  const conn = await mysql.createConnection(access)

  const [postRows] = await conn.execute<RowDataPacket[]>(`
SELECT *
		FROM egghead_ContentResource cr_lesson
		WHERE (cr_lesson.type = 'post' )`)
  await conn.end()

  return {
    paths: postRows.map((post: any) => {
      return {
        params: {
          post: post.fields.slug,
        },
      }
    }),
    fallback: 'blocking',
  }
}

export const getStaticProps: GetServerSideProps = async function ({
  req,
  res,
  params,
  query,
}) {
  if (!params?.post) {
    return {
      notFound: true,
    }
  }
  const conn = await mysql.createConnection(access)
  const [videoResourceRows] = await conn.execute<RowDataPacket[]>(`
SELECT *
		FROM egghead_ContentResource cr_lesson
		JOIN egghead_ContentResourceResource crr ON cr_lesson.id = crr.resourceOfId
		JOIN egghead_ContentResource cr_video ON crr.resourceId = cr_video.id
		WHERE (cr_lesson.id = '${params.post}' OR JSON_UNQUOTE(JSON_EXTRACT(cr_lesson.fields, '$.slug')) = '${params.post}')
			AND cr_video.type = 'videoResource'
		LIMIT 1`)
  const [postRows] = await conn.execute<RowDataPacket[]>(`
SELECT *
		FROM egghead_ContentResource cr_lesson
		WHERE (cr_lesson.id = '${params.post}' OR JSON_UNQUOTE(JSON_EXTRACT(cr_lesson.fields, '$.slug')) = '${params.post}')
		LIMIT 1`)
  await conn.end()

  const videoResource = videoResourceRows[0]
  const post = postRows[0]

  if (!post) {
    return {
      notFound: true,
    }
  }

  const mdxSource = await serialize(post.fields.body, {
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
    props: {
      mdxSource,
      post: convertToSerializeForNextResponse(post),
      videoResource: convertToSerializeForNextResponse(videoResource),
    },
    revalidate: 60,
  }
}

export default function PostPage({
  post,
  videoResource,
  mdxSource,
}: {
  mdxSource: any
  post: any
  videoResource: any
}) {
  const imageParams = new URLSearchParams()
  imageParams.set('title', post.fields.title)

  return (
    <div className="container">
      <NextSeo
        title={post.fields.title}
        description={post.fields.description}
        canonical={`${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}/${post.fields.slug}`}
        twitter={{
          cardType: 'summary_large_image',
          site: 'eggheadio',
          handle: '@eggheadio',
        }}
        openGraph={{
          title: post.fields.title?.replace(/"/g, "'"),
          url: `${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}/${post.fields.slug}`,
          description: truncate(
            removeMarkdown(post.fields.description?.replace(/"/g, "'")),
            {length: 155},
          ),
          site_name: 'egghead',
          images: [
            {
              url: `${
                process.env.NEXT_PUBLIC_DEPLOYMENT_URL
              }/api/og/og-default?${imageParams.toString()}`,
            },
          ],
        }}
      />
      <header>
        <h1 className="w-full max-w-screen-mdtext-3xl font-extrabold lg:text-6xl md:text-5xl sm:text-4xl text-2xl pb-10 pt-16 sm:pb-24 sm:pt-32 leading-tighter">
          {post.fields.title}
        </h1>
      </header>

      <MuxPlayer playbackId={videoResource.fields.muxPlaybackId} />

      <main className="prose dark:prose-dark sm:prose-lg lg:prose-xl max-w-none dark:prose-a:text-blue-300 prose-a:text-blue-500 py-8">
        <MDXRemote
          {...mdxSource}
          components={{
            ...mdxComponents,
          }}
        />
        <section>
          <h2 className="text-xl font-bold">Transcript</h2>
          <ReactMarkdown className="prose text-gray-800 dark:prose-dark max-w-none">
            {videoResource.fields.transcript}
          </ReactMarkdown>
        </section>
      </main>
    </div>
  )
}
