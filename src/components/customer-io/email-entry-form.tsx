import * as React from 'react'
import {track} from 'utils/analytics'
import EmailForm from '../cta/email/email-form'
import useCio from 'hooks/use-cio'
import {useViewer} from 'context/viewer-context'
import {requestContactGuid} from 'utils/request-contact-guid'

const EmailEntryForm: React.FC<React.PropsWithChildren<any>> = ({
  campaignAttribute,
  siteLocation,
  title,
  subTitle,
  buttonText = 'submit',
}) => {
  const {subscriber, cioIdentify} = useCio()
  const {viewer} = useViewer()

  const onSubmit = async (values: any) => {
    const {email} = values

    let id = subscriber?.id || viewer?.contact_id

    if (!id) {
      const {contact_id} = await requestContactGuid(email)
      id = contact_id
    }

    await cioIdentify(id, {
      email: subscriber?.email || viewer?.email || email,
      [campaignAttribute]: 'yes',
    })

    track('submitted email cta', {
      location: siteLocation,
      email,
    })
  }

  return (
    <div className="flex flex-col items-center p-16 my-16 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <EmailForm
        className="w-full mx-auto flex flex-col items-center justify-center text-white"
        label="Email address"
        formClassName="max-w-xs md:max-w-sm mx-auto w-full"
        button={buttonText}
        onSubmit={onSubmit}
      >
        <div className="text-center">
          <h1 className="text-black dark:text-white text-2xl leading-tighter tracking-tight font-light text-center max-w-xl mx-auto">
            {title}
          </h1>
          <p className="font-normal text-blue-600 sm:text-lg text-base mt-4">
            {subTitle}
          </p>
        </div>
      </EmailForm>
    </div>
  )
}

export default EmailEntryForm
