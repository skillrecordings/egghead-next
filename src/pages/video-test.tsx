import * as React from 'react'
import {useVideoJS} from '../hooks/useVideo'

const videoResource = {
  id: 'video',
  name: 'Optimize your Learning',
  title: 'Learning Tips Every Developer Should Know',
  poster:
    'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1612390842/egghead-next-pages/home-page/LearningTipsCover.png.png',
  hls_url:
    'https://d2c5owlt6rorc3.cloudfront.net/egghead-eggheadtalk-learning-tips-every-developer-should-know--ZSo0lRrh/hls/egghead-eggheadtalk-learning-tips-every-developer-should-know--ZSo0lRrh.m3u8',

  dash_url:
    'https://d2c5owlt6rorc3.cloudfront.net/egghead-eggheadtalk-learning-tips-every-developer-should-know--ZSo0lRrh/dash/egghead-eggheadtalk-learning-tips-every-developer-should-know--ZSo0lRrh.mpd',

  subtitlesUrl:
    'https://app.egghead.io/api/v1/lessons/egghead-egghead-talks-learning-tips-every-developer-should-know/subtitles',
}

const Team = () => {
  const {Video, player, ready} = useVideoJS({
    poster: videoResource.poster,
    sources: [{src: videoResource.hls_url}, {src: videoResource.dash_url}],
    controls: true,
  })
  if (ready) {
    // Do something with the video.js player object.
  }
  return (
    <div className="lg:prose-lg prose xl:prose-xl max-w-screen-xl mx-auto mb-24">
      <Video />
    </div>
  )
}

export default Team
