import * as React from 'react'
import {trpc} from '@/app/_trpc/client'

const Blank = () => {
  const {data} = trpc.topics.top.useQuery({topic: 'react'})
  return <div>this page is intentionally blank</div>
}

Blank.getLayout = (Page: any, pageProps: any) => {
  return <Page {...pageProps} />
}

export default Blank
