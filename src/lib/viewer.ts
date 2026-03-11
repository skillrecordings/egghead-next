import {getGraphQLClient} from '../utils/configured-graphql-client'
import gql from 'graphql-tag'
import {logEvent} from '@/utils/structured-log'

export async function loadCurrentViewerRoles(token?: string) {
  if (!token) {
    return []
  }

  const query = gql`
    query viewer {
      viewer {
        roles
      }
    }
  `
  const graphQLClient = getGraphQLClient(token, {
    allowStoredTokenFallback: false,
  })

  try {
    const {viewer} = await graphQLClient.request(query)

    return viewer ? viewer.roles : []
  } catch (error: any) {
    const status = error?.response?.status

    if (status === 401 || status === 403) {
      if (typeof window === 'undefined') {
        logEvent('warn', 'auth.viewer_roles.failed_soft', {
          degraded_to_anon: true,
          has_token: true,
          status,
        })
      }

      return []
    }

    throw error
  }
}
