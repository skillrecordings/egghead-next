import React, {FunctionComponent} from 'react'
import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import Image from 'next/image'
import {PodcastResource} from 'types'
import Rss from '../../images/rss.svg'
import Spotify from '../../images/spotify.svg'
import ApplePodcasts from '../../images/apple-podcasts.svg'

type PodcastProps = {
  podcast: PodcastResource
}

const LINKS = [
  {
    component: ApplePodcasts,
    title: 'Listen on Apple Podcasts',
    link: 'https://itunes.apple.com/us/podcast/egghead-io-instructor-chats/id1308497805',
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

const IMAGE_SIZE = 320

const Podcast: FunctionComponent<PodcastProps> = ({
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
    <div className="max-w-2xl w-full mx-auto leading-6 mb-10">
      <div className="flex items-center justify-center">
        <Image
          css={{clipPath: 'circle(33%)'}}
          className="absolute top-0 left-0"
          src={image_url}
          width={IMAGE_SIZE}
          height={IMAGE_SIZE}
        />
      </div>
      <div className="prose dark:prose-dark md:dark:prose-xl-dark md:prose-xl leading-6">
        <div className="text-sm uppercase font-light text-center text-gray-500 dark:text-gray-400 py-4">{`Episode ${episode_number} ${
          contributors && contributors.length > 0
            ? `• ${contributors.join(' && ')}`
            : ''
        }`}</div>
        <h1 className="mb-10">{title}</h1>
        <div className="flex flex-col sm:flex-row mb-10 sticky top-0 z-10">
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
                className="transition-colors ease-in-out duration-300 mr-2 w-12 h-12 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full"
                href={link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Component className="fill-current text-gray-600" />
              </a>
            ))}
          </div>
        </div>
        {description && (
          <Markdown rehypePlugins={[rehypeRaw, rehypeSanitize]}>
            {description}
          </Markdown>
        )}
        {transcript && <h2>Transcript</h2>}
        {transcript && (
          <Markdown rehypePlugins={[rehypeRaw, rehypeSanitize]}>
            {transcript}
          </Markdown>
        )}
      </div>
    </div>
  )
}

export default Podcast
