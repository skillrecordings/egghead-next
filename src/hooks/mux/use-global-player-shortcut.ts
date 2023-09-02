import React from 'react'
import get from 'lodash/get'
import {type MuxPlayerRefAttributes} from '@mux/mux-player-react'

const ignoredInputs = ['input', 'select', 'button', 'textarea', 'mux-player']

export const useGlobalPlayerShortcuts = (
  muxPlayerRef: React.RefObject<MuxPlayerRefAttributes>,
) => {
  const handleUserKeyPress = React.useCallback(
    (e: any) => {
      const activeElement = document.activeElement
      const isContentEditable = get(activeElement, 'contentEditable') === 'true'

      if (
        activeElement &&
        ignoredInputs.indexOf(activeElement.tagName.toLowerCase()) === -1 &&
        !isContentEditable
      ) {
        if (muxPlayerRef.current) {
          if (e.key === ' ') {
            e.preventDefault()
            muxPlayerRef.current.paused
              ? muxPlayerRef.current.play()
              : muxPlayerRef.current.pause()
          }
          if (e.key === 'ArrowRight') {
            e.preventDefault()
            muxPlayerRef.current.currentTime =
              muxPlayerRef.current.currentTime +
              (muxPlayerRef.current.forwardSeekOffset || 10)
          }
          if (e.key === 'ArrowLeft') {
            e.preventDefault()
            muxPlayerRef.current.currentTime =
              muxPlayerRef.current.currentTime -
              (muxPlayerRef.current.forwardSeekOffset || 10)
          }
          if (e.key === 'f' && !e.metaKey && !e.ctrlKey) {
            e.preventDefault()
            document.fullscreenElement
              ? document.exitFullscreen()
              : muxPlayerRef.current.requestFullscreen()
          }
        }
      }
    },
    [muxPlayerRef],
  )

  React.useEffect(() => {
    window.document?.addEventListener('keydown', handleUserKeyPress)
    return () => {
      window.document?.removeEventListener('keydown', handleUserKeyPress)
    }
  }, [handleUserKeyPress])
}
