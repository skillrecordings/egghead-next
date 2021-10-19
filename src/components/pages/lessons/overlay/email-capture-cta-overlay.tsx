import React, {FunctionComponent} from 'react'
import LoginForm from 'pages/login'
import {track} from 'utils/analytics'
import {LessonResource} from 'types'

type CreateAccountCTAProps = {
  lesson: LessonResource
  technology: string
}

const EmailCaptureCtaOverlay: FunctionComponent<CreateAccountCTAProps> = ({
  lesson,
  technology,
}) => {
  const trackEmailCapture = (email: string) => {
    const {slug} = lesson
    track('submitted email - blocked lesson', {
      lesson: slug,
      technology,
      email,
    })
  }

  const {collection} = lesson

  return (
    <section className="flex flex-col items-center p-4">
      <LoginForm
        image={<></>}
        className="w-full mx-auto flex flex-col items-center justify-center text-white"
        label="Email address"
        formClassName="max-w-xs md:max-w-sm mx-auto w-full"
        button="FInish Watching this Course"
        track={trackEmailCapture}
      >
        <div className="text-center">
          {collection && (
            <h1 className="text-xl md:text-2xl lg:text-xl xl:text-3xl leading-tighter tracking-tight font-light text-center max-w-xl mx-auto">
              Ready to finish{' '}
              <strong className="font-bold">{collection.title}</strong>?
            </h1>
          )}

          <h2 className="pt-4 text-lg leading-tighter tracking-tight font-light text-center max-w-xl mx-auto">
            This lesson (and hundreds more!) by awesome instructors like <br />
            {lesson.instructor.full_name} are{' '}
            <strong className="font-bold">free to watch</strong> with your
            egghead account.
          </h2>
          <p className="font-normal text-blue-300 text-base sm:text-md lg:text-base xl:text-md mt-4">
            Enter your email to unlock this free lesson.
          </p>
        </div>
      </LoginForm>
    </section>
  )
}

export default EmailCaptureCtaOverlay
