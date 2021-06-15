import * as React from 'react'
import classNames from 'classnames'
import Tippy from '@tippyjs/react'
import TruncateMarkup from 'react-truncate-markup'

const CueBar: React.FC<any> = ({
  className,
  disableCompletely,
  player,
  actions,
  onClickCue,
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
            onClickCue={onClickCue}
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

const NoteCue: React.FC<any> = ({
  cue,
  duration,
  className,
  actions,
  player,
  onClickCue,
}) => {
  const setVisible = useCue(cue, actions)
  const [persist, setPersist] = React.useState(false)
  const show = () => setVisible(true)
  const hide = () => setVisible(false)
  const open = () => {
    show()
    setPersist(true)
    onClickCue()
  }
  const close = () => {
    hide()
    setPersist(false)
  }
  const visible = cue === player.activeMetadataTrackCue
  const startPosition = `${(cue.startTime / duration) * 100}%`
  const note = JSON.parse(cue.text)

  return (
    <Tippy
      placement="top"
      theme="light"
      maxWidth={800}
      appendTo="parent"
      content={
        <div className="p-2">
          {note.title && (
            <span className="pb-2 font-semibold inline-block">
              {note.title}
            </span>
          )}
          <TruncateMarkup lines={2}>
            <div>{note.description}</div>
          </TruncateMarkup>
          {/* <ReactMarkdown className="prose prose-sm dark:prose-dark max-w-none"> */}
          {/* {note.description}</div> */}
          {/* {truncate(note.description, {length: 220, separator: '...'})} */}
          {/* </ReactMarkdown> */}
        </div>
      }
      visible={visible}
      onClickOutside={close}
    >
      <div
        onMouseOver={show}
        onClick={open}
        onMouseOut={() => !persist && hide()}
        className={classNames(
          'cueplayer-react-cue-note',
          {
            'cueplayer-react-cue-note-active': visible,
            'cueplayer-react-cue-note-inactive': !visible,
          },
          className,
        )}
        style={{left: startPosition}}
      />
    </Tippy>
  )
}
