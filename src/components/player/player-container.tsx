import * as React from 'react'
import {usePlayer} from 'cueplayer-react'
import classNames from 'classnames'

const PlayerContainer: React.ForwardRefExoticComponent<any> = React.forwardRef<
  HTMLDivElement,
  any
>((props, ref) => {
  const {player} = usePlayer()
  const {className, children, ...rest} = props
  const {paused, hasStarted, waiting, seeking, isFullscreen, userActivity} =
    player

  return (
    <div
      {...rest}
      ref={ref}
      className={classNames(
        {
          'cueplayer-react-has-started': hasStarted,
          'cueplayer-react-paused': paused,
          'cueplayer-react-playing': !paused,
          'cueplayer-react-waiting': waiting,
          'cueplayer-react-seeking': seeking,
          'cueplayer-react-fullscreen': isFullscreen,
          'cueplayer-react-user-inactive': !userActivity,
          'cueplayer-react-user-active': userActivity,
        },
        'cueplayer-react',
        className,
      )}
    >
      {children}
    </div>
  )
})

export default PlayerContainer
