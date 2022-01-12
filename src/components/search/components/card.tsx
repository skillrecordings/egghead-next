import React, {FunctionComponent} from 'react'
import Markdown from 'react-markdown'

type CardProps = {
  title: string
  description?: string
  children?: React.ReactNode
  imageUrl?: string
  className?: string
  byline?: string
}

const Card: FunctionComponent<CardProps> = ({
  children,
  title,
  description,
  className,
  byline,
}) => {
  return (
    <div
      className={`md:p-6 p-4 rounded-md overflow-hidden border border-gray-100 ${
        className ? className : ''
      }`}
    >
      <h3 className="sm:text-xl text-lg font-semibold">{title}</h3>
      {byline && <div className="text-sm text-gray-600">{byline}</div>}
      {description && (
        <Markdown className="prose dark:prose-dark dark:prose-a:text-blue-300 prose-a:text-blue-500 mt-1 sm:text-base text-sm">
          {description}
        </Markdown>
      )}
      <div className="mt-6">{children}</div>
    </div>
  )
}

export default Card
