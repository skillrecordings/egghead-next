import React, {FunctionComponent} from 'react'
import Markdown from 'react-markdown/with-html'
import {loadPodcast} from 'lib/podcasts'
import {GetServerSideProps} from 'next'

type PodcastProps = {
  podcast: any
}

const MorePodcasts = () => <h1>More Podcasts Here...</h1>

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
    <>
      <div className="prose md:prose-xl max-w-2xl w-full mx-auto leading-6">
        <img className="max-w-xs mx-auto mb-0" src={image_url} />
        <div className="text-sm uppercase font-light text-center text-gray-500">{`Episode ${episode_number} ${
          contributors && contributors.length > 0
            ? `• ${contributors.join(' && ')}`
            : ''
        }`}</div>
        <h1>{title}</h1>
        <iframe
          height="52px"
          width="100%"
          frameBorder="no"
          scrolling="no"
          seamless
          className="mb-10 sticky top-0 z-10"
          src={`https://player.simplecast.com/${simplecast_uid}?dark=false`}
        ></iframe>
        {description && (
          <Markdown allowDangerousHtml className="prose">
            {description}
          </Markdown>
        )}
        {transcript && <h2>Transcript</h2>}
        {transcript && (
          <Markdown allowDangerousHtml className="prose">
            {transcript}
          </Markdown>
        )}
      </div>
      <MorePodcasts />
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
  return {
    props: {
      podcast,
    },
  }
}
