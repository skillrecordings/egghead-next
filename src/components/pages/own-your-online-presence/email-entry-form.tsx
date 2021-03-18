import * as React from 'react'
import {track} from 'utils/analytics'
import EmailForm from '../../cta/email/email-form'
import useCio from 'hooks/use-cio'
import {useViewer} from 'context/viewer-context'
import {requestSignInEmail} from 'utils/request-signin-email'

const OnlinePresenceEmailEntryForm: React.FC = () => {
  const {subscriber, cioIdentify} = useCio()
  const {viewer} = useViewer()

  const onSubmit = async (values: any) => {
    const {email} = values

    let id = subscriber?.id || viewer?.contact_id

    if (!id) {
      const {contact_id} = await requestSignInEmail(email)
      id = contact_id
    }

    cioIdentify(id, {
      email: subscriber?.email || viewer?.email || email,
      online_presence: 'yes',
    })
    track('submitted email cta', {
      location: 'online-presence',
      email,
    })
  }

  return (
    <div className="flex flex-col items-center p-16 my-16 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <EmailForm
        className="w-full mx-auto flex flex-col items-center justify-center text-white"
        label="Your email:"
        formClassName="max-w-xs md:max-w-sm mx-auto w-full"
        button="Show me how to zhuzh up my profile!"
        onSubmit={onSubmit}
      >
        <div className="text-center">
          <h1 className="text-black dark:text-white text-2xl tracking-tight font-light text-center max-w-xl mx-auto">
            Your online presence is your first impression.{' '}
            <strong className="font-bold">Make it count.</strong>
          </h1>
          <p className="font-normal text-blue-600 sm:text-lg text-base mt-4">
            Enter your email and we'll be in touch.
          </p>
        </div>
      </EmailForm>
    </div>
  )
}

export default OnlinePresenceEmailEntryForm
