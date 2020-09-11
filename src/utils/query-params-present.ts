import qs from 'qs'
import isEmpty from 'lodash/isEmpty'

const queryParamsPresent = (url: string) =>
  !isEmpty(qs.parse(url.split('?')[1]))

export default queryParamsPresent
