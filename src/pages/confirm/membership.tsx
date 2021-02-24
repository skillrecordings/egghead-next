import * as React from 'react'
import axios from 'axios'
import {useViewer} from 'context/viewer-context'
import {GetServerSideProps} from 'next'
import {useRouter} from 'next/router'
import ConfirmMembership from 'components/pages/confirm/membership/index'

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
          if (viewer) refreshUser()
        })
    }
  }, [])

  if (!session) return null

  return (
    <>
      {session.status === 'paid' && (
        <ConfirmMembership session={session} viewer={viewer} />
      )}
    </>
  )
}

export default ConfirmMembershipPage
