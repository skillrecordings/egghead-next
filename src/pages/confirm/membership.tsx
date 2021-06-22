import * as React from 'react'
import axios from 'axios'
import {useViewer} from 'context/viewer-context'
import {GetServerSideProps} from 'next'
import {useRouter} from 'next/router'
import ConfirmMembership from 'components/pages/confirm/membership/index'
import {track} from 'utils/analytics'

export const getServerSideProps: GetServerSideProps = async function ({req}) {
  return {
    props: {},
  }
}

const ConfirmMembershipPage: React.FC = () => {
  const {query} = useRouter()
  const [session, setSession] = React.useState<any>()
  const {viewer, refreshUser} = useViewer()

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
        <div className="p-5 dark:bg-gray-900 bg-gray-50 min-h-screen w-full flex flex-col items-center justify-start lg:pt-32 sm:pt-24 pt-16">
          <ConfirmMembership session={session} viewer={viewer} />
        </div>
      )}
    </>
  )
}

export default ConfirmMembershipPage
