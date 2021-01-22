import React, {FunctionComponent} from 'react'
import Markdown from 'react-markdown'

type TopicProps = {
  title: string
  children?: string
  imageUrl?: string
  className?: string
}

const Topic: FunctionComponent<TopicProps> = ({
  title,
  children,
  className,
  imageUrl,
}) => {
  return (
    <div
      className={`bg-white shadow-sm grid grid-cols-8 h-full relative items-start overflow-hidden rounded-md border border-gray-100 ${
        className ? className : ''
      }`}
    >
      <div
        className="overflow-hidden sm:col-span-2 col-span-2 w-full h-full"
        style={{
          background: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: '38%',
        }}
      />
      <div className="sm:col-span-6 col-span-6 sm:p-8 p-4 sm:pr-3 flex flex-col justify-start h-full">
        <h1 className="sm:text-2xl text-xl font-bold">{title}</h1>
        {children && (
          <Markdown className="prose pt-2 sm:text-base text-sm leading-normal text-gray-800 mt-0">
            {children}
          </Markdown>
        )}
      </div>
    </div>
  )
}

export default Topic
