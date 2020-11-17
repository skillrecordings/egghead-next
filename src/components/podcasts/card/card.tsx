import React, {FunctionComponent} from 'react'
import {PodcastResource} from 'types'
import Image from 'next/image'

type PodcastCardProps = {
  podcast: PodcastResource
}

const IMAGE_SIZE = 220

const PodcastCard: FunctionComponent<PodcastCardProps> = ({
  podcast: {title, path, image_url, contributors},
}) => (
  <li className="list-none bg-white p-3 text-center max-w-xs shadow-md rounded-md transform transition-transform duration-300 hover:scale-105">
    <a
      title="View podcast"
      href={path}
      className="flex flex-col h-full items-center"
    >
      <div
        css={{
          height: `${IMAGE_SIZE}px`,
          width: `${IMAGE_SIZE}px`,
        }}
        className="mb-0 flex-grow-0"
      >
        <Image
          width={IMAGE_SIZE}
          height={IMAGE_SIZE}
          src={image_url}
          className="object-cover mx-auto"
        />
      </div>
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
