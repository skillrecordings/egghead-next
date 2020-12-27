import React, {FunctionComponent, useEffect, useState} from 'react'
import styled from '@emotion/styled'
import Highlight, {defaultProps} from 'prism-react-renderer'
import theme from 'prism-react-renderer/themes/nightOwl'

const RE = /{([\d,-]+)}/

function calculateLinesToHighlight(meta: string) {
  if (RE.test(meta)) {
    const lineNumbers = RE.exec(meta)![1]
      .split(',')
      .map((v) => v.split('-').map((y) => parseInt(y, 10)))
    return (index: number) => {
      const lineNumber = index + 1
      const inRange = lineNumbers.some(([start, end]) =>
        end ? lineNumber >= start && lineNumber <= end : lineNumber === start,
      )
      return inRange
    }
  }
  return () => false
}

type CodeProps = {
  className: string
  metastring: string
  children: string
}

const Code: FunctionComponent<CodeProps> = ({
  children,
  className,
  metastring,
}) => {
  const language = className ? className.replace(/language-/, '') : ''
  const shouldHighlightLine = calculateLinesToHighlight(metastring)

  const defaultCopyText = 'Copy'
  const [copyText, setCopyText] = useState(defaultCopyText)

  useEffect(() => {
    let current = true
    if (copyText !== defaultCopyText) {
      setTimeout(() => {
        if (current) {
          setCopyText(defaultCopyText)
        }
      }, 2000)
    }
    return () => {
      current = false
    }
  }, [copyText])

  function copy(event: {preventDefault: () => void}) {
    event.preventDefault()
    navigator.clipboard.writeText(children).then(
      () => {
        setCopyText('Copied')
      },
      () => {
        setCopyText('Error copying text')
      },
    )
  }

  const SyntaxStyles = styled.div`
    overflow: auto;
    border-radius: 5px;
    padding: 10px;
  `

  const PreStyles = styled.div`
    float: left;
    min-width: 100%;
    overflow: initial;
    padding: 0;
    line-height: 150%;
    margin-top: -5px;
    .highlight-line {
      background-color: rgba(164, 107, 255, 0.2);
    }
  `

  const SpanStyles = styled.span`
    display: inline-block;
    width: 2em;
    user-select: none;
    opacity: 0.3;
    padding-left: 0px;
  `

  const TitleSection = styled.div`
    display: grid;
    grid-template-columns: 1fr 100px;
    width: 100%;
    padding: 5px 10px;
    border-bottom: 1px solid #162633;
    background: #05223a;
    small {
      color: #cad4e3;
      font-size: 0.8rem;
    }
  `

  const Button = styled.button`
    display: grid;
    grid-template-columns: 30px 1fr;
    justify-items: center;
    align-items: center;
    outline: none;
    svg {
      height: 23px;
      width: 21px;
      transform: scale(0.8);
    }

    svg path {
      stroke: #cad4e3;
      fill: none;
      transition: 1s cubic-bezier(0.075, 0.82, 0.165, 1);
    }

    :hover {
      :hover svg path {
        stroke: #ffffff;
      }
    }
  `

  return (
    <Highlight
      {...defaultProps}
      theme={theme}
      code={children.trim()}
      language={language as any}
    >
      {({tokens, getLineProps, getTokenProps}) => (
        <div>
          <TitleSection>
            <small className={language}>{language}</small>
            <Button onClick={copy}>
              <svg>
                <path d="M8 17.929H6c-1.105 0-2-.912-2-2.036V5.036C4 3.91 4.895 3 6 3h8c1.105 0 2 .911 2 2.036v1.866m-6 .17h8c1.105 0 2 .91 2 2.035v10.857C20 21.09 19.105 22 18 22h-8c-1.105 0-2-.911-2-2.036V9.107c0-1.124.895-2.036 2-2.036z"></path>
              </svg>
              <small>{copyText}</small>
            </Button>
          </TitleSection>

          <SyntaxStyles>
            <PreStyles>
              {tokens.map((line, i) => (
                <div
                  {...getLineProps({
                    line,
                    key: i,
                    className: shouldHighlightLine(i) ? 'highlight-line' : '',
                  })}
                >
                  <SpanStyles>{i + 1}</SpanStyles>
                  {line.map((token, key) => (
                    <span {...getTokenProps({token, key})} />
                  ))}
                </div>
              ))}
            </PreStyles>
          </SyntaxStyles>
        </div>
      )}
    </Highlight>
  )
}

export default Code
