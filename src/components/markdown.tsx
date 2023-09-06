import * as React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const Markdown: React.FunctionComponent<React.PropsWithChildren<any>> = (
  props,
) => {
  return <ReactMarkdown remarkPlugins={[remarkGfm]} {...props} />
}

export default Markdown
