import React from 'react'
import {Question, Questions} from 'types'
import last from 'lodash/last'

const CompletedMessage: React.FC<
  React.PropsWithChildren<{
    answeredCorrectly?: boolean
    neutral?: boolean
    question: Question
    questions: Questions
  }>
> = ({answeredCorrectly, neutral = false, question, questions}) => {
  const questionsKeys: string[] = Object.keys(questions)
  const lastQuestionKey: string = last(questionsKeys) || ''
  const isLast: boolean = questions[lastQuestionKey].tagId === question.tagId

  return neutral ? (
    <div className="font-medium prose sm:prose-xl prose-lg pt-10 text-center">
      {isLast ? (
        <p>
          This was the last lesson from the Testing Accessibility email course.
          I hope you learned something new, and I look forward to sharing more
          in the future!
        </p>
      ) : (
        <p>I'll send the next lesson in 5-10 minutes. Check your inbox.</p>
      )}
      <p>
        Thanks, <br /> Marcy
      </p>
    </div>
  ) : answeredCorrectly ? (
    <div className="font-medium prose sm:prose-xl prose-lg pt-10 border-t border-gray-200 mt-10 text-center">
      <p>Nice work. You chose the correct answer!</p>
      {isLast ? (
        <p>
          This was the last lesson from the Testing Accessibility email course.
          I hope you learned something new, and I look forward to sharing more
          in the future!
        </p>
      ) : (
        <p>I'll send the next lesson in 5-10 minutes. Check your inbox.</p>
      )}
      <p>
        Thanks, <br /> Marcy
      </p>
    </div>
  ) : (
    <div className="font-medium prose sm:prose-xl prose-lg pt-10 border-t border-gray-200 mt-10 text-center">
      <p>
        You didn't answer correctly, but don't worry. Just go back and re-read
        the email and check out any linked resources. You can refresh the page
        if you'd like to try again! 👍
      </p>
      {isLast ? (
        <p>
          This was the last lesson from the Testing Accessibility email course.
          I hope you learned something new, and I look forward to sharing more
          in the future!
        </p>
      ) : (
        <p>
          I'll send the next email in 5-10 minutes too so you can learn more.
        </p>
      )}

      <p>
        Thanks, <br /> Marcy
      </p>
    </div>
  )
}

export default CompletedMessage
