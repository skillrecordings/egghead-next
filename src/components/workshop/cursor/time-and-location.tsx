import {Calendar, Clock, MapPin} from 'lucide-react'
import {cn} from '@/ui/utils'
import {parseDateTimeWithOffset, formatTimeInTimeZone} from './Hero'

const TimeAndLocation = ({
  date,
  startTime,
  timeZone,
  endTime,
  className,
  iconSize,
  isEuFriendly,
  showEuTooltip = false,
}: {
  date: string
  startTime: string
  timeZone: string
  endTime: string
  className?: string
  iconSize?: number
  showEuTooltip?: boolean
  isEuFriendly?: boolean
}) => {
  // Calculate European times
  const workshopDateStartObj = date
    ? parseDateTimeWithOffset(date, startTime, -7)
    : null

  const londonStartTime = workshopDateStartObj
    ? formatTimeInTimeZone(workshopDateStartObj, 'Europe/London')
    : 'Error'
  const parisBerlinStartTime = workshopDateStartObj
    ? formatTimeInTimeZone(workshopDateStartObj, 'Europe/Paris')
    : 'Error'

  const workshopDateEndObj = date
    ? parseDateTimeWithOffset(date, endTime, -7)
    : null

  const londonEndTime = workshopDateEndObj
    ? formatTimeInTimeZone(workshopDateEndObj, 'Europe/London')
    : 'Error'
  const parisBerlinEndTime = workshopDateEndObj
    ? formatTimeInTimeZone(workshopDateEndObj, 'Europe/Paris')
    : 'Error'

  return (
    <div
      className={cn(
        'px-6 pb-4 flex flex-col  text-md text-muted-foreground  md:gap-2 opacity-80 items-center justify-center',
        className,
      )}
    >
      <div className="flex items-center gap-1">
        <Calendar
          className={cn('h-5 w-5', iconSize && `h-${iconSize} w-${iconSize}`)}
        />
        <span>{date}</span>
      </div>
      <div className="flex items-center gap-1">
        <Clock
          className={cn('h-5 w-5', iconSize && `h-${iconSize} w-${iconSize}`)}
        />
        <span>
          {startTime} - {endTime} ({timeZone})
        </span>
      </div>
      {showEuTooltip && isEuFriendly && (
        <div className="relative group">
          <div className="flex flex-col gap-1 rounded-md p-1">
            <div className="flex items-center gap-1">
              🇬🇧 {londonStartTime} - {londonEndTime} (UTC+1)
            </div>
            <div className="flex items-center gap-1">
              🇪🇺 {parisBerlinStartTime} - {parisBerlinEndTime} (UTC+2)
            </div>
          </div>
        </div>
      )}
      <div className="flex items-center gap-1">
        <MapPin
          className={cn('h-5 w-5', iconSize && `h-${iconSize} w-${iconSize}`)}
        />
        <span>Zoom</span>
      </div>
    </div>
  )
}

export default TimeAndLocation
