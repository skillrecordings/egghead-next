import {SortingHatState} from 'components/survey/sorting-hat-reducer'

export function cioIdentify(id: string, answers: any, state: SortingHatState) {
  if (id) {
    window._cio.identify({
      id,
      [`${state.surveyTitle.replace(' ', '_')}_version`]: state.data.version,
      ...answers,
    })
  }
}
