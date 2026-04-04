'use client'

import * as React from 'react'
import MuxPlayer, {type MuxPlayerRefAttributes} from '@mux/mux-player-react'
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
  const [playbackRate, setPlaybackRate] = React.useState<number>(
    getPlayerPrefs().playbackRate || 1,
  )
  const [captionsAvailable, setCaptionsAvailable] = React.useState(false)
  const [captionsEnabled, setCaptionsEnabled] = React.useState(
    getPlayerPrefs().subtitle?.label !== 'off',
  )
  const {src, muxChildren} = React.useMemo(
    () => getSourceAndChildren(children),
    [children],
  )

  React.useEffect(() => {
    sendRef.current = send
  }, [send])

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

      setCaptionsAvailable(subtitles.length > 0)

      const activeSubtitle = subtitles.find((track) => track.mode === 'showing')

      setCaptionsEnabled(Boolean(activeSubtitle))

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

    return () => {
      player.textTracks?.removeEventListener?.('change', handleTextTrackChange)
    }
  }, [src])

  const handlePlaybackRateChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const nextPlaybackRate = Number(event.target.value)
    setPlaybackRate(nextPlaybackRate)

    if (muxPlayerRef.current) {
      muxPlayerRef.current.playbackRate = nextPlaybackRate
    }

    savePlayerPrefs({playbackRate: nextPlaybackRate})
  }

  const handleCaptionsToggle = () => {
    const player = muxPlayerRef.current as any
    if (!player?.textTracks) return

    const subtitles = Array.from(player.textTracks || []).filter((track: any) =>
      ['subtitles', 'captions'].includes(track.kind),
    ) as TextTrack[]

    if (!subtitles.length) return

    const nextEnabled = !captionsEnabled

    subtitles.forEach((track, index) => {
      track.mode = nextEnabled && index === 0 ? 'showing' : 'disabled'
    })

    setCaptionsEnabled(nextEnabled)

    const activeSubtitle = nextEnabled ? subtitles[0] : null

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

  return (
    <div className={cx('relative h-full w-full bg-black', className)}>
      <MuxPlayer
        ref={muxPlayerRef}
        className="h-full w-full"
        streamType="on-demand"
        playbackRates={[0.75, 1, 1.25, 1.5, 1.75, 2]}
        src={src}
        poster={poster}
        defaultHiddenCaptions={getPlayerPrefs().subtitle?.label === 'off'}
        onPlay={() => {
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
      <div className="absolute left-3 top-3 z-10 flex items-center gap-2">
        <label className="rounded bg-black/70 px-2 py-1 text-xs font-medium text-white backdrop-blur">
          <span className="mr-2">Speed</span>
          <select
            value={String(playbackRate)}
            onChange={handlePlaybackRateChange}
            className="bg-transparent text-white outline-none"
          >
            {[0.75, 1, 1.25, 1.5, 1.75, 2].map((rate) => (
              <option key={rate} value={rate} className="text-black">
                {rate}×
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={handleCaptionsToggle}
          disabled={!captionsAvailable}
          className={cx(
            'rounded px-2 py-1 text-xs font-medium text-white backdrop-blur',
            {
              'bg-blue-600/80': captionsEnabled && captionsAvailable,
              'bg-black/70': !captionsEnabled && captionsAvailable,
              'cursor-not-allowed bg-black/40 text-white/50':
                !captionsAvailable,
            },
          )}
        >
          CC
        </button>
      </div>
      {controls ? (
        <div className="absolute right-3 top-3 z-10">{controls}</div>
      ) : null}
    </div>
  )
}
