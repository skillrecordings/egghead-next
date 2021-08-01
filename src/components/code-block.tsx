import * as React from 'react'
import {FunctionComponent} from 'react'
import Highlight, {defaultProps, Language} from 'prism-react-renderer'
import {ErrorBoundary} from 'react-error-boundary'

import theme from 'prism-react-renderer/themes/nightOwl'

function ErrorFallback({error, resetErrorBoundary}) {
  console.log({error})
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

type CodeBlockProps = {
  language: Language
  value: string
}

const CodeBlock: FunctionComponent<CodeBlockProps> = ({language, value}) => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // reset the state of your app so the error doesn't happen again
      }}
    >
      <Highlight
        {...defaultProps}
        code={value}
        language={language}
        theme={theme}
      >
        {({className, style, tokens, getLineProps, getTokenProps}) => (
          <pre
            className={`${className} sm:mx-0 -mx-5 sm:rounded-md rounded-none`}
            style={style}
          >
            {tokens.map((line, i) => (
              <div {...getLineProps({line, key: i})} style={{fontSize: '90%'}}>
                {line.map((token, key) => {
                  if (!token) return null
                  return <span {...getTokenProps({token, key})} />
                })}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </ErrorBoundary>
  )
}

export default CodeBlock
