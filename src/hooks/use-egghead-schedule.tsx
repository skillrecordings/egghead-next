import * as React from 'react'
import axios from 'axios'

export type ScheduleEvent = {
  title: string
  subtitle: string
  expiresAt: number
  calendarUrl: string
  description: string
  informationUrl: string
}

const useSchedule = (): [ScheduleEvent[], boolean] => {
  const [schedule, setSchedule] = React.useState([])
  const [scheduleLoading, setScheduleLoading] = React.useState(true)

  React.useEffect(() => {
    axios
      .get(`/api/schedule`)
      .then(({data}) => setSchedule(data))
      .finally(() => setScheduleLoading(false))
  }, [])

  return [schedule, scheduleLoading]
}

export default useSchedule
