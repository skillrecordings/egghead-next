import * as React from 'react'

const EmailConfirmation: React.FunctionComponent<{
  className?: string
  Background?: React.FunctionComponent<{className?: string}>
}> = ({
  children,
  Background,
  className = 'sm:py-40 py-32 px-8 max-w-screen-md mx-auto min-h-screen flex flex-col items-center justify-center',
}) => (
  <div className={className}>
    <div className="prose relative z-10 px-5 hide-toc">{children}</div>
    <div className="bg-cool-gray-50 h-screen absolute z-0 top-0 w-full">
      <div className="relative overflow-hidden w-full min-h-screen">
        {Background && (
          <Background className="absolute left-0 top-0 w-screen h-screen overflow-hidden z-20" />
        )}
      </div>
    </div>
  </div>
)

export default EmailConfirmation
