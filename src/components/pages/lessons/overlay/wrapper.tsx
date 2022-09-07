import * as React from 'react'

const OverlayWrapper: React.FC<{
  children: React.ReactNode
}> = ({children}) => {
  return (
    <div className="sm:py-16 py-8 flex items-center justify-center h-full bg-black text-white bg-opacity-80 w-full absolute top-0 z-10">
      {children}
    </div>
  )
}

export default OverlayWrapper
