import * as React from 'react'
import Redirect from './redirect'
import {trpc} from 'trpc/trpc.client'

const Blank = () => {
  return <div>this page is intentionally blank</div>
}

Blank.getLayout = (Page: any, pageProps: any) => {
  const {data} = trpc.topics.top.useQuery({topic: 'react'})
  console.log(data)
  return <Page {...pageProps} />
}

export default Blank
