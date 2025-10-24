import * as React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type {Components} from 'react-markdown'

interface MarkdownProps {
  children: string
  className?: string
  components?: Partial<Components>
}

const Markdown: React.FunctionComponent<MarkdownProps> = ({
  children,
  className,
  components: customComponents,
  ...props
}) => {
  const defaultComponents: Partial<Components> = {
    ol: ({node, ...props}) => (
      <ol
        className="mx-auto max-w-2xl translate-x-1 list-decimal marker:text-black dark:marker:text-blue-400"
        {...props}
      />
    ),
    li: ({node, ...props}) => <li className="text-foreground" {...props} />,
  }

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{...defaultComponents, ...customComponents}}
      className={className}
      {...props}
    >
      {children}
    </ReactMarkdown>
  )
}

export default Markdown
