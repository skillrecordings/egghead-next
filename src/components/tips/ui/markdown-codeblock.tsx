'use client'

import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {atomDark} from 'react-syntax-highlighter/dist/esm/styles/prism'
import {ReactMarkdown} from 'react-markdown/lib/react-markdown'

const MarkdownCodeblock = ({tip, ...props}: {tip: string}) => {
  return (
    <ReactMarkdown
      children={tip}
      components={{
        pre({node, ...props}) {
          return <>{props.children}</>
        },
        code({node, inline, className, children, ...props}) {
          const match = /language-(\w+)/.exec(className || '')
          return !inline && match ? (
            <SyntaxHighlighter
              className="prose-none"
              {...props}
              children={String(children).replace(/\n$/, '')}
              style={atomDark}
              language={match[1]}
              showLineNumbers={true}
              PreTag="div"
            />
          ) : (
            <code {...props} className={className}>
              {children}
            </code>
          )
        },
      }}
    />
  )
}

export default MarkdownCodeblock
