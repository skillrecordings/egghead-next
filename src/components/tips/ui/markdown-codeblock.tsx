'use client'

import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {nightOwl} from 'react-syntax-highlighter/dist/cjs/styles/prism'
import {ReactMarkdown} from 'react-markdown/lib/react-markdown'
import type {CodeProps} from 'react-markdown/lib/ast-to-react'

const MarkdownCodeblock = ({tip, ...props}: {tip: string}) => {
  return (
    <ReactMarkdown
      children={tip}
      components={{
        code: ({node, inline, className, children, ...props}: CodeProps) => {
          const match = /language-(\w+)/.exec(className || '')
          return !inline && match ? (
            <SyntaxHighlighter
              className="prose-none"
              {...props}
              children={String(children).replace(/\n$/, '')}
              style={nightOwl}
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
