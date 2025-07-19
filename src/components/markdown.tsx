import * as React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const Markdown: React.FunctionComponent<React.PropsWithChildren<any>> = (
  props,
) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        ol: ({node, ...props}) => (
          <ol
            className="mx-auto max-w-2xl translate-x-1 list-decimal marker:text-black dark:marker:text-blue-400"
            {...props}
          />
        ),
        li: ({node, ...props}) => <li className="text-foreground" {...props} />,
      }}
      {...props}
    />
  )
}

export default Markdown
