import * as React from 'react'
import {track} from 'utils/analytics'
import EmailForm from '../../cta/email/email-form'
import useCio from '../../../hooks/use-cio'
import {useViewer} from '../../../context/viewer-context'
import useIdentityRequired from '../../../hooks/use-identity-required'

const EmailEntryForm: React.FC = () => {
  useIdentityRequired()
  const {subscriber, cioIdentify} = useCio()
  const {viewer} = useViewer()

  const onSubmit = (values: any) => {
    const {email} = values

    const id = subscriber?.id || viewer?.contact_id

    cioIdentify(id, {
      email: subscriber?.email || viewer?.email || email,
      career_chat: 'yes',
    })
    track('submitted email cta', {
      location: 'level-up',
      email,
    })
  }

  return (
    <div className="flex flex-col items-center p-16 my-16 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <EmailForm
        className="w-full mx-auto flex flex-col items-center justify-center text-white"
        label="Your email:"
        formClassName="max-w-xs md:max-w-sm mx-auto w-full"
        button="chat with egghead"
        onSubmit={onSubmit}
      >
        <div className="text-center">
          <h1 className="text-2xl leading-tighter tracking-tight font-light text-center max-w-xl mx-auto">
            Let's chat about <strong className="font-bold">your career</strong>.
          </h1>
          <p className="font-normal text-blue-600 sm:text-lg text-base mt-4">
            Enter your email and we'll be in touch.
          </p>
        </div>
      </EmailForm>
    </div>
  )
}

export default EmailEntryForm
