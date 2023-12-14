import React from 'react'
import loadScript from 'load-script'
import {get, isEmpty} from 'lodash'

import Base from './Base'

import {track} from '@/utils/analytics'
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
const STARTUP_THRESHOLD_SECONDS = 8
const ALLOW_PLAYBACK_SPEED = false

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
    const {dash_url, hls_url} = props || this.props

    return {
      ...(!!dash_url && {dash: dash_url.replace('.m3u8.mpd', '.mpd')}),
      ...(!!hls_url && {hls: hls_url.replace('.m3u8.mpd', '.m3u8')}),
    }
  }

  getConfig(props) {
    const {poster, title, description, preload, onVolumeChange, muted} =
      props || this.props

    const CACHE_KEY = `grapenuts`

    return {
      key: BITMOVIN_PUBLIC_KEY,
      network: {
        preprocessHttpRequest: function (type, request) {
          request.url = `${request.url}?b=${CACHE_KEY}`
          return Promise.resolve(request)
        },
      },
      logs: {
        bitmovin: false,
        level: 'off',
      },
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
      buffer: {
        video: {
          forwardduration: 120,
          backwardduration: 30,
        },
        audio: {
          forwardduration: 120,
          backwardduration: 30,
        },
      },
      tweaks: {
        startup_threshold: STARTUP_THRESHOLD_SECONDS,
        max_buffer_level: MAX_BUFFER_LEVEL_SECONDS,
      },
      adaptation: {
        desktop: {preload: preload},
        mobile: {preload: preload},
      },
      events: {
        volumechanged: (e) => {
          const newRate = Math.ceil(e.targetVolume)
          savePlayerPrefs({volumeRate: newRate})
          onVolumeChange(newRate)
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
    this.startTime = this.getTimeToSeekSeconds()
    this.loadingSDK = true

    console.debug(`player instance mounted`)

    this.getSDK().then((script) => {
      this.loadingSDK = false
      this.player = new window.bitmovin.player.Player(
        document.getElementById(this.id),
        this.getConfig(),
      )

      console.debug(`player sdk loaded`)

      this.load(this.props)
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
      onViewModeChanged,
    } = this.props

    this.player.on(this.player.exports.PlayerEvent.Play, this.onPlay)
    this.player.on(
      this.player.exports.PlayerEvent.ViewModeChanged,
      onViewModeChanged,
    )
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
      onViewModeChanged,
    } = this.props
    this.player.off(this.player.exports.PlayerEvent.Play, this.onPlay)
    this.player.off(
      this.player.exports.PlayerEvent.ViewModeChanged,
      onViewModeChanged,
    )
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

  unload() {
    this.player.unload()
  }

  load(nextProps) {
    const {subtitlesUrl, playbackRate, volume} = nextProps
    this.startTime = this.getTimeToSeekSeconds()
    const source = this.getSource(nextProps)

    if (this.loadingSDK || isEmpty(source)) {
      return
    }

    console.debug(`player loading media [ready:${this.isReady}]`)

    this.player.load(source).then(
      () => {
        console.debug(`player media loaded`)
        this.player.subtitles.remove(SUBTITLE_ID)
        this.player.setPosterImage(nextProps.poster)

        this.player.setPlaybackSpeed(playbackRate)
        this.player.setVolume(volume)

        if (this.props.poster) {
          this.player.setPosterImage(this.props.poster)
        }

        const {videoQualityCookie} = this.props

        if (videoQualityCookie) {
          this.player.setVideoQuality(videoQualityCookie.id)
        }

        if (subtitlesUrl) {
          this.addSubtitles(subtitlesUrl)
        }

        this.addEventListeners()
        this.onReady(this.player)
      },
      (error) => {
        console.log('Bitmovin player failed to load')
        console.error(error)
      },
    )
  }

  play() {
    if (!this.isReady || !this.player) return
    this.player.play()
  }

  pause() {
    if (!this.isReady || !this.player) return
    this.player && this.player.pause()
  }

  isFullscreen() {
    if (!this.isReady || !this.player) return
    this.player && this.player.isFullscreen()
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
    this.player.setVolume(fraction)
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
