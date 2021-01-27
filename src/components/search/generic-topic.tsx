import React, {FunctionComponent} from 'react'
import Markdown from 'react-markdown'
import Image from 'next/image'
import {NextSeo} from 'next-seo'

type TopicProps = {
  title: string
  children?: string
  imageUrl?: string
  className?: string
  description?: string
}

const GenericTopic: FunctionComponent<TopicProps> = ({
  title,
  children,
  className,
  imageUrl,
  description,
}) => {
  return (
    <>
      <NextSeo
        description={description}
        title={title}
        titleTemplate={'Learn %s | egghead.io'}
        twitter={{
          site: `@eggheadio`,
          cardType: 'summary',
        }}
        openGraph={{
          title,
          description: description,
          site_name: 'egghead',
          images: [
            {
              url: imageUrl || '',
            },
          ],
        }}
      />
      <div
        className={`bg-white dark:bg-gray-800 dark:text-gray-200 grid grid-cols-8 h-full relative items-start overflow-hidden rounded-md  ${
          className ? className : ''
        }`}
      >
        {imageUrl && (
          <div className="overflow-hidden sm:col-span-2 col-span-2 w-full h-full p-6">
            <Image src={imageUrl} width={480} height={480} />
          </div>
        )}
        <div className="sm:col-span-6 col-span-6 sm:p-8 p-4 sm:pr-3 flex flex-col justify-start h-full">
          <h1 className="sm:text-2xl text-xl font-bold">{title}</h1>
          {description && (
            <Markdown
              source={description}
              className="prose dark:prose-dark pt-2 sm:text-base text-sm leading-normal text-gray-800 dark:text-gray-200 mt-0"
            />
          )}
        </div>
      </div>
    </>
  )
}

export default GenericTopic
