import React, {FunctionComponent, useState, useEffect} from 'react'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import CodeBlock from 'components/code-block'

type CertificationExamProps = {
  examQuestions: any
  examMetaData: any
}

const CertificationExam: FunctionComponent<CertificationExamProps> = ({
  examQuestions,
  examMetaData,
}) => {
  const {title, image} = examMetaData
  const questions = examQuestions

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [showScore, setShowScore] = useState(false)
  const [score, setScore] = useState(0)
  const [showExam, setShowExam] = useState(false)

  const handleShowExamOptionClick = (show: boolean) => {
    setShowExam(show)
  }
  const handleAnswerOptionClick = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(score + 1)
    }
    const nextQuestion = currentQuestion + 1
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion)
    } else {
      setShowScore(true)
    }
  }

  const gradeDecimal = score / questions.length
  const gradePecentage = gradeDecimal * 100

  return (
    <div className="mx-auto max-w-screen-2xl lg:py-16 py-10">
      <div className="grid grid-cols-2 dark:bg-gray-800 rounded items-center p-4 mb-10">
        <div className="flex">
          <Image
            src={image}
            width={100}
            height={100}
            layout="fixed"
            className="object-cover rounded-md"
            alt={`illustration for ${title}`}
          />
          <div className="self-center ml-10">
            <h1 className="text-base font-normal uppercase">Exam</h1>
            <h1 className="text-2xl font-bold">{title}</h1>
          </div>
        </div>

        {showExam && !showScore && (
          <div className="justify-self-end mr-4">
            <span className="text-bold">Question {currentQuestion + 1}</span>/
            {questions.length}
          </div>
        )}
      </div>

      <div>
        {showExam && showScore && (
          <div className="grid grid-cols-2 md:text-2xl text-xl font-bold leading-tighter">
            {gradeDecimal >= 0.75 ? (
              <p>yay you passed the exam!! 🥳</p>
            ) : (
              <p>you didn't pass the exam 😭</p>
            )}
            <div>
              You scored {score} out of {questions.length}
              <p>{gradePecentage}%</p>
            </div>
          </div>
        )}
      </div>

      {showExam ? (
        <div>
          {showScore ? (
            <div>
              {gradeDecimal >= 0.75 ? (
                <p>Download certificate here! 📜</p>
              ) : (
                <p>Take the course again!</p>
              )}
            </div>
          ) : (
            <>
              <div>
                <strong className="md:text-2xl text-xl font-bold leading-tighter">
                  {questions[currentQuestion].questionText}
                </strong>
              </div>
              <div>
                {questions[currentQuestion].answerOptions.map(
                  (answerOption: any) => (
                    <p>
                      <button
                        onClick={() =>
                          handleAnswerOptionClick(answerOption.isCorrect)
                        }
                        className="bg-white dark:bg-gray-800 dark:text-gray-200 shadow-sm rounded-lg overflow-hidden p-5 m-0 flex sm:flex-row flex-col sm:space-x-5 space-x-0 sm:space-y-0 space-y-5 items-center sm:text-left text-center my-4"
                      >
                        <ReactMarkdown className="leading-normal prose-sm prose dark:prose-dark text-left">
                          {answerOption.answerText}
                        </ReactMarkdown>
                      </button>
                    </p>
                  ),
                )}
              </div>
            </>
          )}
        </div>
      ) : (
        <div>
          <ul>
            <li>You can take the exam as many times as you want.</li>
            <li>The exam consists of 30 questions.</li>
            <li>You need 75% correct answers to approve it.</li>
          </ul>

          <button
            className="inline-flex justify-center items-center px-4 py-2 rounded-md bg-blue-600 text-white transition-all hover:bg-blue-700 ease-in-out duration-200"
            onClick={() => handleShowExamOptionClick(!showExam)}
          >
            Start the Exam!
          </button>
        </div>
      )}
    </div>
  )
}

export default CertificationExam
