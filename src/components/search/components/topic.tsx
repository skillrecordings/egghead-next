import React, {FunctionComponent} from 'react'
import Markdown from 'react-markdown'

type TopicProps = {
  title: string
  children?: string
  imageUrl?: string
  className?: string
}

const Topic: FunctionComponent<React.PropsWithChildren<TopicProps>> = ({
  title,
  children,
  className,
  imageUrl,
}) => {
  return (
    <div
      className={`bg-white dark:bg-gray-800 dark:text-gray-200 grid grid-cols-8 h-full relative items-start overflow-hidden border border-gray-100 dark:border-gray-800 ${
        className ? className : ''
      }`}
    >
      <div
        className="overflow-hidden sm:col-span-2 col-span-2 w-full h-full"
        style={{
          background: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: '50%',
        }}
      />
      <div className="sm:col-span-6 col-span-6 flex flex-col justify-start h-full p-5">
        <h1 className="sm:text-3xl text-xl font-bold mb-2">{title}</h1>
        {children && (
          <Markdown className="prose dark:prose-dark dark:prose-a:text-blue-300 prose-a:text-blue-500 pt-2 text-sm leading-normal text-gray-800 dark:text-gray-200 mt-0">
            {children}
          </Markdown>
        )}
      </div>
    </div>
  )
}

export default Topic
