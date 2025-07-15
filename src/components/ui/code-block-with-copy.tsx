import React from 'react'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {nightOwl} from 'react-syntax-highlighter/dist/cjs/styles/prism'
import ClipboardCopyIcon from '@heroicons/react/outline/ClipboardCopyIcon'

interface CodeBlockWithCopyProps {
  code: string
  language: string
  customStyle?: React.CSSProperties
}

const CodeBlockWithCopy: React.FC<CodeBlockWithCopyProps> = ({
  code,
  language,
  customStyle = {},
}) => {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy code to clipboard', error)
    }
  }

  return (
    <div className="relative group">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-gray-700 dark:bg-gray-800 text-white px-2 py-1 rounded z-10"
      >
        {copied ? 'Copied!' : <ClipboardCopyIcon className="w-4 h-4" />}
      </button>
      <SyntaxHighlighter
        language={language}
        style={nightOwl}
        PreTag="div"
        wrapLongLines={true}
        customStyle={{
          overflowX: 'auto',
          maxWidth: '100%',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all',
          ...customStyle,
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}

export default CodeBlockWithCopy
