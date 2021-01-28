import * as React from 'react'
import {FunctionComponent} from 'react'
import axios from 'utils/configured-axios'
import * as Yup from 'yup'
import isEmpty from 'lodash/isEmpty'
import {motion} from 'framer-motion'
import {useInterval, useMedia} from 'react-use'
import {Formik, Form, Field, ErrorMessage} from 'formik'
import {DialogOverlay, DialogContent} from '@reach/dialog'
import {track} from 'utils/analytics'

import Sob from './images/Sob'
import Hearteyes from './images/Hearteyes'
import NeutralFace from './images/NeutralFace'
import useCio from 'hooks/use-cio'

const feedbackSchema = Yup.object().shape({
  emoji: Yup.string(),
  feedback: Yup.string().when('emoji', {
    is: undefined,
    then: Yup.string()
      .required(
        `Can't stay empty. Please either pick an emoji or write some feedback. 🙏`,
      )
      .min(4, `Too short. Tell us more! 😊`),
  }),
})

const EMOJIS = new Map([
  [<Hearteyes />, 'heart_eyes'],
  [<NeutralFace />, 'neutral_face'],
  [<Sob />, 'sob'],
])

type FeedbackProps = {
  className?: string
  children: React.ReactChild
  user: any
}

const Feedback: FunctionComponent<FeedbackProps> = ({
  className,
  children,
  user,
}) => {
  const [showDialog, setShowDialog] = React.useState(false)
  const [state, setState] = React.useState<{
    loading: boolean
    success: boolean
    errorMessage: any
  }>({
    loading: false,
    success: false,
    errorMessage: null,
  })

  const {subscriber, cioIdentify} = useCio()

  const openDialog = () => {
    setShowDialog(true)
    setState({success: false, loading: false, errorMessage: null})
  }
  const closeDialog = () => {
    setShowDialog(false)
  }

  useInterval(() => closeDialog(), state.success ? 2000 : null)

  function handleSubmit(values: any, actions: any) {
    const slackEmojiCode = isEmpty(values.emoji)
      ? ':unicorn_face:'
      : `:${values.emoji}:`

    setState({loading: true, success: false, errorMessage: null})
    actions.setSubmitting(true)
    axios
      .post('/api/v1/feedback', {
        feedback: {
          url: window.location.toString(),
          site: `egghead-next`,
          comment: values.feedback,
          user: user,
          emotion: slackEmojiCode,
        },
      })
      .then(() => {
        track(`sent feedback`, {
          comment: values.feedback,
          emotion: slackEmojiCode,
          url: window.location.toString(),
        })
        if (subscriber) {
          const learner_score =
            Number(subscriber.attributes?.learner_score) || 0
          cioIdentify(subscriber.id, {
            learner_score: learner_score + 100,
          })
        }
        actions.setSubmitting(false)
        actions.resetForm()
        setState({
          success: true,
          loading: false,
          errorMessage: null,
        })
      })
      .catch((err) => {
        actions.setSubmitting(false)
        setState({success: false, errorMessage: err.message, loading: false})
      })
  }

  let EMOJI_CODES: any = null

  function getEmoji(code: any) {
    if (code === null) return code
    if (EMOJI_CODES === null) {
      EMOJI_CODES = new Map([...(EMOJIS as any)].map(([k, v]) => [v, k]))
    }
    return EMOJI_CODES.get(code)
  }

  const Emoji: FunctionComponent<{code: any}> = ({code}) => getEmoji(code)

  return (
    <>
      <button className={className} onClick={openDialog} type="button">
        {children}
      </button>
      <DialogOverlay
        isOpen={showDialog}
        onDismiss={closeDialog}
        css={{
          background: 'rgba(14, 24, 42, 0.5)',
          backdropFilter: 'blur(2px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          zIndex: 40,
        }}
      >
        <DialogContent
          aria-label="write us feedback"
          className={`bg-white dark:bg-gray-900 shadow-lg rounded-lg max-w-screen-sm text-text border dark:border-gray-800 relative`}
          css={{
            width: '100%',
            zIndex: 50,
          }}
        >
          <div className="w-full flex flex-col">
            {state.success ? (
              <motion.div
                animate={{opacity: [0, 1]}}
                initial={{opacity: 0}}
                className="relative flex flex-col items-center justify-center"
              >
                <div className="text-white w-16 h-16 bg-green-500 flex items-center justify-center rounded-full p-2">
                  {/* prettier-ignore */}
                  <svg width="32" height="32" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><g fill="none" ><path fillRule="evenodd" clipRule="evenodd" d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0z" fill="currentColor"/></g></svg>
                </div>
                <h4 className="text-lg text-center mt-4 font-semibold">
                  Thank you!
                </h4>
              </motion.div>
            ) : (
              <>
                <h4 className="text-xl text-center mt-4 mb-3 font-semibold">
                  Tell us how you feel about it
                </h4>
                <Formik
                  initialValues={{feedback: '', emoji: ''}}
                  enableReinitialize={true}
                  validationSchema={feedbackSchema}
                  validateOnBlur={false}
                  onSubmit={(values, actions) => handleSubmit(values, actions)}
                >
                  {({errors, isValid, touched, isSubmitting, values}) => {
                    return (
                      <Form>
                        <label
                          htmlFor="feedback"
                          className="sr-only text-sm font-medium leading-5 text-gray-700"
                        >
                          Your feedback
                        </label>
                        <Field
                          disabled={isSubmitting || state.loading}
                          className="mt-4 form-input bg-background border border-gray-200 focus:shadow-outline-blue dark:text-gray-900 text-text w-full h-40"
                          component="textarea"
                          name="feedback"
                          id="feedback"
                          placeholder="Type your feedback here..."
                          aria-label="Enter your feedback"
                        />
                        <div className="w-full flex flex-col items-center justify-between">
                          <div className="flex items-center justify-center mb-3">
                            <div id="emoji" className="mr-3">
                              Pick an emoji:
                            </div>
                            <div
                              role="group"
                              aria-labelledby="emoji"
                              className="flex items-center"
                            >
                              {Array.from(EMOJIS.values()).map((emoji) => {
                                return (
                                  <label
                                    className="flex items-center my-2"
                                    key={emoji}
                                  >
                                    <Field
                                      disabled={isSubmitting || state.loading}
                                      type="radio"
                                      name="emoji"
                                      value={emoji}
                                      className="form-radio hidden"
                                    />
                                    <div
                                      className={`p-3 transform hover:scale-110 flex items-center border border-transparent justify-center cursor-pointer rounded-full  transition-all ease-in-out duration-100 ${
                                        values.emoji === emoji
                                          ? 'bg-blue-100 border border-blue-200'
                                          : 'hover:border-blue-200'
                                      }`}
                                    >
                                      <Emoji code={emoji} />
                                    </div>
                                  </label>
                                )
                              })}
                            </div>
                          </div>
                          <ErrorMessage
                            name="feedback"
                            render={(msg) => (
                              <div className="flex items-start">
                                <div className="mt-3 px-3 pb-4 flex items-center">
                                  {msg}
                                  {state.errorMessage &&
                                    ` & ${state.errorMessage}`}
                                </div>
                              </div>
                            )}
                          />
                          <button
                            className={`${
                              errors.feedback && touched.feedback
                                ? 'cursor-not-allowed'
                                : ''
                            } mt-3 block font-semibold px-5 py-3 text-base hover:scale-105 transform bg-blue-600 hover:bg-blue-700 transition-all ease-in-out duration-200 text-white rounded-md leading-6`}
                            disabled={!isValid || isSubmitting || state.loading}
                            type="submit"
                          >
                            {isSubmitting || state.loading ? (
                              <div className="flex items-center justify-center space-x-2">
                                <svg
                                  className="text-blue-100"
                                  xmlns="http://www.w3.org/2000/svg"
                                  width={24}
                                  height={24}
                                  viewBox="0 0 24 24"
                                >
                                  <motion.g
                                    animate={{rotateZ: [0, 360]}}
                                    transition={{repeat: Infinity}}
                                    fill="currentColor"
                                  >
                                    <path fill="none" d="M0 0h24v24H0z"></path>
                                    <path d="M12 3a9 9 0 0 1 9 9h-2a7 7 0 0 0-7-7V3z"></path>
                                  </motion.g>
                                </svg>
                                <span>Sending...</span>
                              </div>
                            ) : (
                              'Send feedback'
                            )}
                          </button>
                        </div>
                      </Form>
                    )
                  }}
                </Formik>
              </>
            )}
          </div>
          <div className="block absolute top-0 right-0 pt-2 pr-2">
            <button
              onClick={closeDialog}
              type="button"
              className={`text-gray-600 hover:bg-blue-100 hover:text-blue-600 p-2 focus:shadow-outline-blue transition-all rounded-full transform hover:scale-110 ease-in-out duration-200`}
              aria-label="Close"
            >
              <span className="sr-only">close feedback dialog</span>
              {/* prettier-ignore */}
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            {state.success && (
              <svg
                className="w-12 text-blue-600 absolute pointer-events-none top-2 right-0"
                viewBox="-5 -5 60 60"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* prettier-ignore */}
                <motion.path d="M 0, 20 a 20, 20 0 1,0 40,0 a 20, 20 0 1,0 -40,0" fill="none" stroke="currentColor" strokeWidth="3px" strokeDasharray="0 1"
                      animate={{
                        pathLength: [0, 1],
                        opacity: [0.2, 1],
                      }}
                      transition={{
                        duration: 1.9,
                        type: 'spring',
                      }}
                    />
              </svg>
            )}
          </div>
        </DialogContent>
      </DialogOverlay>
    </>
  )
}

export default Feedback
