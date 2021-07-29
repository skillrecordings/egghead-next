import React, {FunctionComponent} from 'react'
import LoginForm from 'pages/login'
import {track} from 'utils/analytics'

type CreateAccountCTAProps = {
  lesson: string
  technology: string
}

const CreateAccountCTA: FunctionComponent<CreateAccountCTAProps> = ({
  lesson,
  technology,
}) => {
  const trackEmailCapture = (email: string) => {
    track('submitted email - blocked lesson', {
      lesson,
      technology,
      email,
    })
  }

  return (
    <div className="flex flex-col items-center p-4">
      <LoginForm
        image={<></>}
        className="w-full mx-auto flex flex-col items-center justify-center text-white"
        label="Your email:"
        formClassName="max-w-xs md:max-w-sm mx-auto w-full"
        button="Create account or login to view"
        track={trackEmailCapture}
      >
        <div className="text-center">
          <h2 className="text-xl md:text-2xl lg:text-xl xl:text-3xl leading-tighter tracking-tight font-light text-center max-w-xl mx-auto">
            This lesson is <strong className="font-bold">free to watch</strong>{' '}
            with an egghead account.
          </h2>
          <p className="font-normal text-blue-300 text-base sm:text-lg lg:text-base xl:text-lg mt-4">
            Enter your email to unlock this free lesson.
          </p>
        </div>
      </LoginForm>
    </div>
  )
}

export default CreateAccountCTA
