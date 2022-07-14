import * as React from 'react'
import {FunctionComponent} from 'react'
import {GetServerSideProps} from 'next'

const Playlist: FunctionComponent = () => null

export default Playlist

export const getServerSideProps: GetServerSideProps = async ({res, params}) => {
  const slug = params && (params.slug as string)
  return {
    redirect: {
      destination: `/courses/${slug}`,
      permanent: true,
    },
  }
}
