import React, {FunctionComponent} from 'react'
import Markdown from 'react-markdown/with-html'
import {loadPodcast, loadPodcasts} from 'lib/podcasts'
import Rss from '../../components/images/rss.svg'
import Spotify from '../../components/images/spotify.svg'
import ApplePodcasts from '../../components/images/apple-podcasts.svg'
import PodcastCard from 'components/podcasts/card'
import {GetServerSideProps} from 'next'
import {PodcastResource} from 'types'

type PodcastProps = {
  podcast: PodcastResource
  podcasts: Array<PodcastResource>
}

type MorePodcastProps = {
  podcasts: Array<PodcastResource>
}

const MorePodcasts: FunctionComponent<MorePodcastProps> = ({podcasts}) => (
  <div className="w-screen bg-gray-200 -ml-3 sm:-ml-4 lg:-ml-8 sm:p-8 p-3">
    <div className="max-w-4xl mx-auto text-center">
      <h3 className="text-gray-700 mb-10 text-center font-light text-3xl">
        More Podcasts
      </h3>
      <ul className="mb-10 justify-items-center grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {podcasts.map((podcast: PodcastResource) => (
          <PodcastCard podcast={podcast} key={podcast.id} />
        ))}
      </ul>
      <a
        href="/podcasts"
        className="rounded-md transition-colors duration-200 bg-white text-gray-700 hover:bg-black hover:text-white inline-block uppercase text-sm p-4 mx-auto"
      >
        Browse All
      </a>
    </div>
  </div>
)

const LINKS = [
  {
    component: ApplePodcasts,
    title: 'Listen on Apple Podcasts',
    link:
      'https://itunes.apple.com/us/podcast/egghead-io-instructor-chats/id1308497805',
  },
  {
    component: Spotify,
    title: 'Listen on Spotify',
    link: 'https://open.spotify.com/show/4FKWy0vjNbt6uFwAzwd7XF',
  },
  {
    component: Rss,
    title: 'Subscribe via RSS',
    link: 'https://rss.simplecast.com/podcasts/3762/rss',
  },
]

const Podcast: FunctionComponent<PodcastProps> = ({
  podcasts,
  podcast: {
    description,
    contributors,
    episode_number,
    transcript,
    title,
    image_url,
    simplecast_uid,
  },
}) => {
  return (
    <>
      <div className="prose md:prose-xl max-w-2xl w-full mx-auto leading-6 mb-10">
        <img className="max-w-xs mx-auto mb-0" src={image_url} />
        <div className="text-sm uppercase font-light text-center text-gray-500">{`Episode ${episode_number} ${
          contributors && contributors.length > 0
            ? `• ${contributors.join(' && ')}`
            : ''
        }`}</div>
        <h1>{title}</h1>
        <div className="bg-white flex flex-col sm:flex-row mb-10 sticky top-0 z-10">
          <iframe
            height="52px"
            width="100%"
            frameBorder="no"
            scrolling="no"
            seamless
            src={`https://player.simplecast.com/${simplecast_uid}?dark=false`}
          ></iframe>
          <div className="text-gray-900 flex ml-2 content-center justify-center">
            {LINKS.map(({link, title, component: Component}) => (
              <a
                key={link}
                title={title}
                className="transition-colors duration-300 mr-2 w-12 h-12 flex items-center justify-center hover:bg-gray-200 rounded-full"
                href={link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Component className="fill-current text-gray-600" />
              </a>
            ))}
          </div>
        </div>
        {description && <Markdown allowDangerousHtml>{description}</Markdown>}
        {transcript && <h2>Transcript</h2>}
        {transcript && <Markdown allowDangerousHtml>{transcript}</Markdown>}
      </div>
      {podcasts && <MorePodcasts podcasts={podcasts} />}
    </>
  )
}

export default Podcast

export const getServerSideProps: GetServerSideProps = async function ({
  res,
  params,
}) {
  res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate')
  const podcast = params && (await loadPodcast(params.slug as string))
  const podcasts = (await loadPodcasts())
    .filter((filterCast: PodcastResource) => filterCast.id !== podcast.id)
    .sort(
      (a: PodcastResource, b: PodcastResource) =>
        new Date(b.published_at).getTime() - new Date(a.published_at).getTime(),
    )
    .slice(0, 6)

  return {
    props: {
      podcast,
      podcasts,
    },
  }
}
