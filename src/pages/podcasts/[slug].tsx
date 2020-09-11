import React, {FunctionComponent} from 'react'
import {loadPodcast} from 'lib/podcasts'
import {GetServerSideProps} from 'next'

type PodcastProps = {
  podcast: any
}

const Podcast: FunctionComponent<PodcastProps> = ({podcast}) => {
  return (
    <div>
      <h1>{podcast.title}</h1>{' '}
      <img className="max-w-xs" src={podcast.image_url} />
      <iframe
        height="52px"
        width="100%"
        frameBorder="no"
        scrolling="no"
        seamless
        src={`https://player.simplecast.com/${podcast.simplecast_uid}?dark=false`}
      ></iframe>
    </div>
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
