import * as React from 'react'
import classNames from 'classnames'
import {isEmpty} from 'lodash'
import Tippy from '@tippyjs/react'
import {scroller} from 'react-scroll'
import {useEggheadPlayerPrefs} from 'components/EggheadPlayer/use-egghead-player'
import ReactMarkdown from 'react-markdown'
import {track} from 'utils/analytics'
import {useNotesCues} from './index'
import CodeBlock from 'components/code-block'

const CueBar: React.FC<any> = ({
  className,
  disableCompletely,
  player,
  actions,
}) => {
  const {duration} = player

  const {cues} = useNotesCues()

  return disableCompletely || isEmpty(cues) ? null : (
    <div className={classNames('cueplayer-react-cue-bar', className)}>
      {cues.map((noteCue: any) => {
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
      console.debug('enter cue')
      setActive(true)
    }

    const exitCue = () => {
      console.debug('exit cue')
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
      onClick={() => {
        track('muted note popup')
        setPlayerPrefs({muteNotes: !muteNotes})
      }}
    >
      {muteNotes ? (
        <>
          <span className="pr-1">unmute notes</span>
          <IconVolumeOff />
        </>
      ) : (
        <>
          <span className="pr-1">mute notes</span>
          <IconVolumeOn />
        </>
      )}
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
  const [clickedOpen, setClickedOpen] = React.useState(false)
  const {muteNotes} = getPlayerPrefs()

  useCue(cue, actions)

  const clickOpen = () => {
    setVisible(true)
    setClickedOpen(true)
    // if we seek to the correct time, the note is displayed
    actions.seek(cue.startTime)
    actions.pause()
    track('opened cue', {cue: cue.text})
    !muteNotes && setPlayerPrefs({activeSidebarTab: 1})
  }

  const clickClose = () => {
    setClickedOpen(false)
    setVisible(false)
  }

  const cueActive = player.activeMetadataTrackCues.includes(cue)
  const seeking = player.seeking
  const playerReadyEnough = player.readyState > 0

  React.useEffect(() => {
    const isVisible = !muteNotes && cueActive && !seeking && playerReadyEnough
    if (!clickedOpen) {
      setVisible(isVisible)
    }
  }, [
    setPlayerPrefs,
    clickedOpen,
    cueActive,
    seeking,
    muteNotes,
    playerReadyEnough,
  ])

  // added seeking to the list here but getting some janky perf issues

  const startPosition = `${(cue.startTime / duration) * 100}%`
  const note = cue.text

  React.useEffect(() => {
    if (visible) {
      scroller.scrollTo('active-note', {
        duration: 0,
        delay: 0,
        offset: -16,
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
        <div className="py-1">
          <div className="flex justify-end space-x-2">
            <MutePopupButton />
            <button
              className="text-gray-400 rounded flex-nowrap flex items-center text-xs"
              onClick={clickClose}
            >
              <IconX />
            </button>
          </div>
          <div className="line-clamp-6 prose-sm prose leading-normal">
            <ReactMarkdown
              renderers={{
                code: (props) => {
                  return <CodeBlock {...props} />
                },
              }}
            >
              {note}
            </ReactMarkdown>
          </div>
        </div>
      }
      visible={visible}
      onClickOutside={clickClose}
    >
      <div
        onClick={clickOpen}
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
      className={`w-4 h-4 ${className ?? ''}`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
        clipRule="evenodd"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
      />
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
      className={`w-4 h-4 ${className ?? ''}`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
      />
    </svg>
  )
}

const IconX: React.FC<any> = ({className}) => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-4 h-4 ${className ?? ''}`}
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
