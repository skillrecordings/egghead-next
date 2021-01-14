import * as React from 'react'
import {useViewer} from 'context/viewer-context'
import useLastResource from '../hooks/use-last-resource'

function Logout() {
  const {logout} = useViewer()
  const {clearResource} = useLastResource()

  React.useEffect(() => {
    clearResource()
    logout()
  }, [])

  return null
}

Logout.getLayout = (Page: any) => {
  return <Page />
}

export default Logout
