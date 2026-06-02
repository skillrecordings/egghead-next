import * as React from 'react'
import {GetServerSideProps} from 'next'
import {withSSRLogging} from '@/lib/logging'

const EOYSale2021Page: React.FC & {getLayout?: any} = () => null

export default EOYSale2021Page

export const getServerSideProps: GetServerSideProps = withSSRLogging(
  async () => {
    return {
      notFound: true,
    }
  },
)
