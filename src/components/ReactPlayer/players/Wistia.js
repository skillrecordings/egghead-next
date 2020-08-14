import React from 'react'
import loadScript from 'load-script'

import Base from './Base'

const SDK_URL = '//fast.wistia.com/assets/external/E-v1.js'
const SDK_GLOBAL = 'Wistia'
const MATCH_URL = /^https?:\/\/(.+)?(wistia.com|wi.st)\/(medias|embed)\/(.*)$/

export default class Wistia extends Base {
  static displayName = 'Wistia'
  static canPlay(url) {
    return MATCH_URL.test(url)
  }
  componentDidMount() {
    this.loadingSDK = true
    this.getSDK().then(() => {
      window._wq = window._wq || []
      window._wq.push({
        id: this.getID(this.props.wistia_url),
        onReady: (player) => {
          this.player = player
          this.rebind()
          this.onReady()
        },
      })
    })
  }

  rebind() {
    const {onStart, onPause, onEnded, onPlayerProgress} = this.props
    this.player.bind('start', onStart)
    this.player.bind('play', this.onPlay)
    this.player.bind('pause', onPause)
    this.player.bind('end', onEnded)
    this.player.bind('secondchange', onPlayerProgress)
  }

  unbind() {
    const {onStart, onPause, onEnded, onPlayerProgress} = this.props
    if (this.player) {
      this.player.unbind('start', onStart)
      this.player.unbind('play', this.onPlay)
      this.player.unbind('pause', onPause)
      this.player.unbind('end', onEnded)
      this.player.unbind('secondchange', onPlayerProgress)
    }
  }
  getSDK() {
    return new Promise((resolve, reject) => {
      if (window[SDK_GLOBAL]) {
        resolve()
      } else {
        loadScript(SDK_URL, (err, script) => {
          if (err) reject(err)
          resolve(script)
        })
      }
    })
  }
  getID(url) {
    return url && url.match(MATCH_URL)[4]
  }
  load(nextProps) {
    const id = this.getID(nextProps.wistia_url || nextProps.url)
    this.unbind()
    this.player.replaceWith(id)
    window._wq.push({
      id: id,
      onReady: (player) => {
        this.player = player
        this.rebind()
        this.props.onReady()
        this.onReady()
      },
    })
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
    this.player.time(this.getDuration() * fraction)
  }
  setVolume(fraction) {
    if (!this.isReady || !this.player || !this.player.volume) return
    this.player.volume(fraction)
  }
  setPlaybackRate(rate) {
    if (!this.isReady || !this.player || !this.player.playbackRate) return
    this.player.playbackRate(rate)
  }
  getDuration() {
    if (!this.isReady || !this.player || !this.player.duration) return
    return this.player.duration()
  }
  getFractionPlayed() {
    if (!this.isReady || !this.player || !this.player.percentWatched)
      return null
    return this.player.percentWatched()
  }
  getFractionLoaded() {
    return null
  }
  render() {
    const id = this.getID(this.props.wistia_url)
    const className = `wistia_embed wistia_async_${id} videoFoam=true playerColor=171e27`
    const style = {
      width: '100%',
      height: '100%',
      display: this.props.wistia_url ? 'block' : 'none',
    }
    return <div className={className} style={style} />
  }
}
