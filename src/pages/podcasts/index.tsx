import React from 'react'
import {loadPodcasts} from '@lib/podcasts'
import Link from 'next/link'

export default function PodcastIndex({podcasts}) {
  return (
    <>
      <h1>Podcasts</h1>
      <div>
        {podcasts.map((podcast) => {
          return (
            <div key={podcast.slug}>
              <Link href={`/podcasts/[slug]`} as={podcast.path}>
                <a>{podcast.title}</a>
              </Link>
            </div>
          )
        })}
      </div>
    </>
  )
}

export async function getServerSideProps({res, params}) {
  res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate')
  const podcasts = await loadPodcasts()
  return {
    props: {
      podcasts,
    },
  }
}
