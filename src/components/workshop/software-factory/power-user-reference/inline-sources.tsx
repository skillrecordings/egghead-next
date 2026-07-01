'use client'
import * as React from 'react'
import {InlineMarkdown} from './reference-markdown'
import HighlightedCode from './highlighted-code'
import {INLINE_SOURCES} from './content'

const SOURCE_MD_BASE = '/workshop/software-factory/power-user-reference/source'

export default function InlineSources() {
  return (
    <div className="space-y-8">
      {INLINE_SOURCES.map((source) => {
        const sourceMd = `${SOURCE_MD_BASE}/${source.slug}`
        return (
          <article
            key={source.slug}
            id={source.slug}
            className="scroll-mt-24 rounded-xl border border-gray-200 bg-white p-5 shadow-smooth dark:border-gray-800 dark:bg-gray-950/40 sm:p-6"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {source.title}
              </h3>
              <a
                href={sourceMd}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 rounded-md border border-gray-300 px-2.5 py-1 font-mono text-xs font-medium text-gray-600 transition hover:border-blue-400 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500/60 dark:hover:text-blue-400"
              >
                source md
              </a>
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              <InlineMarkdown>{source.pathMd}</InlineMarkdown>
            </p>
            <p className="mt-3 text-gray-700 dark:text-gray-300">
              <InlineMarkdown>{source.description}</InlineMarkdown>
            </p>

            <div className="mt-5 space-y-5">
              {source.fragments.map((fragment, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between gap-2 rounded-t-xl border border-b-0 border-gray-800 bg-[#172330] px-4 py-2 text-sm">
                    <span className="flex items-center gap-2 font-semibold text-gray-100">
                      <span className="font-mono text-xs uppercase tracking-wide text-blue-300">
                        {fragment.lang}
                      </span>
                      {fragment.caption}
                    </span>
                    <a
                      href={sourceMd}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 font-mono text-xs text-gray-300 underline-offset-2 hover:text-blue-300 hover:underline"
                    >
                      source md
                    </a>
                  </div>
                  <pre className="overflow-x-auto rounded-b-xl border border-gray-800 bg-gray-1000">
                    <HighlightedCode
                      code={fragment.code}
                      language={fragment.lang}
                      className="font-mono text-[0.8rem] leading-relaxed"
                    />
                  </pre>
                </div>
              ))}
            </div>
          </article>
        )
      })}
    </div>
  )
}
