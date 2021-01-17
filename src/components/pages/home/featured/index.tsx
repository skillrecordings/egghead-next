import React, {FunctionComponent} from 'react'
import Card, {CardResource} from 'components/pages/home/card'
import Markdown from 'react-markdown'
import Link from 'next/link'
import Image from 'next/image'
import {track} from 'utils/analytics'

type FeaturedResourceProps = {
  resource: CardResource
  buttonLabel?: string
}

const FeaturedResource: FunctionComponent<FeaturedResourceProps> = ({
  resource,
  buttonLabel,
}) => {
  const {path, image, title, byline, instructor, description} = resource
  return (
    <div className="relative bg-gray-900 text-white">
      <div className="absolute top-0 left-0 bg-gradient-to-r from-pink-400 via-purple-500 to-cyan-500 h-2 w-full" />
      <div className="relative z-10 px-5 sm:py-16 py-10 sm:text-left text-center">
        <div className="space-y-5 mx-auto flex items-center justify-center max-w-screen-lg">
          <Link href={path}>
            <a className="flex sm:flex-row flex-col items-center justify-center sm:space-x-5 sm:space-y-0 space-y-5">
              <div className="flex-shrink-0">
                <Image src={image} width={300} height={300} alt={title} />
              </div>
              <div className="flex flex-col sm:items-start items-center">
                <h2 className="text-xs text-blue-200 uppercase font-semibold mb-2">
                  {byline}
                </h2>
                <h3 className="text-3xl font-bold leading-tighter">{title}</h3>
                <Link href={instructor.path}>
                  <a className="mt-2 flex items-center space-x-2 text-base">
                    <Image
                      src={instructor.image}
                      width={40}
                      height={40}
                      className="rounded-full"
                      alt={instructor.name}
                    />
                    <span>{instructor.name}</span>
                  </a>
                </Link>
                <Markdown
                  source={description || ''}
                  className="mt-4 leading-relaxed text-gray-200"
                />
                {buttonLabel && path && (
                  <Link href={path}>
                    <a className="inline-flex font-semibold rounded-lg bg-blue-600 px-4 py-3 text-white mt-6">
                      {buttonLabel}
                    </a>
                  </Link>
                )}
              </div>
            </a>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default FeaturedResource
