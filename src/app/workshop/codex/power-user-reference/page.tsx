'use client'
import * as React from 'react'
import Link from 'next/link'
import {Providers} from '@/app/providers'
import Layout from '@/components/app/layout'
import '@/styles/index.css'
import ReferenceMarkdown, {
  InlineMarkdown,
} from '@/components/workshop/codex/power-user-reference/reference-markdown'
import InlineSources from '@/components/workshop/codex/power-user-reference/inline-sources'
import Keyframes from '@/components/workshop/codex/power-user-reference/keyframes'
import {
  HERO,
  REFERENCE_MATERIALS,
  SOURCE_EXCERPT_CARDS,
  INLINE_INTRO,
  WORKSHOP_MAP_MD,
  VERIFICATION_BOUNDARY,
} from '@/components/workshop/codex/power-user-reference/content'

const REFERENCE_BASE = '/workshop/codex/power-user-reference'

function NavCard({
  href,
  title,
  summary,
}: {
  href: string
  title: string
  summary: string
}) {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-gray-200 bg-white p-4 transition hover:border-blue-300 hover:shadow-smooth dark:border-gray-800 dark:bg-gray-950/40 dark:hover:border-blue-500/50"
    >
      <p className="font-bold text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
        {title}
      </p>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        <InlineMarkdown>{summary}</InlineMarkdown>
      </p>
    </Link>
  )
}

export default function PowerUserReferencePage() {
  return (
    <Providers>
      <div className="bg-gray-50 dark:bg-gray-900">
        <Layout>
          <main className="bg-white dark:bg-gray-900">
            {/* Header */}
            <header className="relative overflow-hidden border-b border-gray-200 dark:border-gray-800">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-500/[0.05]"
              />
              <div className="relative mx-auto max-w-3xl px-5 pb-12 pt-16 sm:pb-16 sm:pt-24">
                <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                  {HERO.title}
                </h1>
                <p className="mt-6 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                  {HERO.description}
                </p>
                <div className="mt-8 flex flex-wrap gap-2">
                  {HERO.pills.map((pill) => (
                    <span
                      key={pill}
                      className="rounded-full border border-gray-200 bg-white px-3 py-1 font-mono text-xs font-medium text-gray-600 dark:border-gray-800 dark:bg-gray-950/40 dark:text-gray-300"
                    >
                      {pill}
                    </span>
                  ))}
                </div>
              </div>
            </header>

            <div className="mx-auto max-w-3xl px-5">
              {/* Reference Materials */}
              <section className="py-12 sm:py-16">
                <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                  Reference Materials
                </h2>
                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {REFERENCE_MATERIALS.map((doc) => (
                    <NavCard
                      key={doc.slug}
                      href={`${REFERENCE_BASE}/${doc.slug}`}
                      title={doc.title}
                      summary={doc.summary}
                    />
                  ))}
                </div>
              </section>

              {/* Actual Source Excerpts */}
              <section className="border-t border-gray-200 py-12 dark:border-gray-800 sm:py-16">
                <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                  Actual Source Excerpts
                </h2>
                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {SOURCE_EXCERPT_CARDS.map((doc) => (
                    <NavCard
                      key={doc.slug}
                      href={`${REFERENCE_BASE}/${doc.slug}`}
                      title={doc.title}
                      summary={doc.summary}
                    />
                  ))}
                </div>
              </section>

              {/* Inline Implementation Code */}
              <section
                id="inline-source-code"
                className="scroll-mt-24 border-t border-gray-200 py-12 dark:border-gray-800 sm:py-16"
              >
                <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                  Inline Implementation Code
                </h2>
                <p className="mb-8 mt-3 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                  {INLINE_INTRO}
                </p>
                <InlineSources />
              </section>

              {/* Workshop Map */}
              <section className="border-t border-gray-200 py-12 dark:border-gray-800 sm:py-16">
                <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                  Workshop Map
                </h2>
                <ReferenceMarkdown>{WORKSHOP_MAP_MD}</ReferenceMarkdown>
              </section>

              {/* Keyframes */}
              <section
                id="keyframes"
                className="scroll-mt-24 border-t border-gray-200 py-12 dark:border-gray-800 sm:py-16"
              >
                <h2 className="mb-6 text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                  Keyframes
                </h2>
                <Keyframes />
              </section>

              {/* Verification Boundary */}
              <section className="border-t border-gray-200 py-12 dark:border-gray-800 sm:py-16">
                <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                  Verification Boundary
                </h2>
                <p className="mt-3 leading-relaxed text-gray-600 dark:text-gray-300">
                  <InlineMarkdown>{VERIFICATION_BOUNDARY}</InlineMarkdown>
                </p>
              </section>
            </div>
          </main>
        </Layout>
      </div>
    </Providers>
  )
}
