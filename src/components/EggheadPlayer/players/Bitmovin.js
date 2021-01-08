import React from 'react'
import loadScript from 'load-script'
import get from 'lodash/get'

import Base from './Base'

import {track} from 'utils/analytics'
import {savePlayerPrefs} from '../use-egghead-player'

const SDK_URL = '//cdn.bitmovin.com/player/web/8/bitmovinplayer.js'
const SDK_GLOBAL = 'bitmovin'
const BITMOVIN_PUBLIC_KEY = 'b8b63d1d-d00d-4a79-9e21-6a4694dd95b3'
const BITMOVIN_CHROMECAST_STYLESHEET_URL =
  'https://d2eip9sf3oo6c2.cloudfront.net/receiver.css'
const MATCH_URL = /^(https?:\/\/d2c5owlt6rorc3.cloudfront.net\/)(.[^/]*)\/(.*)$/
const SUBTITLE_ID = 'eh-subtitles'
const HIGHEST_BITRATE = 2400000
const AUTO_BITRATE = 'auto'
const SEEK_BACK = -10
const SEEK_FORWARD = 25
const MAX_BUFFER_LEVEL_SECONDS = 240
const STARTUP_THRESHOLD_SECONDS = 3
const ALLOW_PLAYBACK_SPEED = true

export default class Bitmovin extends Base {
  static displayName = 'Bitmovin'

  id = 'egghead-player'
  key = null
  constructor(props) {
    super(props)
    const url = props.dash_url || props.hls_url || props.wistia_url
    this.key = url && url.match(MATCH_URL)[2]
  }

  static canPlay(url) {
    return MATCH_URL.test(url)
  }

  nearestBitRate = (arr, val) =>
    arr.reduce((nearestBitrate, nextBitrate) => {
      const currentBitrateDelta = Math.abs(nearestBitrate.bitrate - val)
      const nextBitrateDelta = Math.abs(nextBitrate.bitrate - val)
      return currentBitrateDelta > nextBitrateDelta
        ? nextBitrate
        : nearestBitrate
    })

  onVideoAdaptation = (e) => {
    const {videoQualityCookie} = this.props
    const nearestBitrateId = this.nearestBitRate(
      this.player.getAvailableVideoQualities(),
      get(videoQualityCookie, 'bitrate', HIGHEST_BITRATE),
    ).id

    return nearestBitrateId ? nearestBitrateId : AUTO_BITRATE
  }

  getSource(props) {
    const {
      dash_url,

      hls_url,
    } = props || this.props

    return {
      dash: dash_url,
      hls: hls_url,
    }
  }

  getConfig(props) {
    const {
      poster,
      title,
      description,
      preload,
      onPlaybackRateChange,
      onVolumeChange,
      muted,
    } = props || this.props
    return {
      key: BITMOVIN_PUBLIC_KEY,
      remotecontrol: {
        type: 'googlecast',
        customReceiverConfig: {
          receiverStylesheetUrl: BITMOVIN_CHROMECAST_STYLESHEET_URL,
        },
      },
      ui: {
        playbackSpeedSelectionEnabled: ALLOW_PLAYBACK_SPEED,
      },
      title,
      description,
      poster: poster,
      playback: {
        restoreUserSettings: true,
        muted,
      },
      cast: {
        enable: true,
      },
      tweaks: {
        autoqualityswitching: false,
        startup_threshold: STARTUP_THRESHOLD_SECONDS,
        max_buffer_level: MAX_BUFFER_LEVEL_SECONDS,
      },
      adaptation: {
        desktop: {preload: preload},
        mobile: {preload: preload},
      },
      events: {
        playbackspeedchanged: (e) => {
          track('set played speed', {
            speed: e.to,
          })
          onPlaybackRateChange(e.to)
        },
        volumechanged: (e) => {
          onVolumeChange(e.targetVolume)
        },
        stallstarted: () => {
          track('video stall started')
        },
        stallended: () => {
          track('video stall ended')
        },
        unmuted: () => {
          savePlayerPrefs({muted: false})
        },
        muted: () => {
          savePlayerPrefs({muted: true})
        },
      },
    }
  }

