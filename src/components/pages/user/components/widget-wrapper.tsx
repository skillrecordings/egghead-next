import * as React from 'react'

const WidgetWrapper: React.FC<{title: string; children: React.ReactNode}> = ({
  title,
  children,
}) => {
  return (
    <div className="py-4 border border-gray-200">
      <h2 className="pb-3 md:pb-4 px-4 text-lg font-medium md:font-normal md:text-xl leading-none border-b border-gray-200 dark:border-gray-800">
        {title}
      </h2>
      <div className="mt-4 px-4">{children}</div>
    </div>
  )
}

export default WidgetWrapper
