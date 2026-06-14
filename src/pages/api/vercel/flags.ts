import type {NextApiRequest, NextApiResponse} from 'next'
import {verifyAccess, version} from 'flags'
import {getMigrationFlagProviderData} from '@/lib/migration-flags'

export default async function flagsDiscovery(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).end()
  }

  let access = false
  try {
    access = await verifyAccess(req.headers.authorization)
  } catch {
    access = false
  }

  if (!access) return res.status(401).json(null)

  const providerData = await getMigrationFlagProviderData()
  res.setHeader('x-flags-sdk-version', version)

  return res.status(200).json(providerData)
}
