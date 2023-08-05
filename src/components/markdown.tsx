import * as React from 'react'
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'

const Markdown: React.FunctionComponent<React.PropsWithChildren<any>> = (
  props,
) => {
  return <ReactMarkdown plugins={[gfm]} {...props} />
}

export default Markdown
