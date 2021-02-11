import React, {FunctionComponent} from 'react'
import {GetServerSideProps} from 'next'
import {loadPodcast, loadPodcasts} from 'lib/podcasts'
import {PodcastResource} from 'types'
import MorePodcasts from 'components/podcasts/more/more'
import PodcastUi from 'components/podcasts/podcast/podcast'
import removeMarkdown from 'remove-markdown'
import {NextSeo} from 'next-seo'

type PodcastProps = {
  podcast: PodcastResource
  podcasts: Array<PodcastResource>
}

const Podcast: FunctionComponent<PodcastProps> = ({podcasts, podcast}) => {
  return (
    <>
      <NextSeo
        description={removeMarkdown(podcast.summary)}
        canonical={`${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}${podcast.path}`}
        title={podcast.title}
        titleTemplate={'%s | egghead.io'}
        twitter={{
          site: `@eggheadio`,
          cardType: 'summary_large_image',
        }}
        openGraph={{
          title: podcast.title,
          url: `${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}${podcast.path}`,
          description: removeMarkdown(podcast.summary),
          site_name: 'egghead',
          images: [
            {
              url: `https://og-image-react-egghead.now.sh/podcast/${podcast.slug}`,
            },
          ],
        }}
      />
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
