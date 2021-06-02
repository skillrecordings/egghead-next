import * as React from 'react'
import classNames from 'classnames'

const CueBar: React.FC<any> = ({
  className,
  disableCompletely,
  player,
  actions,
}) => {
  const {duration, activeMetadataTracks} = player

  const noteTracks = activeMetadataTracks.filter((track: TextTrack) => {
    return track.label === 'notes'
  })

  const noteCues = noteTracks.reduce((acc: VTTCue[], track: TextTrack) => {
    return [...acc, ...Array.from(track.cues || [])]
  }, [])

  return disableCompletely ? null : (
    <div className={classNames('cueplayer-react-cue-bar', className)}>
      {noteCues.map((noteCue: any) => {
        return (
          <NoteCue
            key={noteCue.text}
            cue={noteCue}
            duration={duration}
            player={player}
            actions={actions}
          />
        )
      })}
    </div>
  )
}

export default CueBar

const useCue = (cue: VTTCue, actions: any) => {
  const setActive = React.useCallback(
    function setActive(active) {
      if (active) {
        actions.activateMetadataTrackCue(cue)
      } else {
        actions.activateMetadataTrackCue(null)
      }
    },
    [actions],
  )

  React.useEffect(() => {
    const enterCue = () => {
      setActive(true)
    }

    const exitCue = () => {
      setActive(false)
    }

    cue.addEventListener('enter', enterCue)
    cue.addEventListener('exit', exitCue)

    return () => {
      cue.removeEventListener('enter', enterCue)
      cue.removeEventListener('exit', exitCue)
    }
  }, [cue, setActive])

  return setActive
}

const CuePopup: React.FC<any> = ({cue, active}) => {
  const note = JSON.parse(cue.text)
  return active ? (
    <div className="cueplayer-react-cue-popup">{note?.title}</div>
  ) : null
}

const NoteCue: React.FC<any> = ({
  cue,
  duration,
  className,
  actions,
  player,
}) => {
  const setActive = useCue(cue, actions)
  const [persist, setPersist] = React.useState(false)
  const active = cue === player.activeMetadataTrackCue
  const startPosition = `${(cue.startTime / duration) * 100}%`

  return (
    <div
      // title={note?.title}
      className={classNames(
        'cueplayer-react-cue-note',
        {
          'cueplayer-react-cue-note-active': active,
          'cueplayer-react-cue-note-inactive': !active,
        },
        className,
      )}
      style={{left: startPosition}}
      onClick={() => {
        if (active && !persist) {
          setPersist(true)
        } else if (active) {
          setActive(false)
          setPersist(false)
        } else {
          setActive(true)
          setPersist(true)
        }
      }}
      onMouseOver={() => setActive(true)}
      onMouseLeave={() => !persist && setActive(false)}
    >
      <CuePopup cue={cue} active={active} />
    </div>
  )
}
