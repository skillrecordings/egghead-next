import * as React from 'react'
import Redirect from './redirect'

const Blank = () => {
  return <div>this page is intentionally blank</div>
}

Blank.getLayout = (Page: any, pageProps: any) => {
  return <Page {...pageProps} />
}

export default Blank
