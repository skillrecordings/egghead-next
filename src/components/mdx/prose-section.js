import React from 'react'

const ProseSection = ({children}) => {
  return (
    <div className="prose dark:prose-dark sm:dark:prose-lg-dark dark:prose-a:text-blue-300 prose-a:text-blue-500 sm:prose-lg max-w-none">
      {children}
    </div>
  )
}

export default ProseSection
