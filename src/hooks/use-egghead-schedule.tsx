import * as React from 'react'
import axios from 'axios'

type ScheduleEvent = {
  title: string
  subtitle: string
  expiresAt: number
  calendarUrl: string
  description: string
  informationUrl: string
}

type Schedule = {
  id: string
  name: string
  title: string
  resources: ScheduleEvent[]
}

const useSchedule = (): [Schedule, boolean] => {
  const [schedule, setSchedule] = React.useState([])
  const [scheduleLoading, setScheduleLoading] = React.useState(true)

  React.useEffect(() => {
    axios
      .get(`/api/schedule`)
      .then(({data}) => setSchedule(data))
      .finally(() => setScheduleLoading(false))
  }, [])

  return [
    {
      id: 'schedule',
      name: 'Schedule',
      title: 'Upcoming Events',
      resources: schedule,
    },
    scheduleLoading,
  ]
}

export default useSchedule
