import React, {FunctionComponent} from 'react'
import Markdown from 'react-markdown'
import Link from 'next/link'
import Image from 'next/image'
import {get} from 'lodash'

type ArticleResource = {
  path: string
  image: string
  name: string
  title: string
  description: string
  author: string
}

type ArticleProps = {
  className?: string
  resource?: ArticleResource
  location?: string
}

const ArticleCard: FunctionComponent<ArticleProps> = ({resource}) => {
  const {title, path, image, name, description, author} = resource || {}

  return (
    <div
      className="flex flex-col rounded-lg shadow-lg overflow-hidden mb-4 max-w-md"
      key={path}
    >
      {image && path && (
        <div className="flex-shrink-0">
          <Link href={path}>
            <a className="block sm:w-auto w-22 mx-auto sm:mb-2 mb-0">
              <Image
                src={get(image, 'src', image)}
                width={500}
                height={290}
                alt={`illustration for ${title}`}
                className="sm:h-72 h-30 w-full object-cover"
              />
            </a>
          </Link>
        </div>
      )}

      <div className="flex-1 dark:bg-gray-800 p-6 flex flex-col justify-between">
        <p className="uppercase font-semibold text-xs text-gray-700 dark:text-gray-200">
          {name}
        </p>
        <div className="flex-1">
          <a href={path} className="block mt-2">
            <h2 className="sm:text-xl text-lg font-semibold dark:text-white text-gray-900 leading-tighter hover:text-blue-600 transition delay-150">
              {title}
            </h2>
            {author && (
              <div className="text-sm text-gray-600 dark:text-gray-300 mb-2 mt-2">
                {author}
              </div>
            )}
            {description && (
              <Markdown
                source={description}
                className="prose dark:prose-dark dark:prose-sm-dark prose-sm mt-4"
              />
            )}
          </a>
        </div>
      </div>
    </div>
  )
}

export default ArticleCard
