import {Component} from 'react'

import {propTypes, defaultProps} from '../props'
import {isInteger, isEmpty, get} from 'lodash'
import queryString from 'query-string'

const SEEK_ON_PLAY_EXPIRY = 5000

export default class Base extends Component {
  static propTypes = propTypes
  static defaultProps = defaultProps
  isReady = false
  startOnPlay = true
  durationOnPlay = false
  seekOnPlay = null
  startTime = null
  componentDidMount() {
    const {url} = this.props
    this.mounted = true
    if (url) {
      this.load(url)
    }
  }
  componentWillUnmount() {
    this.stop()
    this.mounted = false
  }
  componentWillReceiveProps(nextProps) {
    const {playing, volume, playbackRate, displaySubtitles} = this.props
    const url =
      this.props.dash_url ||
      this.props.hls_url ||
      this.props.wistia_url ||
      this.props.url
    const nextUrl =
      nextProps.dash_url || nextProps.hls_url || nextProps.wistia_url
    // Invoke player methods based on incoming props
    if (url !== nextUrl && nextUrl) {
      this.seekOnPlay = null
      this.startOnPlay = true
      this.load(nextProps)
    }

    if (url && !nextUrl) {
      this.stop()
      clearTimeout(this.updateTimeout)
    }

    if (!playing && nextProps.playing) {
      this.play()
    }

    if (playing && !nextProps.playing) {
      this.pause()
    }

    if (volume !== nextProps.volume) {
      this.setVolume(nextProps.volume)
    }

    if (playbackRate !== nextProps.playbackRate) {
      this.setPlaybackRate(nextProps.playbackRate)
    }
  }
  componentDidUpdate() {
    const newStartTime = this.getTimeToSeekSeconds()
    if (newStartTime !== this.startTime) {
      this.startTime = newStartTime
      if (isInteger(this.startTime)) {
        const percent = this.startTime / this.getDuration()
        this.seekTo(percent <= 0 ? 0 : percent >= 1 ? 1 : percent)
      }
    }
  }
  seekTo(fraction) {
    // When seeking before player is ready, store value and seek later
    if (!this.isReady && fraction !== 0) {
      this.seekOnPlay = fraction
      setTimeout(() => {
        this.seekOnPlay = null
      }, SEEK_ON_PLAY_EXPIRY)
    }
  }
  getTimeToSeekSeconds = () => {
    const locationHash = get(this.props.location, 'hash', '')
    let t = get(queryString.parse(locationHash), 't')
    if (!isEmpty(t) && !isInteger(t)) {
      t = Number(t)
    }

    return t
  }
  onPlay = () => {
    const {onStart, onPlay, onDuration, playbackRate} = this.props
    if (this.startOnPlay) {
      this.setPlaybackRate(playbackRate)
      onStart()
      this.startOnPlay = false
    }
    onPlay()
    if (this.seekOnPlay) {
      this.seekTo(this.seekOnPlay)
      this.seekOnPlay = null
    }
    if (this.durationOnPlay) {
      onDuration(this.getDuration())
      this.durationOnPlay = false
    }
  }
  onReady = () => {
    const {onReady, playing, onDuration} = this.props
    this.isReady = true
    this.loadingSDK = false
    onReady(this)
    if (playing || this.preloading) {
      this.preloading = false
      if (this.loadOnReady) {
        this.load(this.loadOnReady)
        this.loadOnReady = null
      } else {
        this.play()
      }
    }
    const duration = this.getDuration()
    if (duration) {
      onDuration(duration)
    } else {
      this.durationOnPlay = true
    }
    if (isInteger(this.startTime)) {
      const percent = this.startTime / duration
      this.seekTo(percent <= 0 ? 0 : percent >= 1 ? 1 : percent)
    }
  }
}
