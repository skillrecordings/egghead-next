import * as React from 'react'
import classNames from 'classnames'
import {isEqual} from 'lodash'

export default class CueBar extends React.Component<any> {
  state: any = {cues: []}
  constructor(props: any) {
    super(props)
    this.state = {cues: this.getTextTrackItems(), currentCuePopup: null}
  }

  componentDidMount() {
    // this.getTextTrackItems()
  }

  componentDidUpdate() {
    this.updateState()
  }

  setCurrentCuePopup(popup: string | null) {
    this.setState({...this.state, currentCuePopup: popup})
  }

  getTextTrackItems() {
    const {kinds = ['metadata'], player} = this.props as any
    const {textTracks} = player
    const textTrackItems: any = {}
    const tracks = Array.from(textTracks || [])

    if (tracks.length === 0) {
      return textTrackItems
    }

    tracks.forEach((textTrack: any) => {
      // ignore invalid text track kind
      if (kinds.length && !kinds.includes(textTrack.kind)) {
        return
      }

      textTrack.mode = 'showing'
      textTrackItems[textTrack.label] = Array.from(textTrack.cues) || []
    })

    return textTrackItems
  }

  updateState() {
    const textTrackItems = this.getTextTrackItems()
    if (!isEqual(this.state.cues, textTrackItems)) {
      console.log({cues: textTrackItems})
      this.setState({cues: textTrackItems})
    }
  }

  render() {
    console.log('this.state: ', this.state)
    const {className, disableCompletely, children, player} = this.props as any
    const {duration} = player

    return disableCompletely ? null : (
      <div className={classNames('cueplayer-react-cue-bar', className)}>
        {this.state?.cues?.notes?.map((noteCue: any) => {
          return (
            <NoteCue
              key={noteCue.text}
              cue={noteCue}
              duration={duration}
              currentCuePopup={this.state.currentCuePopup}
              setCurrentCuePopup={this.setCurrentCuePopup.bind(this)}
            />
          )
        })}
      </div>
    )
  }
}

const CuePopup: React.FC<any> = ({note, popupPersists, currentCuePopup}) => {
  return note?.title === currentCuePopup || popupPersists ? (
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

const NoteCue: React.FC<any> = ({
  cue,
  duration,
  className,
  currentCuePopup,
  setCurrentCuePopup,
}) => {
  const note = JSON.parse(cue.text)
  const [active, setActive] = React.useState(false)
  const [popupIsShown, setPopupIsShowing] = React.useState(false)
  const [popupPersists, setPopupPersists] = React.useState(false)
  console.log('popupPersists: ', popupPersists)

  const startPosition = `${(cue.startTime / duration) * 100}%`

  React.useEffect(() => {
    const enterCue = () => {
      setActive(true)
      console.log(note)
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
        setCurrentCuePopup(
          note?.title === currentCuePopup && popupPersists ? null : note?.title,
        )
        setPopupPersists(!popupPersists)
      }}
      onMouseOver={() => setCurrentCuePopup(note?.title)}
      onMouseLeave={() =>
        setCurrentCuePopup(
          note?.title === currentCuePopup && popupPersists ? note?.title : null,
        )
      }
    >
      <CuePopup
        note={note}
        popupPersists={popupPersists}
        currentCuePopup={currentCuePopup}
      />
    </div>
  )
}
