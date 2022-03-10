import React, {FunctionComponent} from 'react'

const OverlayWrapper: FunctionComponent<{
  children: React.ReactNode
}> = ({children}) => {
  return (
    <div className="sm:py-16 py-8 flex items-center justify-center h-full bg-black text-white bg-opacity-90 w-full">
      {children}
    </div>
  )
}

export default OverlayWrapper
