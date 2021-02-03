import * as React from 'react'

const CardPreview: React.FC = ({children}) => {
  return (
    <div className={`block flex-shrink-0 sm:w-auto w-20 mx-auto`}>
      {children}
    </div>
  )
}

export default CardPreview
