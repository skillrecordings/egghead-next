import * as React from 'react'
import cx from 'classnames'

const OverlayWrapper: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({children, className}) => {
  return (
    <div
      className={cx(
        'sm:py-16 py-8 flex items-center justify-center h-full bg-black text-white bg-opacity-80 w-full',
        className,
      )}
    >
      {children}
    </div>
  )
}

export default OverlayWrapper
