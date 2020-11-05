import React, {FunctionComponent} from 'react'
import Markdown from 'react-markdown'

type CardProps = {
  title: string
  description?: string
  children?: React.ReactElement
  imageUrl?: string
  className?: string
}

const Card: FunctionComponent<CardProps> = ({
  title,
  description,
  className,
  children,
}) => {
  return (
    <div
      className={`md:p-8 p-5 rounded-md overflow-hidden border border-gray-200 ${
        className ? className : ''
      }`}
    >
      <h3 className="sm:text-xl text-lg font-semibold">{title}</h3>
      {description && (
        <Markdown className="prose mt-1 sm:text-base text-sm">
          {description}
        </Markdown>
      )}
      <div className="mt-6">{children}</div>
    </div>
  )
}

export default Card
