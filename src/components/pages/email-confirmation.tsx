import * as React from 'react'

const EmailConfirmation: React.FunctionComponent<{
  className?: string
  Background?: React.FunctionComponent<{className?: string}>
}> = ({
  children,
  Background,
  className = 'flex flex-col items-center justify-center max-w-screen-md min-h-screen py-32 mx-auto sm:py-40',
}) => (
  <div className="container">
    <div className={className}>
      <div className="relative z-10 prose dark:prose-dark dark:prose-a:text-blue-300 prose-a:text-blue-500 hide-toc">
        {children}
      </div>
      <div className="absolute top-0 z-0 w-full h-screen bg-cool-gray-50">
        <div className="relative w-full min-h-screen overflow-hidden">
          {Background && (
            <Background className="absolute top-0 left-0 z-20 w-screen h-screen overflow-hidden" />
          )}
        </div>
      </div>
    </div>
  </div>
)

export default EmailConfirmation
