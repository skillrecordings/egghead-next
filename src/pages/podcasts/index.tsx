import React from 'react'
import {loadPodcasts} from '@lib/podcasts'
import Link from 'next/link'

export default function PodcastIndex({podcasts}) {
  return (
    <>
      <h1>Podcasts</h1>
      <div>
        <div>
          <blockquote>
            Some of my favorite developer podcasts I've listened to recently are
            the egghead developer chats where{' '}
            <a href="https://twitter.com/jhooks">@jhooks</a> is interviewing. He
            has a great rapport with his guests. You just feel like a fly on the
            wall during an interesting conversation about software.
          </blockquote>
          <p>
            Tony Cimaglia{' '}
            <a href="https://twitter.com/TonyCimaglia/status/1295763329999417360">
              on Twitter
            </a>
          </p>
        </div>
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
