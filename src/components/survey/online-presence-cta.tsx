import * as React from 'react'
import HeaderButtonCTA from './header-button-survey'

const question = {
  version: '1.0.0',
  online_presence: {
    heading: `Own Your Online Presence`,
    subheading: `We want to help you present your best as a professional web developer.`,
    type: `cta-link`,
    url: `/own-your-online-presence`,
    button_label: `Team up with egghead!`,
    final: true,
  },
}

const OnlinePresenceCTA: React.FunctionComponent<{
  className?: any
  alternative?: JSX.Element
  variant?: string
}> = (props) => {
  return (
    <HeaderButtonCTA
      initialState={{
        currentQuestionKey: 'online_presence',
        answers: {},
        closed: true,
        data: question,
        surveyTitle: 'online presence survey',
      }}
      {...props}
    />
  )
}

export default OnlinePresenceCTA