  addSubtitles = (subtitlesUrl) => {
    this.player.subtitles.add({
      id: SUBTITLE_ID,
      url: subtitlesUrl,
      label: 'English',
      lang: 'en',
    })

    if (this.props.displaySubtitles) {
      this.player.subtitles.enable(SUBTITLE_ID)
    } else {
      this.player.subtitles.disable()
    }
  }

  handleArrowPress = (e) => {
    const LEFT = 37,
      RIGHT = 39
    const currentTime = this.player.getCurrentTime()
    const duration = this.getDuration()
    const seekToDelta = (delta) => this.seekTo((currentTime + delta) / duration)
    switch (e.keyCode) {
      case LEFT:
        seekToDelta(SEEK_BACK)
        break
      case RIGHT:
        seekToDelta(SEEK_FORWARD)
        break
    }
  }

  containerListenForPlay = (event) => {
    if (this.player && event.keyCode == 32) {
      if (this.player.isPlaying()) {
        this.player.pause()
      } else {
        this.player.play()
      }
    }
  }

  componentDidMount() {
    const {subtitlesUrl, playbackRate, volume} = this.props
    this.startTime = this.getTimeToSeekSeconds()
    this.loadingSDK = true

    this.getSDK().then((script) => {
      this.loadingSDK = false
      this.player = new window.bitmovin.player.Player(
        document.getElementById(this.id),
        this.getConfig(),
      )

      this.player.load(this.getSource()).then(
        () => {
          this.player.setPlaybackSpeed(playbackRate)
          this.player.setVolume(volume)
          this.player.setPosterImage(this.props.poster)

          const {videoQualityCookie} = this.props
          if (videoQualityCookie) {
            this.player.setVideoQuality(videoQualityCookie.id)
          }

          if (subtitlesUrl) {
            this.addSubtitles(subtitlesUrl)
          }
          this.addEventListeners()
          this.container.focus()
          this.onReady(this.player)
        },
        (reason) => {
          throw `Error while creating bitdash player instance, ${reason}`
        },
      )
    })
  }

  componentWillUnmount() {
    if (this.player) {
      this.removeListeners()
      this.player.destroy()
    }
  }

  getSDK() {
    return new Promise((resolve, reject) => {
      if (window[SDK_GLOBAL]) {
        resolve()
      } else {
        loadScript(SDK_URL, {async: false}, (err, script) => {
          if (err) reject(err)
          resolve(script)
        })
      }
    })
  }

  addEventListeners() {
    const {
      onPause,
      onEnded,
      onError,
      onPlayerProgress,
      onSubtitleChange,
      onVideoQualityChanged,
      onMuted,
    } = this.props

    this.player.on(this.player.exports.PlayerEvent.Play, this.onPlay)
    this.player.on(this.player.exports.PlayerEvent.Paused, onPause)
    this.player.on(this.player.exports.PlayerEvent.Error, onError)
    this.player.on(this.player.exports.PlayerEvent.PlaybackFinished, onEnded)
    this.player.on(this.player.exports.PlayerEvent.Muted, onMuted)
    this.player.on(
      this.player.exports.PlayerEvent.VideoAdaptation,
      this.onVideoAdaptation,
    )
    this.player.on(
      this.player.exports.PlayerEvent.VideoQualityChanged,
      onVideoQualityChanged,
    )
    this.player.on(
      this.player.exports.PlayerEvent.TimeChanged,
      onPlayerProgress,
    )
    this.player.on(
      this.player.exports.PlayerEvent.SubtitleChanged,
      onSubtitleChange,
    )
    document.addEventListener('keydown', this.handleArrowPress, false)
    this.container.addEventListener('keypress', this.containerListenForPlay)
  }

