import * as React from 'react'

import HeaderButtonCTA from './header-button-survey'

const question = {
  version: '1.0.0',
  project_club: {
    heading: `Join a React Project Club`,
    subheading: `Let's build a business oriented protfolio project together`,
    type: `cta-link`,
    url: `/clubs/portfolio-project`,
    button_label: `Join a Project Club!`,
    final: true,
  },
}

const ProjectClubCTA: React.FunctionComponent<{
  className?: any
  alternative?: JSX.Element
  variant?: string
}> = (props) => {
  return (
    <HeaderButtonCTA
      subscriberRequired
      initialState={{
        currentQuestionKey: 'project_club',
        answers: {},
        closed: true,
        data: question,
        surveyTitle: 'project survey',
      }}
      {...props}
    />
  )
}

export default ProjectClubCTA
