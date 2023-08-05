import * as React from 'react'

import HeaderButtonCTA from './header-button-survey'

const question = {
  version: '1.0.0',
  portfolio_foundations: {
    heading: `Build Your Dev Portfolio`,
    subheading: `Your guide to building the portfolio that furthers your career.`,
    type: `cta-link`,
    url: `/developer-portfolio-foundations`,
    button_label: `Build Your Portfolio`,
    final: true,
  },
}

const PortfolioFoundationsCTA: React.FunctionComponent<
  React.PropsWithChildren<{
    className?: any
    alternative?: JSX.Element
    variant?: string
  }>
> = (props) => {
  return (
    <HeaderButtonCTA
      initialState={{
        currentQuestionKey: 'portfolio_foundations',
        answers: {},
        closed: true,
        data: question,
        surveyTitle: 'portfolio foundations survey',
      }}
      {...props}
    />
  )
}

export default PortfolioFoundationsCTA
