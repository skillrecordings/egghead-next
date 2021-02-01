import axios from 'axios'
import LastResource from 'components/last-resource'
import {useViewer} from 'context/viewer-context'
import {GetServerSideProps} from 'next'
import {useRouter} from 'next/router'
import * as React from 'react'

export const getServerSideProps: GetServerSideProps = async function ({req}) {
  return {
    props: {},
  }
}

const ConfirmMembership: React.FunctionComponent = () => {
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
    <div>
      {session.status === 'paid' && (
        <div className="sm:py-40 py-32 px-8 max-w-screen-md mx-auto min-h-screen flex flex-col items-center justify-center">
          <div className="prose dark:prose-dark px-5 hide-toc">
            {viewer ? (
              <h2>Thank you for joining egghead!</h2>
            ) : (
              <h2>
                Thank you for joining egghead! Please check your inbox to
                confirm your email.
              </h2>
            )}
            {viewer ? (
              <div>
                <p>
                  We've charged your credit card{' '}
                  <strong>${session.amount} for an egghead membership</strong>{' '}
                  and sent a receipt to <strong>{session.email}</strong>. If you
                  have any issues, please email support{' '}
                  <strong>
                    <a href="mailto:support@egghead.io">support@egghead.io</a>
                  </strong>{' '}
                  and we will help you as soon as possible.
                </p>
                <LastResource
                  className="hover:underline font-semibold text-blue-600"
                  location="membership welcome"
                >
                  <strong>Continue learning:</strong>
                </LastResource>
              </div>
            ) : (
              <div>
                <p>
                  We've charged your credit card{' '}
                  <strong>${session.amount} for an egghead membership</strong>{' '}
                  and sent an email to <strong>{session.email}</strong> so you
                  can log in and access your membership. If you have any issues,
                  please email support{' '}
                  <strong>
                    <a href="mailto:support@egghead.io">support@egghead.io</a>
                  </strong>{' '}
                  and we will help you as soon as possible.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ConfirmMembership
