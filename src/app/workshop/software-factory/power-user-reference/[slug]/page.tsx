'use client'
import * as React from 'react'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {Providers} from '@/app/providers'
import Layout from '@/components/app/layout'
import '@/styles/index.css'
import ReferenceMarkdown from '@/components/workshop/software-factory/power-user-reference/reference-markdown'
import {
  REFERENCE_DOCS,
  SOURCE_EXCERPTS,
} from '@/components/workshop/software-factory/power-user-reference/content'

const REFERENCE_BASE = '/workshop/software-factory/power-user-reference'

export default function ReferenceDocPage({
  params,
}: {
  params: Promise<{slug: string}>
}) {
  const {slug} = React.use(params)
  const markdown = REFERENCE_DOCS[slug] ?? SOURCE_EXCERPTS[slug]

  if (!markdown) {
    notFound()
  }

  // "source md" opens the raw markdown for this doc on an egghead-styled page.
  const sourceMd = `/workshop/software-factory/power-user-reference/source/${slug}`

  return (
    <Providers>
      <div className="bg-gray-50 dark:bg-gray-900">
        <Layout>
          <main className="bg-white dark:bg-gray-900">
            <div className="mx-auto max-w-3xl px-5 py-12 sm:py-16">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Link
                  href={REFERENCE_BASE}
                  className="inline-flex items-center text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
                >
                  ← Agentic Software Factory Workshop Reference Packet
                </Link>
                <a
                  href={sourceMd}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 rounded-md border border-gray-300 px-2.5 py-1 font-mono text-xs font-medium text-gray-600 transition hover:border-blue-400 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500/60 dark:hover:text-blue-400"
                >
                  source md
                </a>
              </div>
              <article className="mt-6">
                <ReferenceMarkdown>{markdown}</ReferenceMarkdown>
              </article>
            </div>
          </main>
        </Layout>
      </div>
    </Providers>
  )
}
