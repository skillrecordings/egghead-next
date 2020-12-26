import * as React from 'react'
import sortingHatData from 'data/sorting-hat'
import MultipleChoiceQuestion from './questions/multiple-choice-question'
import Image from 'next/image'
import Link from 'next/link'
import MultiLine from './questions/multi-line'
import Markdown from 'react-markdown'
import {track} from 'utils/analytics'
import useCio from 'hooks/use-cio'

const sortingHatInitialState = {
  loading: true,
  currentQuestion: `biggest_path`,
  answers: {},
}

const SORTING_HAT_KEY = `egghead_sorting_hat`

const cioIdentify = (id: string, answers: any) => {
  if (id) {
    console.log('identify?', id, answers)
    window._cio.identify({
      id,
      ...answers,
    })
  }
}
// http://next.egghead.af:3000/ask?cio_id=co_b6f9rsaq0z8k5
const sortingHatReducer = (state: any, action: any) => {
  const getSavedState = () => {
    const savedState = localStorage.getItem(SORTING_HAT_KEY)
    if (savedState) {
      return JSON.parse(savedState)
    } else {
      return false
    }
  }
  const findCurrentQuestion = (question: string, answers: any): string => {
    if (question && answers[question]) {
      const possibleNext = sortingHatData[question].next?.[answers[question]]
      if (![answers[possibleNext]]) {
        return possibleNext
      } else {
        return findCurrentQuestion(possibleNext, answers)
      }
    } else {
      return question || 'thanks'
    }
  }
  switch (action.type) {
    case `load`:
      const savedState = getSavedState() || state
      if (action.subscriber) {
        cioIdentify(action.subscriber.id, savedState.answers)
        const answers = {
          ...savedState.answers,
          ...action.subscriber.attributes,
        }
        console.log('load')
        return {
          ...state,
          ...savedState,
          answers,
          subscriber: action.subscriber,
          currentQuestion: findCurrentQuestion(
            savedState.currentQuestion,
            answers,
          ),
          loading: false,
        }
      } else if (action.loadingSubscriber === false) {
        return {
          loading: false,
          error: 'You must be logged in to take the survey!',
        }
      } else {
        return state
      }
    case `answered`:
      const question: any = sortingHatData[state.currentQuestion]
      const answers = {
        ...state.answers,
        ...state.subscriber.attributes,
        [state.currentQuestion]: action.answer,
      }
      const nextQuestion = findCurrentQuestion(
        question.next[action.answer],
        answers,
      )

      const updatedState = {...state, answers, currentQuestion: nextQuestion}

      localStorage.setItem(SORTING_HAT_KEY, JSON.stringify(updatedState))

      if (state.subscriber) {
        cioIdentify(state.subscriber.id, answers)
        track(`answered survey question`, {
          survey: 'sorting hat',
          question: state.currentQuestion,
          answer: action.answer,
        })
      }
      return updatedState
    default:
      break
  }
}

const QuestionHeading: React.FunctionComponent<{question: any}> = ({
  question,
}) => {
  return (
    <>
      <h2 className="text-xl">
        <Markdown>{question.heading}</Markdown>
      </h2>
      <h3 className="text-lg">
        <Markdown>{question.subheading}</Markdown>
      </h3>
    </>
  )
}

const SortingHat: React.FunctionComponent = () => {
  const [state, dispatch] = React.useReducer(
    sortingHatReducer,
    sortingHatInitialState,
  )
  const {subscriber, loadingSubscriber} = useCio()
  const question: any = sortingHatData[state.currentQuestion]

  console.log(subscriber)

  React.useEffect(() => {
    dispatch({type: `load`, subscriber, loadingSubscriber})
  }, [subscriber, loadingSubscriber])

  const onAnswer = (answer: string) => {
    dispatch({type: 'answered', answer})
  }

  return state.loading ? null : (
    <div>
      {state.error && <div>{state.error}</div>}
      {question?.type === 'multiple-choice' && (
        <div>
          <QuestionHeading question={question} />
          <MultipleChoiceQuestion
            onAnswer={onAnswer}
            question={question}
          ></MultipleChoiceQuestion>
        </div>
      )}
      {question?.type === 'multi-line' && (
        <div>
          <QuestionHeading question={question} />
          <MultiLine question={question} onAnswer={onAnswer} />
        </div>
      )}
      {question?.type === 'cta-done' && (
        <div>
          <QuestionHeading question={question} />
        </div>
      )}
      {question?.type === 'cta-email' && (
        <div>
          <QuestionHeading question={question} />
          <Image width={128} height={128} src={question.image} />
        </div>
      )}
      {question?.type === 'cta-link' && (
        <div>
          <QuestionHeading question={question} />
          <Link href={question.url}>
            <a>{question.button_label}</a>
          </Link>
        </div>
      )}
      {question?.type === 'opt-out' && (
        <div>
          <QuestionHeading question={question} />
        </div>
      )}
    </div>
  )
}

export default SortingHat
