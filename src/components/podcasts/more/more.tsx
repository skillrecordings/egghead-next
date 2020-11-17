import React, { FunctionComponent } from 'react'
import {PodcastResource} from 'types'
import PodcastCard from 'components/podcasts/card/card'

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

export default MorePodcasts