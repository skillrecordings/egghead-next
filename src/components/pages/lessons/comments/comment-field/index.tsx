import React, {FunctionComponent} from 'react'
import {Formik} from 'formik'
import Spinner from '@/components/spinner'
import {useVideo} from '@skillrecordings/player'
import Dialog from '@/components/dialog'
import ReactMarkdown from 'react-markdown'
import {disable} from 'mixpanel-browser'

type CommentFieldProps = {
  onSubmit?: any
  disabled?: boolean
}

const CommentField: FunctionComponent<
  React.PropsWithChildren<CommentFieldProps>
> = ({onSubmit = () => {}, disabled}) => {
  const [isSubmitted, setIsSubmitted] = React.useState(false)
  const [isError, setIsError] = React.useState(false)
  const videoService = useVideo()
  const toggleShortcutsEnabled = () => {
    videoService.send({
      type: 'TOGGLE_SHORTCUTS_ENABLED',
      source: 'CommentField',
    })
  }

  return (
    <div className="dark:text-white">
      {!isError && (
        <Formik
          initialValues={{newCommentText: ''}}
          onSubmit={({newCommentText}, {resetForm}) => {
            setIsSubmitted(true)
            onSubmit(newCommentText)
            resetForm()
          }}
        >
          {(props) => {
            const {
              values,
              isSubmitting,
              handleChange,
              handleBlur,
              handleSubmit,
            } = props
            return (
              <div className="relative max-w-2xl mx-auto">
                <form
                  onSubmit={handleSubmit}
                  className="w-full space-y-2"
                  onFocusCapture={toggleShortcutsEnabled}
                  onBlur={toggleShortcutsEnabled}
                >
                  <textarea
                    id="newCommentText"
                    value={values.newCommentText}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Your comment..."
                    disabled={disabled || isSubmitting}
                    className={`min-h-[120px] form-textarea p-3 dark:text-white dark:bg-gray-800 text-gray-900 placeholder-gray-400 focus:ring-indigo-500 focus:border-blue-500 block w-full border-gray-300 dark:border-gray-700 rounded-md resize-none ${
                      isSubmitting ? 'opacity-60' : ''
                    }`}
                    required
                  />
                  <div className="flex justify-between items-center">
                    <button
                      type="submit"
                      disabled={disabled || isSubmitting}
                      className={`w-32 flex items-center justify-center transition-all text-sm duration-150 ease-in-out bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-2 px-4 rounded-md ${
                        isSubmitting
                          ? 'cursor-not-allowed opacity-60'
                          : 'hover:scale-105 hover:shadow-xl'
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          Sending <Spinner size={5} className="ml-2" />
                        </>
                      ) : (
                        'Send'
                      )}
                    </button>
                  </div>
                </form>
                <div className="absolute bottom-1 right-0 flex gap-1 items-center">
                  <span className="text-sm text-gray-400 ">
                    Markdown supported.
                  </span>
                  <Dialog
                    buttonText="&#x2139;"
                    ariaLabel="open comment guidelines"
                    title="Comment Guidelines"
                    buttonStyles=""
                    disabled={disabled}
                  >
                    <div className="prose dark:prose-dark dark:prose-a:text-blue-300 prose-a:text-blue-500 max-w-none mt-1">
                      <ReactMarkdown
                        children={`Member comments are a way for members to communicate, interact, and ask questions about a lesson.

The instructor or someone from the community might respond to your question Here are a few basic guidelines to commenting on egghead.io 

**Be on-Topic**

Comments are for discussing a lesson. If you're having a general issue with the website functionality, please contact us at support@egghead.io.

**Avoid meta-discussion**
- This was great!
- This was horrible!
- I didn't like this because it didn't match my skill level.
- +1
It will likely be deleted as spam.

**Code Problems?**

Should be accompanied by code! Codesandbox or Stackblitz provide a way to share code and discuss it in context

**Details and Context**

Vague question? Vague answer. Any details and context you can provide will lure more interesting answers!`}
                      />
                    </div>
                  </Dialog>
                </div>
              </div>
            )
          }}
        </Formik>
      )}
      {isError && <div className="text-red-500">error</div>}
    </div>
  )
}

export default CommentField
