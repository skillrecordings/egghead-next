import React from 'react'
import {NextSeo, VideoJsonLd, SocialProfileJsonLd} from 'next-seo'
import {truncate} from 'lodash'
import removeMarkdown from 'remove-markdown'

type PageSEOProps = {
  lesson: {
    hls_url: string
    duration: number
    created_at: string
    thumb_url: string
    title: string
    description: string
    path: string
    slug: string
    instructor: {
      full_name: string
      twitter?: string
      slug: string
    }
  }
}

const PageSEO: React.FC<PageSEOProps> = ({lesson}) => {
  if (!lesson) return null

  const truncatedTitle = lesson?.title
    ? truncate(removeMarkdown(lesson.title.replace(/"/g, "'")), {
        length: 42,
      })
    : ''
  const truncatedDescription = lesson?.description
    ? truncate(removeMarkdown(lesson.description.replace(/"/g, "'")), {
        length: 150,
      })
    : ''

  return (
    <>
      <NextSeo
        description={truncatedDescription}
        canonical={`${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}${lesson.path}`}
        title={truncatedTitle}
        titleTemplate={'%s | conference talk | egghead.io'}
        twitter={{
          handle: lesson?.instructor?.twitter ?? 'eggheadio',
          site: `@eggheadio`,
          cardType: 'summary_large_image',
        }}
        openGraph={{
          title: lesson?.title,
          url: `${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}${lesson.path}`,
          description: truncatedDescription,
          site_name: 'egghead',
          images: [
            {
              url: `https://og-image-react-egghead.now.sh/talk/${lesson.slug}?v=20201027`,
            },
          ],
        }}
      />
      <VideoJsonLd
        name={lesson.title.replace(/"/g, "'")}
        description={truncatedDescription}
        contentUrl={lesson.hls_url}
        duration={toISO8601Duration(Number(lesson.duration ?? 0))}
        uploadDate={lesson.created_at}
        thumbnailUrls={[lesson.thumb_url].filter(Boolean)}
      />
      <SocialProfileJsonLd
        type="Person"
        name={lesson.instructor.full_name}
        url={`https://egghead.io/q/resources-by-${lesson.instructor.slug}`}
        sameAs={
          lesson.instructor?.twitter
            ? [`https://twitter.com/${lesson.instructor.twitter}`]
            : []
        }
      />
    </>
  )
}

export default PageSEO

function toISO8601Duration(duration: number) {
  const seconds = Math.floor(duration % 60)
  const minutes = Math.floor((duration / 60) % 60)
  const hours = Math.floor((duration / (60 * 60)) % 24)
  const days = Math.floor(duration / (60 * 60 * 24))

  return `P${days}DT${hours}H${minutes}M${seconds}S`
}
