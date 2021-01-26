import * as React from 'react'
import axios from 'axios'
import {take} from 'lodash'

export type ScheduleEvent = {
  title: string
  subtitle: string
  expiresAt: number
  calendarUrl: string
  description: string
  informationUrl: string
}

const useSchedule = (limit = -1): [ScheduleEvent[], boolean] => {
  const [schedule, setSchedule] = React.useState([])
  const [scheduleLoading, setScheduleLoading] = React.useState(true)

  React.useEffect(() => {
    axios
      .get(`/api/schedule`)
      .then(({data}) => setSchedule(limit > 0 ? take(data, limit) : data))
      .finally(() => setScheduleLoading(false))
  }, [])

  return [schedule, scheduleLoading]
}

export default useSchedule