  removeListeners() {
    const {
      onPause,
      onEnded,
      onError,
      onPlayerProgress,
      onSubtitleChange,
      onVideoQualityChanged,
      onMuted,
    } = this.props
    this.player.off(this.player.exports.PlayerEvent.Play, this.onPlay)
    this.player.off(this.player.exports.PlayerEvent.Paused, onPause)
    this.player.off(this.player.exports.PlayerEvent.Error, onError)
    this.player.off(
      this.player.exports.PlayerEvent.VideoAdaptation,
      this.onVideoAdaptation,
    )
    this.player.off(
      this.player.exports.PlayerEvent.VideoQualityChanged,
      onVideoQualityChanged,
    )
    this.player.off(this.player.exports.PlayerEvent.PlaybackFinished, onEnded)
    this.player.off(
      this.player.exports.PlayerEvent.TimeChanged,
      onPlayerProgress,
    )
    this.player.off(
      this.player.exports.PlayerEvent.SubtitleChanged,
      onSubtitleChange,
    )
    this.player.off(this.player.exports.PlayerEvent.Muted, onMuted)
    document.removeEventListener('keydown', this.handleArrowPress)
    this.container.removeEventListener('keypress', this.containerListenForPlay)
  }

  load(nextProps) {
    if (this.isReady) {
      this.removeListeners()

      this.player.load(this.getSource(nextProps)).then(
        () => {
          this.player.subtitles.remove(SUBTITLE_ID)
          this.player.setPosterImage(nextProps.poster)
          if (nextProps.subtitlesUrl) {
            this.player.subtitles.add({
              id: SUBTITLE_ID,
              url: nextProps.subtitlesUrl,
              label: 'English',
              lang: 'en',
              kind: 'captions',
            })
          }
          this.addEventListeners()
          this.props.onReady(this.player)
          this.onReady(this.player)
        },
        (error) => {
          console.log('Bitmovin player failed to load')
          console.log(error)
        },
      )
    }
  }

  play() {
    if (!this.isReady || !this.player) return
    this.player.play()
  }

  pause() {
    if (!this.isReady || !this.player) return
    this.player && this.player.pause()
  }

  stop() {
    if (!this.isReady || !this.player) return
    this.player.pause()
  }

  seekTo(fraction) {
    super.seekTo(fraction)
    if (!this.isReady || !this.player) return
    this.player.seek(this.getDuration() * fraction)
  }

  getCurrentTime() {
    if (!this.player) return null
    const duration = this.getDuration()
    const fractionPlayed = this.getFractionPlayed()
    if (duration === null || fractionPlayed === null) {
      return null
    }
    return fractionPlayed * duration
  }

  setVolume(fraction) {
    if (!this.isReady || !this.player || !this.player.setVolume) return
    this.player.setVolume(fraction * 100)
  }

  setPlaybackRate(rate) {
    if (!this.isReady || !this.player || !this.player.setPlaybackSpeed) return
    this.player.setPlaybackSpeed(rate)
  }

  getDuration() {
    if (!this.isReady || !this.player || !this.player.getDuration) return
    return this.player.getDuration()
  }

  getFractionPlayed() {
    if (
      !this.isReady ||
      !this.player ||
      !this.player.getCurrentTime ||
      !this.player.getDuration
    )
      return null
    return this.player.getCurrentTime() / this.player.getDuration()
  }

  getFractionLoaded() {
    return null
  }

  render() {
    const url =
      this.props.dash_url || this.props.hls_url || this.props.wistia_url
    const style = {
      width: '100%',
      height: '100%',
      display: url ? 'block' : 'none',
    }
    return (
      <div key={this.key}>
        <div style={{position: 'relative', overflow: 'hidden'}}>
          <input
            aria-hidden={true}
            ref={(container) => (this.container = container)}
            style={{position: 'absolute', right: '-1000px', top: '-1000px'}}
          />
        </div>
        <div id={this.id} className={this.id} style={style} />
      </div>
    )
  }
}
