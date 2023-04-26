import * as React from 'react'
import {FunctionComponent} from 'react'
import {Children, ReactNode, ReactElement} from 'react'
import {paramsFromMetastring} from 'utils/code'
import useClipboard from 'react-use-clipboard'
import SimpleBar from 'simplebar-react'

type CodeBlockProps = {
  language: string
  metastring: string
}

const CodeBlock: FunctionComponent<CodeBlockProps> = ({
  language,
  metastring,
  children,
}) => {
  const {numbered, linesHighlighted, labeled, filePath} =
    paramsFromMetastring(metastring)

  // extract code from nodes ?
  let code = ''

  // create arrays of arrays wit only spans inside
  const linesArr: ReactNode[][] = [[]]

  Children.forEach(children, (child) => {
    const index = linesArr.length - 1

    if (typeof child === 'string') {
      if (language === '') {
        linesArr.push([child])
      } else {
        linesArr.push([])
      }
      // add to code
      code += child
    } else {
      if (linesArr[index]) {
        linesArr[index].push(child)
      }

      // add content to code
      if (child && typeof child === 'object') {
        code += (child as ReactElement).props.children
      }
    }
  })

  // transform lines into divs > [span]
  const linesNodes = []
  for (let i = 0; i < linesArr.length; i++) {
    const lineIndex = i + 1
    const childs = numbered
      ? [
          <Number key={`line-number-${lineIndex}`}>{lineIndex}</Number>,
          linesArr[i],
        ]
      : linesArr[i]

    linesNodes.push(
      <Line
        key={`line-${lineIndex}`}
        highlight={linesHighlighted.indexOf(lineIndex) > -1}
      >
        {childs}
      </Line>,
    )
  }

  return (
    <div className="relative bg-gray-800 sm:mx-0 -mx-2 sm:rounded-md rounded-none mb-5 overflow-hidden">
      {labeled && (
        <>
          <div className="sm:pb-3 pb-0 px-5 pt-5 text-white text-xs font-bold select-none pointer-events-none">
            {language.replace('language-', '')}
            <span className="ml-2 font-light">{filePath}</span>
          </div>
          <CopyToClipboard code={code} />
        </>
      )}
      <div>
        <style>
          {`
            pre {
              font-size: 85% !important;
              line-height: 1.75 !important;
              border-radius: 0 !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            @media only screen and (max-width: 640px) {
              pre {
                padding: 0 !important;
              }
            }
          `}
        </style>
        <pre className="code-block sm:mx-0 -mx-5 sm:px-0 px-5 py-0">
          <code>
            <SimpleBar autoHide={false} style={{padding: 20}}>
              {linesNodes}
            </SimpleBar>
          </code>
        </pre>
      </div>
    </div>
  )
}

export default CodeBlock

const Line: FunctionComponent<{highlight?: boolean}> = ({
  highlight,
  children,
}) => <div className={highlight ? 'bg-gray-700' : ''}>{children}</div>

const Number: FunctionComponent = ({children}) => (
  <span className="line-number opacity-50 text-xs w-7 inline-block select-none pointer-events-none">
    {children}
  </span>
)

const CopyToClipboard: FunctionComponent<{code: string}> = ({code}) => {
  const [isCopied, setCopied] = useClipboard(code, {successDuration: 1000})
  return (
    <button
      onClick={setCopied}
      aria-label="Copy code to clipboard"
      className="p-2 absolute top-4 right-3 text-gray-400 hover:text-white transition-all duration-100 ease-in-out"
    >
      {isCopied ? (
        //   prettier-ignore
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><g fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></g></svg>
      ) : (
        // prettier-ignore
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></g></svg>
      )}
    </button>
  )
}
