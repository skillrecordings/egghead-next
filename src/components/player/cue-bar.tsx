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
