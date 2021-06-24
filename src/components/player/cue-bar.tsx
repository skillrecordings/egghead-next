import * as React from 'react'
import classNames from 'classnames'
import {isEmpty} from 'lodash'
import Tippy from '@tippyjs/react'
import {scroller} from 'react-scroll'
import {useEggheadPlayerPrefs} from 'components/EggheadPlayer/use-egghead-player'
import ReactMarkdown from 'react-markdown'

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

  return disableCompletely || isEmpty(noteCues) ? null : (
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

const MutePopupButton: React.FC<any> = () => {
  const {setPlayerPrefs, getPlayerPrefs} = useEggheadPlayerPrefs()
  const {muteNotes} = getPlayerPrefs()
  return (
    <button
      className="text-gray-400 rounded flex-nowrap flex items-center text-xs"
      onClick={() => setPlayerPrefs({muteNotes: !muteNotes})}
    >
      {muteNotes ? <IconVolumeOn /> : <IconVolumeOff />}
    </button>
  )
}

const NoteCue: React.FC<any> = ({
  cue,
  duration,
  className,
  actions,
  player,
}) => {
  const {setPlayerPrefs, getPlayerPrefs} = useEggheadPlayerPrefs()
  const [visible, setVisible] = React.useState(false)
  const {muteNotes} = getPlayerPrefs()

 // console.log('muteNotes: ', muteNotes)

  useCue(cue, actions)

  const open = () => {
    setVisible(true)
    // if we seek to the correct time, the note is displayed
    actions.seek(cue.startTime)
  }

  const close = () => {
    setVisible(false)
  }

  React.useEffect(() => {
    if (!muteNotes) {
      // don't automatically pop if muted
      setVisible(
        player.activeMetadataTrackCues.includes(cue) && !player.seeking,
      )
      setPlayerPrefs({activeSidebarTab: 1})
    }
  }, [player.activeMetadataTrackCues, player.seeking, cue, muteNotes])

  // added seeking to the list here but getting some janky perf issues

  const startPosition = `${(cue.startTime / duration) * 100}%`
  const note = cue.text

  React.useEffect(() => {
    if (visible) {
      setPlayerPrefs({activeSidebarTab: 1})
      scroller.scrollTo('active-note', {
        duration: 0,
        delay: 0,
        offset: -12,
        containerId: 'notes-tab-scroll-container',
      })
    }
  }, [visible, setPlayerPrefs])

  return (
    <Tippy
      placement="top"
      theme="light"
      maxWidth={300}
      appendTo="parent"
      offset={[0, 30]}
      interactive={true}
      content={
        <div className="p-2">
          <div className="flex justify-end space-x-2">
            <MutePopupButton />
            <button
              className="text-gray-400 rounded flex-nowrap flex items-center text-xs"
              onClick={close}
            >
              <IconX />
            </button>
          </div>
          <div className="line-clamp-6 prose-sm prose leading-normal">
            <ReactMarkdown>{note}</ReactMarkdown>
          </div>
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

const IconVolumeOff: React.FC<any> = ({className}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      className={`w-5 h-5 ${className ?? ''}`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
        clipRule="evenodd"
      ></path>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
      ></path>
    </svg>
  )
}

const IconVolumeOn: React.FC<any> = ({className}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      className={`w-5 h-5 ${className ?? ''}`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
      ></path>
    </svg>
  )
}

const IconX: React.FC<any> = ({className}) => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-5 h-5 ${className ?? ''}`}
  >
    <g fill="none">
      <path
        d="M6 18L18 6M6 6l12 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </svg>
)
