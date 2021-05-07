import React from 'react'

const ProseSection = ({children}) => {
  return (
    <div className="prose dark:prose-dark sm:dark:prose-lg-dark sm:prose-lg max-w-none">
      {children}
    </div>
  )
}

export default ProseSection
