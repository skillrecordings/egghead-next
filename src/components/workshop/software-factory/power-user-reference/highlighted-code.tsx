'use client'
import * as React from 'react'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'

// highlight.js has no "zsh" grammar; map the packet's languages to grammars it
// ships, falling back to auto-detection if a language is unknown.
const LANG_MAP: Record<string, string> = {
  zsh: 'bash',
  sh: 'bash',
  shell: 'bash',
  bash: 'bash',
  clojure: 'clojure',
  edn: 'clojure',
  text: 'plaintext',
  plaintext: 'plaintext',
}

export default function HighlightedCode({
  code,
  language,
  className = '',
}: {
  code: string
  language?: string
  className?: string
}) {
  const html = React.useMemo(() => {
    const grammar = language ? LANG_MAP[language.toLowerCase()] : undefined
    try {
      if (grammar && grammar !== 'plaintext') {
        return hljs.highlight(code, {language: grammar}).value
      }
      if (!grammar) {
        return hljs.highlightAuto(code).value
      }
    } catch {
      // fall through to escaped plain text
    }
    // Escape when we are not highlighting so raw markup never renders.
    return code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
  }, [code, language])

  return (
    <code
      className={`hljs ${className}`}
      dangerouslySetInnerHTML={{__html: html}}
    />
  )
}
