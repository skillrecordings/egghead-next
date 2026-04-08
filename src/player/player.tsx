'use client'

import * as React from 'react'
import MuxPlayer, {type MuxPlayerRefAttributes} from '@mux/mux-player-react'
import {MinResolution} from '@mux/playback-core'
import cx from 'classnames'
import {
  getPlayerPrefs,
  savePlayerPrefs,
} from '@/components/EggheadPlayer/use-egghead-player'
import {useVideo} from './context'
import {HLSSource} from './hls-source'

type PlayerProps = {
  children?: React.ReactNode
  className?: string
  controls?: React.ReactElement
  poster?: string
  canAddNotes?: boolean
  container?: HTMLElement
}

const isHLSSourceElement = (
  child: React.ReactNode,
): child is React.ReactElement<{src: string}> => {
  return (
    React.isValidElement(child) &&
    (child.type as any)?.__playerSource === (HLSSource as any).__playerSource
  )
}

const getSourceAndChildren = (children: React.ReactNode) => {
  let src: string | undefined
  const muxChildren: React.ReactNode[] = []

  React.Children.forEach(children, (child) => {
    if (isHLSSourceElement(child)) {
      src = child.props.src
      return
    }

    if (child !== null && child !== undefined) {
      muxChildren.push(child)
    }
  })

  return {src, muxChildren}
}

export const Player: React.FC<React.PropsWithChildren<PlayerProps>> = ({
  children,
  className,
  controls,
  poster,
}) => {
  const {send, setState} = useVideo()
  const sendRef = React.useRef(send)
  const muxPlayerRef = React.useRef<MuxPlayerRefAttributes | null>(null)
  const [hasStartedPlayback, setHasStartedPlayback] = React.useState(false)
  const {src, muxChildren} = React.useMemo(
    () => getSourceAndChildren(children),
    [children],
  )

  React.useEffect(() => {
    sendRef.current = send
  }, [send])

  const setInitialControlVisibility = React.useCallback(
    (shouldStayVisible: boolean) => {
      const mediaController = (muxPlayerRef.current as any)?.shadowRoot?.querySelector(
        'media-controller',
      ) as HTMLElement | null

      if (!mediaController) return

      if (shouldStayVisible) {
        mediaController.setAttribute('noautohide', '')
      } else {
        mediaController.removeAttribute('noautohide')
      }
    },
    [],
  )

  React.useEffect(() => {
    if (!muxPlayerRef.current) return

    sendRef.current({type: 'SET_VIDEO', video: muxPlayerRef.current})

    const player = muxPlayerRef.current as any
    const applyPrefs = () => {
      const prefs = getPlayerPrefs()

      if (typeof prefs.playbackRate === 'number') {
        player.playbackRate = prefs.playbackRate
      }

      if (typeof prefs.muted === 'boolean') {
        player.muted = prefs.muted
      }

      if (typeof prefs.volumeRate === 'number') {
        player.volume = Math.max(0, Math.min(1, prefs.volumeRate / 100))
      }

      const metadataTracks = Array.from(player.textTracks || []).filter(
        (track: any) => track.kind === 'metadata',
      ) as TextTrack[]
      sendRef.current({type: 'SET_METADATA_TRACKS', metadataTracks})

      if (prefs.subtitle?.id && prefs.subtitle?.label !== 'off') {
        const preferredTrack = Array.from(player.textTracks || []).find(
          (track: any) => track.id === prefs.subtitle.id,
        ) as TextTrack | undefined

        if (preferredTrack) {
          preferredTrack.mode = 'showing'
        }
      }
    }

    const handleTextTrackChange = () => {
      const subtitles = Array.from(player.textTracks || []).filter(
        (track: any) => ['subtitles', 'captions'].includes(track.kind),
      ) as TextTrack[]

      const activeSubtitle = subtitles.find((track) => track.mode === 'showing')

      savePlayerPrefs({
        subtitle: activeSubtitle
          ? {
              id: (activeSubtitle as any).id ?? null,
              kind: activeSubtitle.kind ?? null,
              label: activeSubtitle.label ?? null,
              language:
                (activeSubtitle as any).language ??
                activeSubtitle.language ??
                null,
            }
          : {
              id: null,
              kind: null,
              label: 'off',
              language: null,
            },
      })
    }

    applyPrefs()
    handleTextTrackChange()
    player.textTracks?.addEventListener?.('change', handleTextTrackChange)
    setInitialControlVisibility(!hasStartedPlayback)

    return () => {
      player.textTracks?.removeEventListener?.('change', handleTextTrackChange)
    }
  }, [hasStartedPlayback, setInitialControlVisibility, src])

  React.useEffect(() => {
    setHasStartedPlayback(false)
  }, [src])

  return (
    <div className={cx('relative h-full w-full bg-black', className)}>
      <MuxPlayer
        ref={muxPlayerRef}
        className="h-full w-full"
        streamType="on-demand"
        playbackRates={[0.75, 1, 1.25, 1.5, 1.75, 2]}
        minResolution={MinResolution.noLessThan720p}
        src={src}
        poster={poster}
        defaultHiddenCaptions={getPlayerPrefs().subtitle?.label === 'off'}
        onPlay={() => {
          setHasStartedPlayback(true)
          setInitialControlVisibility(false)
          send({type: 'PLAY', source: 'player'})
        }}
        onPause={() => {
          setState((prev) => ({...prev, isPaused: true}))
        }}
        onEnded={() => {
          send({type: 'END'})
        }}
        onWaiting={() => {
          send({type: 'WAITING'})
        }}
        onPlaying={() => {
          send({type: 'DONE_WAITING'})
        }}
        onLoadedData={() => {
          const player = muxPlayerRef.current as any
          const prefs = getPlayerPrefs()

          if (player) {
            if (typeof prefs.playbackRate === 'number') {
              player.playbackRate = prefs.playbackRate
            }

            if (typeof prefs.muted === 'boolean') {
              player.muted = prefs.muted
            }

            if (typeof prefs.volumeRate === 'number') {
              player.volume = Math.max(0, Math.min(1, prefs.volumeRate / 100))
            }

            const metadataTracks = Array.from(player.textTracks || []).filter(
              (track: any) => track.kind === 'metadata',
            ) as TextTrack[]

            const preferredTrack = Array.from(player.textTracks || []).find(
              (track: any) => track.id === prefs.subtitle?.id,
            ) as TextTrack | undefined

            if (preferredTrack && prefs.subtitle?.label !== 'off') {
              preferredTrack.mode = 'showing'
            }

            sendRef.current({type: 'SET_METADATA_TRACKS', metadataTracks})
          }

          setInitialControlVisibility(!hasStartedPlayback)

          setState((prev) => ({
            ...prev,
            isPaused: Boolean(muxPlayerRef.current?.paused ?? true),
            isWaiting: false,
          }))
        }}
        onRateChange={() => {
          savePlayerPrefs({
            playbackRate: muxPlayerRef.current?.playbackRate ?? 1,
          })
        }}
        onVolumeChange={() => {
          savePlayerPrefs({
            volumeRate: Math.round((muxPlayerRef.current?.volume ?? 1) * 100),
            muted: Boolean(muxPlayerRef.current?.muted),
          })
        }}
      >
        {muxChildren}
      </MuxPlayer>
      {controls ? (
        <div className="absolute right-3 top-3 z-10">{controls}</div>
      ) : null}
    </div>
  )
}
