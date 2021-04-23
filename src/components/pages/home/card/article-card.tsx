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
  horizontal?: boolean
}

const ArticleCard: FunctionComponent<ArticleProps> = ({
  resource,
  horizontal = false,
  className = '',
}) => {
  const {title, path, image, name, description, author} = resource || {}

  return (
    <div
      className={
        horizontal
          ? 'flex sm:flex-row flex-col max-w-2xl rounded-lg shadow-lg overflow-hidden mb-4'
          : 'max-w-md rounded-lg shadow-lg overflow-hidden mb-4'
      }
      key={path}
    >
      {image && path && (
        <Link
          className={
            horizontal
              ? 'block mb-4 m-4 w-1/2'
              : 'block sm:w-auto w-22 mx-auto sm:mb-2 mb-0'
          }
          href={path}
        >
          <a>
            <Image
              src={get(image, 'src', image)}
              width={200}
              height={90}
              alt={`illustration for ${title}`}
              className={
                horizontal
                  ? 'inline h-full w-full  object-cover rounded-sm'
                  : 'sm:h-70 h-30 w-auto object-cover'
              }
            />
          </a>
        </Link>
      )}

      <div
        className={
          horizontal
            ? 'dark:bg-gray-800 p-6 flex flex-col pl-3'
            : 'dark:bg-gray-800 p-6 flex flex-col'
        }
      >
        <p className="uppercase font-semibold text-xs text-gray-700 dark:text-gray-200">
          Article
        </p>
        <div className="">
          {title &&
            (path ? (
              <Link href={path}>
                <a href={path} className="block mt-2">
                  <h3 className="sm:text-xl text-lg font-semibold dark:text-white text-gray-900 leading-tighter hover:text-blue-600 transition ease-in-out">
                    {title}
                  </h3>
                </a>
              </Link>
            ) : (
              <h3 className="sm:text-xl text-lg font-semibold dark:text-white text-gray-900 leading-tighter">
                {title}
              </h3>
            ))}

          {author && (
            <div className="text-sm text-gray-600 dark:text-gray-300 mb-2 mt-2">
              {author}
            </div>
          )}
          {description && !horizontal && (
            <Markdown
              source={description}
              className="prose dark:prose-dark dark:prose-sm-dark prose-sm mt-4"
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default ArticleCard
