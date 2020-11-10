import React, {FunctionComponent} from 'react'
import {PodcastResource} from 'types'

type PodcastCardProps = {
  podcast: PodcastResource
}

const PodcastCard: FunctionComponent<PodcastCardProps> = ({
  podcast: {title, path, image_url, contributors},
}) => (
  <li className="list-none bg-white p-3 text-center max-w-xs shadow-md rounded-md transform transition-transform duration-300 hover:scale-105">
    <a title="View podcast" href={path} className="flex flex-col h-full">
      <img src={image_url} className="flex-grow-0" />
      <h4 className="text-gray-700 flex-grow mb-6 text-lg leading-6">
        {title}
      </h4>
      <div className="text-sm flex-grow-0 font-light text-center text-gray-500">{`${
        contributors && contributors.length > 0
          ? `${contributors.join(' && ')}`
          : ''
      }`}</div>
    </a>
  </li>
)

export default PodcastCard
