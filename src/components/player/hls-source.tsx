import React, {Component} from 'react'
import Hls from 'hls.js'

export default class HLSSource extends Component<any> {
  hls

  constructor(props: any) {
    super(props)
    this.hls = new Hls()
  }

  componentDidMount() {
    const {src, video} = this.props as any
    if (Hls.isSupported()) {
      this.hls.loadSource(src)
      this.hls.attachMedia(video)
    }
  }

  componentWillUnmount() {
    // destroy hls video source
    if (this.hls) {
      this.hls.destroy()
    }
  }

  render() {
    const {src, type} = this.props as any
    return <source src={src} type={type || 'application/x-mpegURL'} />
  }
}
