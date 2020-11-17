import React, {FunctionComponent} from 'react'
import {GetServerSideProps} from 'next'
import {loadPodcast, loadPodcasts} from 'lib/podcasts'
import {PodcastResource} from 'types'
import MorePodcasts from 'components/podcasts/more/more'
import PodcastUi from 'components/podcasts/podcast/podcast'

type PodcastProps = {
  podcast: PodcastResource
  podcasts: Array<PodcastResource>
}

const Podcast: FunctionComponent<PodcastProps> = ({podcasts, podcast}) => {
  return (
    <>
      <PodcastUi podcast={podcast} />
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
