import {Calendar, Clock, MapPin} from 'lucide-react'
import {cn} from '@/ui/utils'

const TimeAndLocation = ({
  date,
  startTime,
  timeZone,
  endTime,
  className,
  iconSize,
}: {
  date: string
  startTime: string
  timeZone: string
  endTime: string
  className?: string
  iconSize?: number
}) => {
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
