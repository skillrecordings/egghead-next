import {Suspense} from 'react'
import BlockedComponent from './_components/blocked'

const Blocked = () => {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <BlockedComponent />
      </Suspense>
    </>
  )
}

export default Blocked
