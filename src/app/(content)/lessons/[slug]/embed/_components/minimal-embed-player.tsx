import {HLSSource, useVideo} from '@skillrecordings/player'
import {Bezel} from '@skillrecordings/player/dist/components/bezel'
import {Video} from '@skillrecordings/player/dist/components/video'
import {ProgressBar} from '@skillrecordings/player/dist/components/progress-bar'
import {CueBar} from '@skillrecordings/player/dist/components/cue-bar'
import {ControlBar} from '@skillrecordings/player/dist/components/control-bar'
import {Shortcut} from '@skillrecordings/player/dist/components/shortcut'
import {useAutoHideControls} from '@skillrecordings/player/dist/hooks/use-auto-hide-controls'
import {BigPlayButton} from '@skillrecordings/player/dist/components/big-play-button'
import {LoadingSpinner} from '@skillrecordings/player/dist/components/loading-spinner'
import cx from 'classnames'
import React from 'react'

import {
  selectHasStarted,
  selectIsActive,
  selectIsFullscreen,
  selectWithSidePanel,
  selectIsPaused,
  selectIsSeeking,
  selectIsWaiting,
  selectVideo,
  selectViewer,
} from '@skillrecordings/player/dist/selectors'
import {useSelector} from '@xstate/react'

type PlayerProps = {
  children?: any
  container?: HTMLElement
  className?: string
  fluid?: boolean
  muted?: boolean
  playsInline?: boolean
  preload?: string
  aspectRatio?: string
  width?: string | number
  height?: string | number
  autoPlay?: boolean
  controls?: React.ReactElement
  overlay?: React.ReactElement
  canAddNotes?: boolean
  poster?: string
  enableGlobalShortcuts?: boolean
}

const usePlayerState = () => {
  const videoService = useVideo()
  const hasStarted = useSelector(videoService, selectHasStarted)
  const isActive = useSelector(videoService, selectIsActive)
  const paused = useSelector(videoService, selectIsPaused)

  const isSeeking = useSelector(videoService, selectIsSeeking)
  const isFullscreen = useSelector(videoService, selectIsFullscreen)
  const withSidePanel = useSelector(videoService, selectWithSidePanel)
  const isWaiting = useSelector(videoService, selectIsWaiting)
  const video = useSelector(videoService, selectVideo)

  return {
    videoService,
    isActive,
    hasStarted,
    isSeeking,
    paused,
    isFullscreen,
    withSidePanel,
    isWaiting,
    video,
  }
}

/**
 * The primary player instance. Must be a descendent by a {VideoProvider}.
 * @param props {PlayerProps}
 * @constructor
 */
export const MinimalEmbedPlayer: React.FC<
  React.PropsWithChildren<PlayerProps>
