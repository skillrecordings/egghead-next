import * as React from 'react'

import {useViewer} from 'context/viewer-context'

function Logout() {
  const {logout} = useViewer()

  React.useEffect(() => {
    logout()
  }, [])

  return null
}

export default Logout
