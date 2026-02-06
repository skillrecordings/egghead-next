import * as React from 'react'
import {FunctionComponent} from 'react'
import {GetServerSideProps} from 'next'
import {withSSRLogging} from '@/lib/logging'

const Playlist: FunctionComponent<React.PropsWithChildren<unknown>> = () => null

export default Playlist

export const getServerSideProps: GetServerSideProps = withSSRLogging(
  async ({res, params}) => {
    const slug = params && (params.slug as string)
    return {
      redirect: {
        destination: `/courses/${slug}`,
        permanent: true,
      },
    }
  },
)