> = (props) => {
  const {
    children,
    controls,
    className,
    container = null,
    fluid = true,
    overlay,
    canAddNotes = false,
    poster,
    enableGlobalShortcuts = true,
  } = props
  const containerRef = React.useRef(container)
  const {
    videoService,
    isActive,
    hasStarted,
    isSeeking,
    paused,
    isFullscreen,
    withSidePanel,
    isWaiting,
    video,
  } = usePlayerState()

  const {controlsHidden, setControlsHidden, setControlsHovered} =
    useAutoHideControls()

  const handleActivity = () => {
    videoService.send('ACTIVITY')
    isFullscreen && setControlsHidden(false)
  }

  function setWidthOrHeight(style: any, name: string, value: string | number) {
    let styleVal
    if (typeof value === 'string') {
      if (value === 'auto') {
        styleVal = 'auto'
      } else if (value.match(/\d+%/)) {
        styleVal = value
      }
    } else if (typeof value === 'number') {
      styleVal = `${value}px`
    }

    Object.assign(style, {
      [name]: styleVal,
    })
  }

  function getAspectRatioStyle() {
    const {
      aspectRatio: propsAspectRatio,
      height: propsHeight,
      width: propsWidth,
    } = props

    const style: any = {}
    let width
    let height
    let aspectRatio

    // The aspect ratio is either used directly or to calculate width and height.
    if (propsAspectRatio !== undefined && propsAspectRatio !== 'auto') {
      // Use any aspectRatio that's been specifically set
      aspectRatio = propsAspectRatio
    } else if (video?.videoWidth) {
      // Otherwise try to get the aspect ratio from the video metadata
      aspectRatio = `${video.videoWidth}:${video.videoHeight}`
    } else {
      // Or use a default. The video element's is 2:1, but 16:9 is more common.
      aspectRatio = '16:9'
    }

    // Get the ratio as a decimal we can use to calculate dimensions
    const ratioParts = aspectRatio.split(':')
    const ratioMultiplier = Number(ratioParts[1]) / Number(ratioParts[0])

    if (propsWidth !== undefined) {
      // Use any width that's been specifically set
      width = propsWidth
    } else if (propsHeight !== undefined) {
      // Or calulate the width from the aspect ratio if a height has been set
      width = Number(propsHeight) / ratioMultiplier
    } else {
      // Or use the video's metadata, or use the video el's default of 300
      width = video?.videoWidth ?? 400
    }

    if (propsHeight !== undefined) {
      // Use any height that's been specifically set
      height = propsHeight
    } else {
      // Otherwise calculate the height from the ratio and the width
      height = Number(width) * ratioMultiplier
    }

    if (fluid) {
      style.paddingTop = `${ratioMultiplier * 100}%`
    } else {
      // If Width contains "auto", set "auto" in style
      setWidthOrHeight(style, 'width', width)
      setWidthOrHeight(style, 'height', height)
    }

    return style
  }

  return (
    <div
      ref={(c) => {
        containerRef.current = container ? container : c
        // creating custom object to avoid circular ref error
        const domNodeRef: any = {
          ...containerRef,
          toJSON() {
            return {}
          },
        }
        videoService.send({
          type: 'SET_ROOT_ELEM',
          rootElemRef: domNodeRef,
        })
      }}
      onMouseDown={handleActivity}
      onMouseMove={handleActivity}
      onKeyDown={handleActivity}
      onPointerMove={() => {
        setControlsHidden(false)
      }}
      className={cx(
        {
          'cueplayer-react-controls-enabled': true,
          'cueplayer-react-has-started': hasStarted,
          'cueplayer-react-paused': paused,
          'cueplayer-react-playing': !paused,
          'cueplayer-react-waiting': isWaiting,
          'cueplayer-react-seeking': isSeeking,
          'cueplayer-react-fluid': fluid,
          'cueplayer-react-fullscreen': isFullscreen,
          'cueplayer-react-with-side-panel': withSidePanel,
          'cueplayer-react-user-inactive': !isActive,
          'cueplayer-react-user-active': isActive,
          'cueplayer-react-workinghover': !IS_IOS,
        },
        'cueplayer-react',
        className,
      )}
    >
      <div
        className={cx('fullscreen-wrapper', {
          fullscreen: isFullscreen,
        })}
      >
        <div className="cueplayer-react-video-wrapper">
          <div
            style={getAspectRatioStyle()}
            className="cueplayer-react-video-holder"
          >
            <Video poster={poster}>{children}</Video>
            <BigPlayButton />
            <Bezel />
            <LoadingSpinner />
          </div>
        </div>
      </div>
      <div
        className={cx('cueplayer-react-controls-holder', {
          'cueplayer-react-controls-holder-auto-hide': controlsHidden,
        })}
        onMouseOver={() => {
          setControlsHovered(true)
        }}
        onMouseOut={() => {
          setControlsHovered(false)
        }}
      >
        <ProgressBar />
        <CueBar />
        {/* <ControlBar>{controls}</ControlBar> */}
        <Shortcut
          enableGlobalShortcuts={enableGlobalShortcuts}
          canAddNotes={canAddNotes}
        />
      </div>
      {overlay}
    </div>
  )
}

const USER_AGENT =
  typeof window !== 'undefined' && window.navigator
    ? window.navigator.userAgent
    : ''

export const IS_IPAD = /iPad/i.test(USER_AGENT)
export const IS_IPHONE = /iPhone/i.test(USER_AGENT) && !IS_IPAD
export const IS_IPOD = /iPod/i.test(USER_AGENT)
export const IS_IOS = IS_IPHONE || IS_IPAD || IS_IPOD
