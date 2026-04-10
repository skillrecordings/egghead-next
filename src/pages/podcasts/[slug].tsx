import React, {FunctionComponent} from 'react'
import {GetStaticPaths, GetStaticProps} from 'next'
import {withStaticPropsLogging} from '@/lib/logging'
import {loadPodcast, loadPodcasts, loadRelatedPodcasts} from '@/lib/podcasts'
import type {PodcastCardResource} from '@/lib/podcasts'
import type {PodcastResource} from '@/types'
import MorePodcasts from '@/components/podcasts/more/more'
import PodcastUi from '@/components/podcasts/podcast/podcast'
import removeMarkdown from 'remove-markdown'
import {NextSeo} from 'next-seo'

type PodcastProps = {
  podcast: PodcastResource
  podcasts: PodcastCardResource[]
}

const Podcast: FunctionComponent<React.PropsWithChildren<PodcastProps>> = ({
  podcasts,
  podcast,
}) => {
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

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: loadPodcasts().map(({slug}) => ({
    params: {slug},
  })),
  fallback: false,
})

export const getStaticProps = withStaticPropsLogging(async function ({params}) {
  if (!params?.slug || typeof params.slug !== 'string') {
    return {
      notFound: true,
    }
  }

  const podcast = loadPodcast(params.slug)

  if (!podcast) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      podcast,
      podcasts: loadRelatedPodcasts(podcast.id),
    },
  }
}) as GetStaticProps<PodcastProps>
