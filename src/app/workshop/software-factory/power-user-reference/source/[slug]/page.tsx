'use client'
import * as React from 'react'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {Providers} from '@/app/providers'
import Layout from '@/components/app/layout'
import '@/styles/index.css'
import {
  REFERENCE_DOCS,
  SOURCE_EXCERPTS,
} from '@/components/workshop/software-factory/power-user-reference/content'

const REFERENCE_BASE = '/workshop/software-factory/power-user-reference'

export default function ReferenceSourcePage({
  params,
}: {
  params: Promise<{slug: string}>
}) {
  const {slug} = React.use(params)
  const isSourceExcerpt = slug in SOURCE_EXCERPTS
  const markdown = REFERENCE_DOCS[slug] ?? SOURCE_EXCERPTS[slug]

  if (!markdown) {
    notFound()
  }

  const fileName = isSourceExcerpt ? `source-excerpts/${slug}.md` : `${slug}.md`

  return (
    <Providers>
      <div className="bg-gray-50 dark:bg-gray-900">
        <Layout>
          <main className="bg-white dark:bg-gray-900">
            <div className="mx-auto max-w-4xl px-5 py-12 sm:py-16">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Link
                  href={`${REFERENCE_BASE}/${slug}`}
                  className="inline-flex items-center text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
                >
                  ← Back to rendered page
                </Link>
                <Link
                  href={REFERENCE_BASE}
                  className="text-sm font-medium text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                >
                  Reference Packet
                </Link>
              </div>

              <div className="mt-6 flex items-center gap-2">
                <span className="rounded-md bg-blue-600 px-2 py-0.5 font-mono text-xs font-bold uppercase tracking-wide text-white">
                  source md
                </span>
                <h1 className="font-mono text-lg font-bold text-gray-900 dark:text-white">
                  {fileName}
                </h1>
              </div>

              <pre className="mt-5 overflow-x-auto rounded-xl border border-gray-800 bg-gray-1000 p-5 text-gray-100 shadow-smooth">
                <code className="whitespace-pre font-mono text-[0.8rem] leading-relaxed text-gray-100">
                  {markdown}
                </code>
              </pre>
            </div>
          </main>
        </Layout>
      </div>
    </Providers>
  )
}
