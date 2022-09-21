import * as React from 'react'

const WidgetWrapper: React.FC<{title: string; children: React.ReactNode}> = ({
  title,
  children,
}) => {
  return (
    <div className="p-4 border border-gray-200">
      <h2 className="pb-2 text-xl leading-none border-b border-gray-200 dark:border-gray-800">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </div>
  )
}

export default WidgetWrapper
