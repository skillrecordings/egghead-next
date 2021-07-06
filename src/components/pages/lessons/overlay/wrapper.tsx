import React, {FunctionComponent} from 'react'

const OverlayWrapper: FunctionComponent<{
  children: React.ReactNode
}> = ({children}) => {
  return (
    <div className="lg:aspect-w-16 lg:aspect-h-9">
      <div className="bg-gray-800 text-white bg-opacity-90 flex flex-col items-center justify-center px-4 py-6 min-h-[16rem] md:min-h-[24rem] lg:min-h-0">
        {children}
      </div>
    </div>
  )
}

export default OverlayWrapper
