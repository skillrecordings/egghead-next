import {jsx} from '@emotion/core'
import React from 'react'
import {motion, AnimatePresence} from 'framer-motion'

const QuestionReveal = ({children, question, action = 'Reveal Answer'}) => {
  const [isShown, setShown] = React.useState(false)

  return (
    <div className="shadow border-gray-100 border-2 p-8 bg-gray-50 rounded-lg mt-12">
      <div className="text-gray-600 text-base mx-auto text-center mt-3">
        Question Time
      </div>
      <div className="relative flex items-center justify-center font-sans text-center text-4xl font-semibold leading-normal mt-2">
        {question}
      </div>
      <div className="relative flex items-center justify-center p-8 bg-gray-50 rounded-lg mt-2">
        <AnimatePresence>
          {!isShown && (
            <motion.div
              className="absolute z-10 flex flex-col items-center"
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              exit={{opacity: 0}}
              transition={{duration: 1, type: 'spring'}}
            >
              <div className="font-sans text-2xl font-normal text-gray-700">
                What's the answer?
              </div>
              <button
                className="leading-8 mt-4 px-5 py-3 rounded-md bg-indigo-500 hover:bg-indigo-600 transition-colors duration-200 ease-in-out text-white"
                onClick={() => setShown(!isShown)}
              >
                {action}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          initial={{
            filter: 'blur(8px)',
          }}
          animate={{
            filter: isShown ? 'blur(0px)' : 'blur(8px)',
          }}
          transition={{duration: 2, type: 'spring'}}
          css={{
            'img, pre, .gif_player': {
              display: isShown ? 'inherit' : 'none',
            },
          }}
          className={!isShown && `max-h-64 overflow-hidden`}
        >
          {children}
        </motion.div>
      </div>
    </div>
  )
}

export default QuestionReveal
