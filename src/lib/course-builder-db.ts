import {ConnectionOptions} from 'mysql2/promise'

function parseSslParam(sslParam: string) {
  const attempts = [
    sslParam,
    decodeURIComponent(sslParam),
    sslParam.replace(/\\"/g, '"'),
    decodeURIComponent(sslParam).replace(/\\"/g, '"'),
  ]

  for (const candidate of attempts) {
    try {
      return JSON.parse(candidate)
    } catch {}
  }

  throw new SyntaxError(`Invalid ssl query parameter: ${sslParam}`)
}

function normalizeCourseBuilderUri(uri: string) {
  const url = new URL(uri)
  const sslParam = url.searchParams.get('ssl')

  if (sslParam) {
    url.searchParams.delete('ssl')
  }

  const normalizedUri = url.toString()
  const ssl = sslParam
    ? parseSslParam(sslParam)
    : url.hostname.endsWith('psdb.cloud')
    ? {rejectUnauthorized: true}
    : undefined

  return {
    uri: normalizedUri,
    ssl,
  }
}

export function getCourseBuilderConnectionOptions(): ConnectionOptions {
  const uri = process.env.COURSE_BUILDER_DATABASE_URL

  if (!uri) {
    throw new Error(
      'COURSE_BUILDER_DATABASE_URL environment variable is not set',
    )
  }

  return normalizeCourseBuilderUri(uri)
}
