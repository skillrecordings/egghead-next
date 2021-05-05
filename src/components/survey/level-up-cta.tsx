import * as React from 'react'

import HeaderButtonCTA from './header-button-survey'

const question = {
  version: '1.0.0',
  career_chat: {
    heading: `Taking the next step in your career?`,
    subheading: `We would like to chat 1:1 and see how we can help.`,
    type: `cta-link`,
    url: `/level-up`,
    button_label: `Team up with egghead!`,
    final: true,
  },
}

const LevelUpCTA: React.FunctionComponent<{
  className?: any
  alternative?: JSX.Element
  variant?: string
}> = (props) => {
  return (
    <HeaderButtonCTA
      initialState={{
        currentQuestionKey: 'career_chat',
        answers: {},
        closed: true,
        data: question,
        surveyTitle: 'career chat survey',
      }}
      {...props}
    />
  )
}

export default LevelUpCTA
