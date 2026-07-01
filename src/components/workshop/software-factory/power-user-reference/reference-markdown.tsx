'use client'
import * as React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm-v3'
import HighlightedCode from './highlighted-code'

const GITHUB_BASE =
  'https://github.com/johnlindquist/power-user/blob/main/final/'
const REFERENCE_BASE = '/workshop/software-factory/power-user-reference'
const KEYFRAME_BASE = '/workshop/codex/power-user/keyframes'

// The reference packet links between sibling markdown files. Each doc is its
// own route here, so rewrite those links to the matching reference route, point
// keyframe links at the published images, and send anything else to the repo.
function rewriteHref(href?: string): string {
  if (!href) return '#'
  if (href.startsWith('http') || href.startsWith('#')) return href

  // e.g. "source-excerpts/codex-zsh-wrappers.md" -> ".../codex-zsh-wrappers"
  if (href.endsWith('.md')) {
    const slug = href.replace(/^.*\//, '').replace(/\.md$/, '')
    return `${REFERENCE_BASE}/${slug}`
  }

  // keyframe images live under public/
  if (href.includes('keyframes/')) {
    return `${KEYFRAME_BASE}/${href.replace(/^.*\//, '')}`
  }

  return `${GITHUB_BASE}${href}`
}

// react-markdown 8's `Components` type is built against an older `@types/react`
// JSX identity, so we cast at the usage site (matching video-transcript.tsx).
const referenceComponents = {
  h1: ({node, ...props}: any) => (
    <h1
      className="mb-4 mt-2 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl"
      {...props}
    />
  ),
  h2: ({node, ...props}: any) => (
    <h2
      className="mb-3 mt-10 text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white"
      {...props}
    />
  ),
  h3: ({node, ...props}: any) => (
    <h3
      className="mb-2 mt-8 text-lg font-bold text-gray-900 dark:text-white"
      {...props}
    />
  ),
  p: ({node, ...props}: any) => (
    <p
      className="my-4 leading-relaxed text-gray-700 dark:text-gray-300"
      {...props}
    />
  ),
  a: ({node, href, ...props}: any) => (
    <a
      href={rewriteHref(href)}
      className="font-medium text-blue-600 underline-offset-2 hover:underline dark:text-blue-400"
      {...(href?.startsWith('http')
        ? {target: '_blank', rel: 'noopener noreferrer'}
        : {})}
      {...props}
    />
  ),
  ul: ({node, ...props}: any) => (
    <ul
      className="my-4 list-disc space-y-1.5 pl-6 text-gray-700 marker:text-blue-500 dark:text-gray-300"
      {...props}
    />
  ),
  ol: ({node, ...props}: any) => (
    <ol
      className="my-4 list-decimal space-y-1.5 pl-6 text-gray-700 marker:font-semibold marker:text-blue-500 dark:text-gray-300"
      {...props}
    />
  ),
  li: ({node, ...props}: any) => <li className="leading-relaxed" {...props} />,
  strong: ({node, ...props}: any) => (
    <strong className="font-bold text-gray-900 dark:text-white" {...props} />
  ),
  blockquote: ({node, ...props}: any) => (
    <blockquote
      className="my-4 border-l-4 border-blue-400 bg-blue-50 py-2 pl-4 italic text-gray-700 dark:border-blue-500/60 dark:bg-blue-500/5 dark:text-gray-300"
      {...props}
    />
  ),
  hr: () => <hr className="my-8 border-gray-200 dark:border-gray-800" />,
  table: ({node, ...props}: any) => (
    <div className="my-6 overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
      <table className="w-full border-collapse text-left text-sm" {...props} />
    </div>
  ),
  thead: ({node, ...props}: any) => (
    <thead
      className="bg-gray-50 text-gray-900 dark:bg-gray-900/60 dark:text-white"
      {...props}
    />
  ),
  th: ({node, isHeader, ...props}: any) => (
    <th
      className="border-b border-gray-200 px-4 py-3 font-bold dark:border-gray-800"
      {...props}
    />
  ),
  td: ({node, isHeader, ...props}: any) => (
    <td
      className="border-b border-gray-100 px-4 py-3 align-top text-gray-700 last:border-0 dark:border-gray-800/70 dark:text-gray-300 [&_code]:whitespace-nowrap"
      {...props}
    />
  ),
  code: ({node, inline, className, children, ...props}: any) => {
    if (inline) {
      return (
        <code
          className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[0.85em] text-blue-700 dark:bg-gray-800 dark:text-blue-300"
          {...props}
        >
          {children}
        </code>
      )
    }
    const language = /language-(\w+)/.exec(className || '')?.[1]
    const code = String(children).replace(/\n$/, '')
    return (
      <HighlightedCode
        code={code}
        language={language}
        className="font-mono text-[0.85rem] leading-relaxed"
      />
    )
  },
  pre: ({node, ...props}: any) => (
    <pre
      className="my-5 overflow-x-auto rounded-xl border border-gray-800 bg-gray-1000 text-gray-100 shadow-smooth"
      {...props}
    />
  ),
}

const ReferenceMarkdown: React.FunctionComponent<{children: string}> = ({
  children,
}) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={referenceComponents as any}
    >
      {children}
    </ReactMarkdown>
  )
}

// Renders a short snippet of markdown inline (code spans, links) without the
// block margins of the full renderer. Used for card summaries and captions.
const inlineComponents = {
  p: ({node, ...props}: any) => <span {...props} />,
  a: ({node, href, ...props}: any) => (
    <a
      href={rewriteHref(href)}
      className="font-medium text-blue-600 hover:underline dark:text-blue-400"
      {...props}
    />
  ),
  code: ({node, inline, ...props}: any) => (
    <code
      className="rounded bg-gray-100 px-1 py-0.5 font-mono text-[0.85em] text-blue-700 dark:bg-gray-800 dark:text-blue-300"
      {...props}
    />
  ),
}

export const InlineMarkdown: React.FunctionComponent<{children: string}> = ({
  children,
}) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={inlineComponents as any}
    >
      {children}
    </ReactMarkdown>
  )
}

export default ReferenceMarkdown
