import * as React from 'react'
import classNames from 'classnames'
import Tippy from '@tippyjs/react'
import {useEggheadPlayerPrefs} from 'components/EggheadPlayer/use-egghead-player'

const CueBar: React.FC<any> = ({
  className,
  disableCompletely,
  player,
  actions,
  scroller,
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
            scroller={scroller}
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
        actions.deactivateMetadataTrackCue(cue)
      }
    },
    [actions, cue],
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
  scroller,
}) => {
  const playerPrefs = useEggheadPlayerPrefs()
  const setVisible = useCue(cue, actions)

  const open = () => {
    setVisible(true)
    // if we seek to the correct time, the note is displayed
    actions.seek(cue.startTime)
  }

  const close = () => {
    setVisible(false)
  }

  // added seeking to the list here but getting some janky perf issues
  const visible =
    player.activeMetadataTrackCues.includes(cue) && !player.seeking
  const startPosition = `${(cue.startTime / duration) * 100}%`
  const note = JSON.parse(cue.text)

  React.useEffect(() => {
    if (visible) {
      playerPrefs.setPlayerPrefs({sideBar: {activeTab: 0}})
      scroller.scrollTo('active-note', {
        duration: 0,
        delay: 0,
        offset: -12,
        containerId: 'notes-tab-scroll-container',
      })
    }
  }, [visible])

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
          <div className="line-clamp-2">{note.description}</div>
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
        onClick={open}
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
