import type {GetServerSideProps, InferGetServerSidePropsType} from 'next'
import {normalizeMigrationFlagBackend} from '@/lib/migration-flags-core'
import {resolveMigrationFlags} from '@/lib/migration-flags'

export const getServerSideProps = (async (ctx) => {
  const backend = normalizeMigrationFlagBackend(ctx.query.backend)
  const result = await resolveMigrationFlags(ctx.req, {
    backend,
    logContext: {route: 'pages.migration-flags-proof'},
  })

  ctx.res.setHeader('X-Robots-Tag', 'noindex, nofollow')

  return {
    props: {
      result,
    },
  }
}) satisfies GetServerSideProps

export default function MigrationFlagsProofPage({
  result,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <main className="mx-auto max-w-3xl p-8 font-sans">
      <h1 className="text-2xl font-semibold">Migration Flags Proof</h1>
      <pre className="mt-6 overflow-auto rounded bg-gray-100 p-4 text-sm">
        {JSON.stringify(result, null, 2)}
      </pre>
    </main>
  )
}
