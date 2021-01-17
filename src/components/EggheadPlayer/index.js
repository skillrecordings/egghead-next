import React, {Component} from 'react'
import omit from 'lodash/omit'

import {propTypes, defaultProps} from './props'
import Bitmovin from './players/Bitmovin'
import YouTube from './players/YouTube'
import {track} from 'utils/analytics'

import useEggheadPlayer, {
  getPlayerPrefs,
  savePlayerPrefs,
} from './use-egghead-player'

export default class EggheadPlayer extends Component {
  static displayName = 'EggheadPlayer'
  static propTypes = propTypes
  static defaultProps = defaultProps
  componentDidMount() {
    this.progress()
  }
  componentWillUnmount() {
    clearTimeout(this.progressTimeout)
  }
  getUrl = () => this.props.dash_url || this.props.hls_url || this.props.url
  shouldComponentUpdate(nextProps) {
    const url = this.getUrl()
    const nextUrl = nextProps.dash_url || nextProps.hls_url || nextProps.url
    return (
      url !== nextUrl ||
      this.props.playing !== nextProps.playing ||
      this.props.volume !== nextProps.volume ||
      this.props.playbackRate !== nextProps.playbackRate ||
      this.props.height !== nextProps.height ||
      this.props.width !== nextProps.width ||
      this.props.hidden !== nextProps.hidden ||
      this.props.displaySubtitles !== nextProps.displaySubtitles
    )
  }
  seekTo = (fraction) => {
    if (this.player) {
      this.player.seekTo(fraction)
    }
  }
  getDuration = () => {
    if (!this.player) return null
    return this.player.getDuration()
  }
  getCurrentTime = () => {
    if (!this.player) return null
    const duration = this.player.getDuration()
    const fractionPlayed = this.player.getFractionPlayed()
    if (duration === null || fractionPlayed === null) {
      return null
    }
    return fractionPlayed * duration
  }
  progress = () => {
    const hasUrl = this.getUrl()
    if (hasUrl && this.player) {
      const loaded = this.player.getFractionLoaded() || 0
      const played = this.player.getFractionPlayed() || 0
      const duration = this.player.getDuration()
      const progress = {}
      if (loaded !== this.prevLoaded) {
        progress.loaded = loaded
        if (duration) {
          progress.loadedSeconds = progress.loaded * duration
        }
      }
      if (played !== this.prevPlayed) {
        progress.played = played
        if (duration) {
          progress.playedSeconds = progress.played * duration
        }
      }
      if (progress.loaded || progress.played) {
        this.props.onProgress(progress)
      }
      this.prevLoaded = loaded
      this.prevPlayed = played
    }
    this.progressTimeout = setTimeout(
      this.progress,
      this.props.progressFrequency,
    )
  }
  renderPlayers() {
    // Build array of players to render based on URL and preload config
    const url = this.getUrl()

    const players = []
    if (YouTube.canPlay(url)) {
      players.push(YouTube)
    } else if (Bitmovin.canPlay(url)) {
      players.push(Bitmovin)
    }

    return players.map(this.renderPlayer)
  }
  ref = (player) => {
    this.player = player
  }
  renderPlayer = (Player) => {
    const url = this.getUrl()
    const active = Player.canPlay(url)
    const {resource, ...activeProps} = this.props
    const props = active ? {...activeProps, ref: this.ref} : {}
    const {volumeRate, videoQuality, subtitle, muted} = getPlayerPrefs()
    const {playbackRate} = this.props

    const displaySubtitles = props.subtitlesUrl && subtitle?.label !== 'off'

    const onVideoQualityChanged = ({targetQuality}) => {
      const videoQuality = {
        id: targetQuality.id,
        bitrate: targetQuality.bitrate,
        label: targetQuality.label,
        width: targetQuality.width,
        height: targetQuality.height,
      }

      savePlayerPrefs({videoQuality})

      track(`set video quality`, {
        quality: targetQuality.label || 'auto',
        video: resource.slug,
      })
    }

    const onSubtitleChange = ({targetSubtitle}) => {
      const subtitle = {
        id: targetSubtitle.id,
        kind: targetSubtitle.kind,
        label: targetSubtitle.label,
        lang: targetSubtitle.lang,
      }

      savePlayerPrefs({subtitle})

      track(`set video subtitles`, {
        language: subtitle.lang || 'none',
        video: resource.slug,
      })
    }
    return (
      <Player
        key={Player.displayName}
        {...props}
        displaySubtitles={displaySubtitles}
        playbackRate={playbackRate}
        volume={volumeRate}
        videoQualityCookie={videoQuality}
        muted={muted}
        onVolumeChange={(volumeRate) => {
          track(`set volume`, {
            volume: volumeRate,
            video: resource.slug,
          })
        }}
        onVideoQualityChanged={onVideoQualityChanged}
        onSubtitleChange={onSubtitleChange}
      />
    )
  }
  render() {
    const {style, width, height} = this.props
    const otherProps = omit(this.props, Object.keys(propTypes))
    const players = this.renderPlayers()
    return (
      <div style={{...style, width, height}} {...otherProps}>
        {players}
      </div>
    )
  }
}

export {EggheadPlayer, useEggheadPlayer}
