import * as React from 'react'

import {useViewer} from 'context/viewer-context'
import {useRouter} from 'next/router'

function Logout() {
  const router = useRouter()
  const {logout} = useViewer()

  React.useEffect(() => {
    const redirectToIndex = () => {
      if (typeof window !== 'undefined') {
        router.replace('/')
      }
    }

    logout(redirectToIndex)
  }, [])

  return null
}

export default Logout
