import React, {FunctionComponent} from 'react'
import Card, {CardResource} from './'
import Link from 'next/link'
import {track} from 'utils/analytics'
import Image from 'next/image'
import Textfit from 'react-textfit'
import {get} from 'lodash'
import Collection from 'components/pages/home/collection'
import Markdown from 'react-markdown'

type CardProps = {
  data: CardResource
  className?: string
  memberTitle?: string
  viewer?: any
}

export const CardVerticalLarge: FunctionComponent<CardProps> = ({data}) => {
  const {path, image, title, name, byline} = data
  return (
    <Card className="border-none flex flex-col items-center justify-center text-center sm:py-8 py-6">
      <>
        {image && (
          <Link href={path}>
            <a
              onClick={() => {
                track('clicked home page resource', {
                  resource: path,
                  linkType: 'image',
                })
              }}
              className="mb-2 mx-auto w-32"
              tabIndex={-1}
            >
              <Image
                width={220}
                height={220}
                src={get(image, 'src', image)}
                alt={`illustration for ${title}`}
              />
            </a>
          </Link>
        )}
        <h2 className="uppercase font-semibold text-xs mb-1 text-gray-700 dark:text-gray-300">
          {name}
        </h2>
        <Link href={path}>
          <a
            onClick={() => {
              track('clicked home page resource', {
                resource: path,
                linkType: 'text',
              })
            }}
            className="hover:text-blue-600 dark:hover:text-blue-300"
          >
            <h3 className="md:text-lg text-base sm:font-semibold font-bold leading-tight">
              <Textfit mode="multi" min={14} max={20}>
                {title}
              </Textfit>
            </h3>
          </a>
        </Link>
        <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">
          {byline}
        </div>
      </>
    </Card>
  )
}

export const CardVerticalWithStack: FunctionComponent<CardProps> = ({
  data,
  memberTitle,
  viewer,
}) => {
  const {name, title, description, path} = data
  return (
    <Card>
      <>
        <h2 className="uppercase font-semibold text-xs mb-1 text-gray-700 dark:text-gray-300">
          {(viewer?.is_pro || viewer?.is_instructor) && memberTitle
            ? memberTitle
            : name}
        </h2>
        {path ? (
          <Link href={path}>
            <a
              onClick={() => {
                track('clicked home page resource', {
                  resource: path,
                  linkType: 'text',
                })
              }}
              className="hover:text-blue-600 dark:hover:text-blue-300"
            >
              <h3 className="text-xl font-bold tracking-tight leading-tight mb-2">
                {title}
              </h3>
            </a>
          </Link>
        ) : (
          <h3 className="text-xl font-bold tracking-tight leading-tight mb-2">
            {title}
          </h3>
        )}
        <div>
          <Markdown
            source={description || ''}
            className="prose prose-sm dark:prose-dark dark:prose-dark-sm max-w-none mb-3 "
          />
          <Collection resource={data} />
        </div>
      </>
    </Card>
  )
}
