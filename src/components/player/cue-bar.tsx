import * as React from 'react'
import classNames from 'classnames'

const CueBar: React.FC<any> = ({className, disableCompletely, player}) => {
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
        return <NoteCue key={noteCue.text} cue={noteCue} duration={duration} />
      })}
    </div>
  )
}

export default CueBar

const useCue = (cue: VTTCue) => {
  const [active, setActive] = React.useState<any>(false)
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
  }, [cue])

  return [active, setActive]
}

const CuePopup: React.FC<any> = ({cue, active}) => {
  const note = JSON.parse(cue.text)
  return active ? (
    <div
      className="absolute w-40 min-h-[4rem] rounded-md bg-white p-3 text-xs top-0 left-0 z-10 text-black border border-gray-400"
      css={{
        transform:
          'translateX(calc(-50% + 3px)) translateY(calc(-100% - 15px))',
        ':before': {
          content: '""',
          position: 'absolute',
          bottom: '-10px',
          left: 'calc(50% - 10px)',
          width: 0,
          height: 0,
          borderStyle: 'solid',
          borderWidth: '10px 10px 0 10px',
          borderColor: '#ffffff transparent transparent transparent',
        },
      }}
    >
      {note?.title}
    </div>
  ) : null
}

const NoteCue: React.FC<any> = ({cue, duration, className}) => {
  const [active, setActive] = useCue(cue)
  const [persist, setPersist] = React.useState(false)

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
