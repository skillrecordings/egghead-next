import {Survey, SurveyQuestion} from '../components/survey/survey-reducer'

const firstQuestion: SurveyQuestion = {
  heading: `Welcome!`,
  subheading: `What brings you here today?`,
  type: `multiple-choice`,
  first: true,
  random: true,
  other: true,
  other_label: `something else`,
  choices: [
    {
      answer: `leveling_up`,
      label: `Level up my programming skills`,
    },
    {
      answer: `optimizing_code`,
      label: `Help on a specific web development project`,
    },
  ],
  next: {
    leveling_up: `second_question`,
    optimizing_code: `second_question`,
    other: `final_cta`,
  },
}

const secondQuestion: SurveyQuestion = {
  heading: `Another question`,
  subheading: `Do you like cats?`,
  type: `multiple-choice`,
  random: true,
  choices: [
    {
      answer: `yes`,
      label: `Level up my programming skills`,
    },
    {
      answer: `no`,
      label: `Help on a specific web development project`,
    },
  ],
  next: {
    yes: `final_cta`,
    no: `final_cta`,
  },
}

const finalCta: SurveyQuestion = {
  heading: `Want to learn more?`,
  subheading: `We think developer portfolios are a great lever for career advancement.`,
  type: `cta-link`,
  url: `https://joelhooks.com/developer-portfolio`,
  button_label: `Click to Learn More About Developer Portfolios`,
  final: true,
}

export const testSurvey: Survey = {
  version: '1.0.0',
  first_question: firstQuestion,
  second_question: secondQuestion,
  final_cta: finalCta,
}
