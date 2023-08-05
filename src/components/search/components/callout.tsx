import React, {FunctionComponent} from 'react'
import Markdown from 'react-markdown'

type CalloutProps = {
  title: string
  children?: string
  imageUrl?: string
  className?: string
}

const Callout: FunctionComponent<React.PropsWithChildren<CalloutProps>> = ({
  title,
  children,
  className,
  imageUrl,
}) => {
  return (
    <div
      className={`md:p-8 p-5 rounded-md overflow-hidden border border-gray-100 ${
        className ? className : ''
      }`}
    >
      <div className="flex items-center mb-4">
        {imageUrl && <img src={imageUrl} alt="" className="mr-2 w-8 h-8" />}
        <h3 className="text-lg font-semibold leading-tight">{title}</h3>
      </div>
      {children && (
        <Markdown className="dark:prose-sm-dark prose-sm max-w-none mt-0">
          {children}
        </Markdown>
      )}
    </div>
  )
}

export default Callout
