import React, {FunctionComponent} from 'react'

const OverlayWrapper: FunctionComponent<{
  children: React.ReactNode
}> = ({children}) => {
  return (
    <div className="flex items-center justify-center bg-gray-800 text-white bg-opacity-80 w-full h-full">
      {children}
    </div>
  )
}

export default OverlayWrapper
