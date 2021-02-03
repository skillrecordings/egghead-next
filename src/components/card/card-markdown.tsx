import * as React from 'react'
import Markdown from '../markdown'

const CardMarkdown: React.FC = ({children}) => {
  return (
    <Markdown
      className={`prose prose-sm dark:prose-dark dark:prose-dark-sm max-w-none mb-3`}
    >
      {children}
    </Markdown>
  )
}

export default CardMarkdown
