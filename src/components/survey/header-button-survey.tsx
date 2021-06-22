import * as React from 'react'
import useCio from 'hooks/use-cio'
import Link from 'next/link'
import {Card} from 'components/card'
import {SurveyQuestion} from 'data/sorting-hat'
import Markdown from 'react-markdown'
import {sortingHatReducer, SortingHatState} from './sorting-hat-reducer'
import {HeaderButtonShapedLink} from 'components/app/header/header-button-shaped-link'

const QuestionHeading: React.FunctionComponent<{question: SurveyQuestion}> = ({
  question,
}) => {
  return (
    <>
      <h2 className="text-xl mb-3 font-bold dark:text-gray-100 text-gray-700">
        <Markdown>{question.heading}</Markdown>
      </h2>
      <h3 className="text-lg mb-4">
        <Markdown>{question.subheading}</Markdown>
      </h3>
    </>
  )
}

type HeaderButtonProps = {
  initialState: SortingHatState
  subscriberRequired?: boolean
  className?: string
  alternative?: any
  variant?: string
}

const HeaderButtonCTA: React.FC<HeaderButtonProps> = ({
  subscriberRequired = false,
  initialState,
  className,
  alternative,
  variant = 'header',
}) => {
  const [state, dispatch] = React.useReducer(sortingHatReducer, initialState)
  const {subscriber, loadingSubscriber} = useCio()

  React.useEffect(() => {
    dispatch({type: `load`, subscriber, loadingSubscriber})
  }, [subscriber, loadingSubscriber])

  const onAnswer = (answer?: string) => {
    dispatch({type: 'answered', answer})
  }

  if (
    state.question &&
    !subscriberRequired &&
    !subscriber &&
    !loadingSubscriber
  ) {
    return (
      <HeaderButtonShapedLink
        label={state.question.heading}
        url={state.question.url}
      />
    )
  }

  className = className || `border p-6 mb-16`

  return !state.question || state.closed ? (
    alternative || null
  ) : variant === 'header' ? (
    <HeaderButtonShapedLink
      label={state.question.heading}
      url={state.question.url}
      onClick={() => {
        onAnswer('maybe')
      }}
    />
  ) : (
    <Card>
      <div className={className}>
        {state.question.type === 'cta-link' && (
          <div>
            <QuestionHeading question={state.question} />
            <Link href={state.question.url}>
              <a
                onClick={() => {
                  onAnswer('maybe')
                }}
                className="inline-flex justify-center items-center px-5 py-3 rounded-md bg-blue-600 text-white transition-all hover:bg-blue-700 ease-in-out duration-200"
              >
                {state.question.button_label}
              </a>
            </Link>
          </div>
        )}

        <div className="w-100 flex items-center justify-end mt-2">
          <button
            className="rounded text-xs px-2 py-1 flex justify-center items-center dark:text-gray-900 dark:bg-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors duration-150 ease-in-out "
            onClick={() => {
              dispatch({type: 'dismiss'})
            }}
          >
            close
          </button>
        </div>
      </div>
    </Card>
  )
}

export default HeaderButtonCTA
