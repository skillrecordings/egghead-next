import React from 'react'

const container =
  'mx-auto w-full bg-blue-100 border-l-4 overflow-hidden border-blue-300 text-blue-600 sm:px-8 px-4 py-1'

export default function Callout({children}) {
  return <div className={container}>{children}</div>
}
