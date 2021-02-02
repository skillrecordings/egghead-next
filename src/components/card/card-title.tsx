import * as React from 'react'

const CardTitle: React.FC = ({children}) => {
  return (
    <div className={`text-xl font-bold tracking-tight leading-tight mb-2`}>
      {children}
    </div>
  )
}

export default CardTitle
