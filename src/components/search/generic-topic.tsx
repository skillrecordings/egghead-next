import React, {FunctionComponent} from 'react'
import Markdown from 'react-markdown'
import Image from 'next/image'
import {NextSeo} from 'next-seo'
import {useRouter} from 'next/router'

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
  const router = useRouter()
  return (
    <>
      <NextSeo
        description={description}
        canonical={`${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}${router.asPath}`}
        title={title}
        titleTemplate={'Learn %s | egghead.io'}
        twitter={{
          site: `@eggheadio`,
          cardType: 'summary',
        }}
        openGraph={{
          title,
          url: `${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}${router.asPath}`,
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
        className={`flex items-center pb-10 py-5 xl:px-0 px-5 max-w-screen-xl mx-auto dark:bg-gray-900`}
      >
        {imageUrl && (
          <div className="overflow-hidden h-full p-6">
            <Image src={imageUrl} width={160} height={160} />
          </div>
        )}
        <div className="sm:p-8 p-4 sm:pr-3 flex flex-col justify-start h-full">
          <h1 className="sm:text-2xl text-xl font-bold">{title}</h1>
          {description && (
            <Markdown
              source={description}
              className="prose dark:prose-dark dark:prose-a:text-blue-300 prose-a:text-blue-500 pt-2 sm:text-base text-sm leading-normal text-gray-800 dark:text-gray-200 mt-0"
            />
          )}
        </div>
      </div>
    </>
  )
}

export default GenericTopic
