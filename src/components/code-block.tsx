import * as React from 'react'
import {FunctionComponent} from 'react'
import Highlight, {defaultProps, Language} from 'prism-react-renderer'

import theme from 'prism-react-renderer/themes/nightOwl'

type CodeBlockProps = {
  language: Language
  value: string
}

const CodeBlock: FunctionComponent<CodeBlockProps> = ({language, value}) => {
  return (
    <Highlight {...defaultProps} code={value} language={language} theme={theme}>
      {({className, style, tokens, getLineProps, getTokenProps}) => (
        <pre
          className={`${className} sm:mx-0 -mx-5 sm:rounded-md rounded-none`}
          style={style}
        >
          {tokens.map((line, i) => (
            <div {...getLineProps({line, key: i})} style={{fontSize: '90%'}}>
              {line.map((token, key) => (
                <span {...getTokenProps({token, key})} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  )
}

export default CodeBlock
