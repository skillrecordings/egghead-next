import * as React from 'react'
import {FunctionComponent} from 'react'
import {GetServerSideProps} from 'next'
import {withSSRLogging} from '@/lib/logging'
import {canonicalizeInternalQueryParams} from '@/server/nxtp-query'

const Playlist: FunctionComponent<React.PropsWithChildren<unknown>> = () => null

export default Playlist

export const getServerSideProps: GetServerSideProps = withSSRLogging(
  async ({res, params, query}) => {
    const slug = params && (params.slug as string)
    const encodedSlug = encodeURIComponent(slug || '')
    const canonicalRedirect = canonicalizeInternalQueryParams({
      pathname: `/playlists/${encodedSlug}`,
      query,
      omitKeys: ['slug'],
    })

    if (canonicalRedirect) {
      return {
        redirect: {
          destination: canonicalRedirect.destination,
          permanent: false,
        },
      }
    }

    return {
      redirect: {
        destination: `/courses/${encodedSlug}`,
        permanent: true,
      },
    }
  },
)
