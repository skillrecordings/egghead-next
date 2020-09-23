import React from 'react'

const Card = ({children}) => {
  return (
    <div className="max-w-2xl rounded shadow px-8 py-6 flex flex-col text-left">
      {children}
    </div>
  )
}

export default Card
