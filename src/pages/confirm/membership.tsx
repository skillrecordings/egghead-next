import * as React from 'react'
import {useRouter} from 'next/router'
import axios from 'axios'
import ConfirmMembership from 'components/pages/confirm/membership/index'
import usePurchaseAndPlay from 'hooks/use-purchase-and-play'
import {track} from 'utils/analytics'
import {useViewer} from 'context/viewer-context'

const ConfirmMembershipPage: React.FC = () => {
  const {query} = useRouter()
  const {viewer, refreshUser} = useViewer()

  const [alreadyAuthenticated, currentState] = usePurchaseAndPlay()

  const [session, setSession] = React.useState<any>()

  React.useEffect(() => {
    const {session_id} = query
    if (session_id) {
      axios
        .get(`/api/stripe/checkout/session?session_id=${session_id}`)
        .then(({data}) => {
          setSession(data)
          track('checkout: membership confirmed', {
            session_id,
          })
          if (viewer) refreshUser()
        })
    }
  }, [])

  if (!session) return null

  return (
    <>
      {session.status === 'paid' && (
        <div className="-m-5 dark:bg-gray-900 bg-gray-50 min-h-screen">
          <div className="max-w-screen-sm mx-auto p-5 w-full flex flex-col items-center justify-start sm:py-16 py-8">
            <ConfirmMembership
              session={session}
              alreadyAuthenticated={alreadyAuthenticated}
              currentState={currentState}
            />
          </div>
        </div>
      )}
    </>
  )
}

export default ConfirmMembershipPage
