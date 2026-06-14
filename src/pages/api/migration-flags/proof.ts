import type {NextApiRequest, NextApiResponse} from 'next'
import {withPagesApiLogging} from '@/lib/logging'
import {normalizeMigrationFlagBackend} from '@/lib/migration-flags-core'
import {resolveMigrationFlags} from '@/lib/migration-flags'

async function migrationFlagsProof(req: NextApiRequest, res: NextApiResponse) {
  const backend = normalizeMigrationFlagBackend(req.query.backend)
  const result = await resolveMigrationFlags(req, {
    backend,
    logContext: {route: 'api.migration-flags.proof'},
  })

  res.status(200).json({
    ok: true,
    ...result,
  })
}

export default withPagesApiLogging(migrationFlagsProof)
