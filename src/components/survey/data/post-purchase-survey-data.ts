import {Survey, SurveyQuestion} from '../survey-reducer'

const firstQuestion: SurveyQuestion = {
  heading: `Welcome!`,
  subheading: `What brings you here today?`,
  type: `multi-line`,
  first: true,
  other: true,
  other_label: `I'd rather not say...`,
  next: {
    other: `opt_out`,
    all: `thanks`,
  },
}

const optOutQuestion: SurveyQuestion = {
  heading: `We understand.`,
  final: true,
  subheading: `We won't ask you any more of these questions.`,
  type: `opt-out`,
}

const thanksQuestion: SurveyQuestion = {
  heading: `We appreciate you!`,
  subheading: `Understanding your situation helps us showcase the resources that 
you'll find most useful.

Thanks for letting us know!`,
  type: `cta-done`,
  final: true,
  button_label: `Click to Close`,
}

export const postPurchaseSurvey: Survey = {
  version: '1.0.0',
  how_can_we_help: firstQuestion,
  thanks: thanksQuestion,
  opt_out: optOutQuestion,
}
