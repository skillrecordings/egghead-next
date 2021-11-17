import * as React from 'react'
import {get, isEmpty, keys} from 'lodash'
import {useRouter} from 'next/router'
import Layout from 'layouts'
import Link from 'next/link'
import EssayQuestion from 'components/forms/quiz/essay-question'
import MultipleChoiceQuestion from 'components/forms/quiz/multiple-choice-question'
import {Question, Questions} from 'types'

type AnswerProps = {
  questions: Questions
}

const OnlinePresenceAnswer: React.FC<AnswerProps> = ({questions}) => {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = React.useState<Question>()

  React.useEffect(() => {
    const param: any = get(router.query, 'question')
    if (!isEmpty(param)) {
      const question = get(questions, param)
      setCurrentQuestion(question)
    }
  }, [router])

  const QuestionToShow = () => {
    if (!currentQuestion) {
      return null
    }
    switch (currentQuestion.type as string) {
      case 'multiple-choice':
        return (
          <MultipleChoiceQuestion
            question={currentQuestion}
            questions={questions}
          />
        )
      default:
        return (
          <EssayQuestion question={currentQuestion} questions={questions} />
        )
    }
  }

  return (
    <>
      <DevTools questions={questions} />
      <Layout noIndex meta={{title: 'Accessibility Quiz'}}>
        <div className="container">
          <header className="relative flex items-center justify-center bg-black xl:pt-20 sm:pt-16 pt-14">
            <h1 className="sr-only">
              TestingAccessibility.com Quiz by Marcy Sutton
            </h1>
          </header>
          <main className="flex items-center justify-center w-full max-w-screen-sm pt-24 pb-8 mx-auto xl:pt-36 md:pt-32 sm:pb-16">
            {QuestionToShow()}
          </main>
        </div>
      </Layout>
    </>
  )
}

export const questions: Questions = {
  welcome: {
    question: `## From the list in the email, what is a new workflow step or approach you could take to evaluate websites or applications for accessibility?`,
    type: `essay`,
    tagId: 2304869, // ec - ta - 001 Welcome Completed
  },
  semantics: {
    question: `## Which of these attributes are valid?`,
    type: 'multiple-choice',
    tagId: 2304880, // ec - ta - 002 Semantics Completed
    correct: ['aria-atomic', 'aria-valuetext'],
    answer:
      'While they may appear possibly legitimate, `aria-alert` and `role="tableheader"` are not valid attributes in the standard set provided by ARIA. The two other attributes are indeed valid: `aria-atomic` is part of ARIA Live Regions and `aria-valuetext` can be applied as a human-readable value for custom slider components. It\'s important to reference the [ARIA specification](https://www.w3.org/TR/wai-aria-1.1/) when using any role, state, or property to understand its usage and requirements, including ruling out use of any invalid attributes!',
    choices: [
      {
        answer: 'aria-alert',
        label: 'aria-alert',
      },
      {
        answer: 'aria-atomic',
        label: 'aria-atomic',
      },
      {
        answer: 'aria-valuetext',
        label: 'aria-valuetext',
      },
      {
        answer: 'role-tableheader',
        label: `role='tableheader'`,
      },
    ],
  },
  interaction: {
    question: `## Does keyboard focus need to be visible for focus management targets?`,
    type: 'multiple-choice',
    tagId: 2304882, // TODO
    correct: 'true',
    answer: `Yes, it does! A visible focus indicator is helpful for anyone relying on the keyboard or voice control to navigate to a part of a page and see their focus point on screen.\n\nWithout this affordance, sighted keyboard users and users of voice dictation technology may not have the same understanding when interacting with a page as someone who can see and use a mouse.\n\nTo learn more about visible focus relating to client-side routing and the best characteristics for focus management targets, read an article I wrote on [accessibility in client-side routing](https://www.gatsbyjs.com/blog/2019-07-11-user-testing-accessible-client-routing/)`,
    choices: [
      {
        answer: 'true',
        label: 'Yes, it does need to be visible',
      },
      {
        answer: 'false',
        label: 'No, it does not',
      },
    ],
  },
  tools: {
    question: `## If an interactive widget won't open or function properly with a Windows screen reader running, what should you do?`,
    type: 'multiple-choice',
    tagId: 2304884, // ec - ta - 004 Tools Completed
    correct: ['check-code', 'h-key', 'focus-modes'],
    choices: [
      {
        answer: 'turn-off-reader',
        label: 'Turn off the screen reader',
      },
      {
        answer: 'h-key',
        label: 'Try hitting the H key to see if you cycle through headings',
      },
      {
        answer: 'focus-modes',
        label:
          'Use key commands to toggle between browse and focus modes manually',
      },
      {
        answer: 'check-code',
        label:
          'Check ARIA roles, states, and properties on the widget to see if coded properly',
      },
    ],
  },
  design: {
    question: `True or False: An icon button can be made accessible with an \`aria-label\`.`,
    type: 'multiple-choice',
    tagId: 2304886, // ec - ta - 005 Design Completed
    correct: 'false',
    answer: `It can't - at least not with that alone. If the icon is hard to see or understand, an aria-label would only help users running assistive technology-assuming it had adequate semantics. More visual contrast and possibly a text label may be necessary from a design standpoint as well.`,
    choices: [
      {
        answer: 'true',
        label: 'Yes, it can',
      },
      {
        answer: 'false',
        label: "No, it can't",
      },
    ],
  },
  people: {
    question: `How would you persuade your manager to include accessibility in current and upcoming sprints/iterations? If there is a lot of design and/or technical debt to achieve accessibility, what would you prioritize as the most high-impact items to tackle first?`,
    tagId: 2304888, // ec - ejs - 006 People Completed
    type: 'essay',
  },
}

const DevTools: React.FC<{questions: Questions}> = ({questions}) => {
  const [hidden, setHidden] = React.useState(false)
  const router = useRouter()
  if (process.env.NODE_ENV !== 'development' || hidden) {
    return null
  }

  return (
    <nav
      className="fixed z-10 flex flex-col invisible p-4 bg-white border border-gray-100 rounded-md shadow-xl top-5 right-5 sm:visible"
      aria-label="Quiz sections"
    >
      <div className="absolute flex justify-end w-full leading-tighter right-2 top-2">
        <button
          onClick={() => setHidden(true)}
          className="text-xs font-bold text-black"
        >
          <span className="not-sr-only" aria-hidden="true">
            ✕
          </span>
          <span className="sr-only">close navigation</span>
        </button>
      </div>
      <span className="pb-2 text-sm font-medium text-indigo-600">
        Questions:
      </span>
      <ol className="list-decimal list-inside" role="list">
        {keys(questions).map((q) => (
          <li className="pb-1" key={q} role="listitem">
            <Link href={`/answer?question=${q}`}>
              <a
                className={
                  get(router.query, 'question') === q
                    ? 'underline'
                    : 'hover:underline'
                }
              >
                {q}
              </a>
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  )
}
export default OnlinePresenceAnswer
