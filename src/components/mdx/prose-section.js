import React from 'react'

const ProseSection = ({children}) => {
  return (
    <section className="prose dark:prose-dark sm:dark:prose-lg-dark sm:prose-lg max-w-none">
      {children}
    </section>
  )
}

export default ProseSection
