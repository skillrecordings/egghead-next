import React from 'react'
import {useFormik} from 'formik'
import {Question} from 'types'
import axios from 'axios'
import {every, isArray} from 'lodash'
import isEmpty from 'lodash/isEmpty'
import * as Yup from 'yup'
import useCio from './use-cio'

type Choice = {
  answer: string
  label: string
}

function useQuestion(question: Question) {
  const [answer, setAnswer] = React.useState<any>()
  const [error, setError] = React.useState<any>()
  const {tagId, correct} = question || {}
  const hasMultipleCorrectAnswers = isArray(correct)
  const isAnswered = !isEmpty(answer)
  const [isSubmitting, setSubmitting] = React.useState<boolean>(false)
  const formik = useFormik({
    initialValues: {
      answer: null,
      // comment: null,
    },
    validationSchema: Yup.object({
      answer: correct
        ? hasMultipleCorrectAnswers
          ? Yup.array()
              // .min(correct.length, `Pick at least ${correct.length}.`)
              .required('Please pick at least one option.')
              .label('Options')
              .nullable()
          : Yup.string().required('Please pick an option.').nullable()
        : Yup.string()
            .nullable()
            .required(`Can't stay empty. Mind to elaborate? :)`),
      // comment: Yup.string().nullable().required(),
    }),
    onSubmit: async (values) => {
      setSubmitting(true)
      // TODO: Update /api/answer endpoint for persistence
      // subscriber &&
      //   sendAnswerToAirtable(values.answer, subscriber, question.question)
      axios
        .post('/api/answer', {
          tagId,
        })
        .then(() => {
          setAnswer(values)
          setSubmitting(false)
        })
        .catch((err) => {
          setError(err)
        })
    },
    validateOnChange: false,
  })

  const isCorrectAnswer = (choice: Choice): boolean => {
    return correct && hasMultipleCorrectAnswers
      ? correct.includes(choice.answer)
      : correct === choice?.answer
  }

  const answeredCorrectly = (): boolean => {
    const allCorrect: any =
      isArray(answer?.answer) &&
      every(answer.answer.map((a: string) => correct?.includes(a)))

    return isAnswered && hasMultipleCorrectAnswers
      ? allCorrect
      : correct === answer?.answer
  }

  return {
    formik,
    onAnswer: formik.handleSubmit,
    isCorrectAnswer: (props: any) => isCorrectAnswer(props as any),
    isAnswered,
    isSubmitting,
    hasMultipleCorrectAnswers,
    answeredCorrectly: answeredCorrectly(),
    error,
  }
}

export default useQuestion
