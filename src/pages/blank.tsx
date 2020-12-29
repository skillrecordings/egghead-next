import * as React from 'react'

const Blank = () => {
  return <div>this page is intentionally blank</div>
}

Blank.getLayout = (Page: any) => {
  return <Page />
}

export default Blank
