import React, {FunctionComponent} from 'react'
import Markdown from 'react-markdown'

type CardProps = {
  title: string
  description?: string
  children?: React.ReactNode
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
      className={`md:p-6 p-4 rounded-md overflow-hidden border border-gray-100 ${
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
