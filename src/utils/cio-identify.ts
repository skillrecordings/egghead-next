import {SurveyState} from 'components/survey/survey-reducer'

export function cioIdentify(id: string, answers: any, state: SurveyState) {
  if (id) {
    window._cio.identify({
      id,
      [`${state.surveyTitle.replace(' ', '_')}_version`]: state.data.version,
      ...answers,
    })
  }
}
