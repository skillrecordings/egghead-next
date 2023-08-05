import * as React from 'react'
import ReactCountdown, {CountdownRendererFn, zeroPad} from 'react-countdown'

type CountdownProps = {
  date: Date
  label?: string
  className?: string
}

const Countdown: React.FC<React.PropsWithChildren<CountdownProps>> = ({
  date,
  className = 'p-5 mt-5 dark:bg-white dark:bg-opacity-5 bg-gray-400 bg-opacity-5 w-full rounded-md relative overflow-hidden after:absolute after:w-full after:h-1 dark:after:bg-yellow-400 after:bg-blue-500 after:left-0 after:bottom-0',
  children,
  label,
}) => {
  const numberOf = (number: number, label: string) => {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="text-center text-xl font-semibold leading-tight tabular-nums">
          {zeroPad(number)}
        </div>
        <div className="text-sm opacity-60">{label}</div>
      </div>
    )
  }

  type RendererProps = {
    days: number
    hours: number
    minutes: number
    seconds: number
    completed: boolean
  }

  const renderer: CountdownRendererFn = ({
    days,
    hours,
    minutes,
    seconds,
    completed,
  }: RendererProps) => {
    if (completed) {
      return children ? children : null
    } else {
      return (
        <div className={className ? className : ''}>
          <p className="text-center text-sm uppercase tracking-wide font-medium leading-tight pb-3">
            {label ? label : 'price goes up in'}
          </p>

          <div className="grid grid-flow-col sm:gap-5 gap-5 items-center justify-center mx-auto">
            {days > 0 && numberOf(days, 'days')}
            {numberOf(hours, 'hours')}
            {numberOf(minutes, 'minutes')}
            {numberOf(seconds, 'seconds')}
          </div>
        </div>
      )
    }
  }

  return date ? (
    <ReactCountdown zeroPadTime={2} date={date} renderer={renderer} />
  ) : null
}

export default Countdown
