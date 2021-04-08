const SITE_CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID

const headers = SITE_CLIENT_ID
  ? {
      'X-SITE-CLIENT': SITE_CLIENT_ID,
    }
  : undefined

const config = {
  graphQLEndpoint: `${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/graphql`,
  searchResultCount: 21,
  searchUrlRoot: `/q`,
  headers,
}

export default config
