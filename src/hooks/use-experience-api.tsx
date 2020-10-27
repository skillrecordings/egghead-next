import * as React from 'react'
import axios from 'axios'

type ExperienceStatementTarget = {
  id: string
  definition: {
    name: {
      'en-US': string
    }
    type: string
    moreinfo: string
  }
}

export const useExperienceApi = () => {
  const trackExperience = React.useCallback(
    (verb: string, target: ExperienceStatementTarget) => {
      axios.post(`/api/progress`, {verb, target})
    },
    [],
  )
  return trackExperience
}

export default useExperienceApi
