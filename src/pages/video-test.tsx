import * as React from 'react'
import {useVideoJS} from '../hooks/useVideo'
import {GetServerSideProps} from 'next'

const testingjavascript = {
  subtitle:
    'https://app.egghead.io/api/v1/lessons/node-js-create-a-casify-function-to-generate-cases-for-jest-in-case/subtitles',
  poster:
    'https://dcv19h61vib2d.cloudfront.net/thumbs/scikit-learn-create-a-casify-function-to-generate-cases-for-jest-in-case-BkAh7QjsS/scikit-learn-create-a-casify-function-to-generate-cases-for-jest-in-case-BkAh7QjsS.jpg',
  hls_url:
    'https://d2c5owlt6rorc3.cloudfront.net/scikit-learn-create-a-casify-function-to-generate-cases-for-jest-in-case-BkAh7QjsS/hls/scikit-learn-create-a-casify-function-to-generate-cases-for-jest-in-case-BkAh7QjsS.m3u8',
  dash_url:
    'https://d2c5owlt6rorc3.cloudfront.net/scikit-learn-create-a-casify-function-to-generate-cases-for-jest-in-case-BkAh7QjsS/dash/scikit-learn-create-a-casify-function-to-generate-cases-for-jest-in-case-BkAh7QjsS.mpd',
}

const defaultVideo = {
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

export const getServerSideProps: GetServerSideProps = async function ({query}) {
  const videoResource =
    query && query.v === 'testing' ? testingjavascript : defaultVideo

  return {
    props: {
      videoResource,
    },
  }
}
const Team: React.FC<any> = ({videoResource}) => {
  const {Video, player, ready} = useVideoJS({
    poster: videoResource.poster,
    sources: [{src: videoResource.hls_url}, {src: videoResource.dash_url}],
    controls: true,
    playbackRates: [0.5, 1, 1.5, 2],
    responsive: true,
  })

  if (ready) {
    console.log(player.textTracks())
    player.on('timeupdate', () => {
      console.log(player.currentTime())
    })
    player.on('ended', () => {
      console.log(player.ended())
    })
  }
  return (
    <div className="lg:prose-lg prose xl:prose-xl max-w-screen-xl mx-auto mb-24">
      <Video>
        <track
          src="https://app.egghead.io/api/v1/lessons/egghead-egghead-talks-learning-tips-every-developer-should-know/subtitles"
          kind="subtitles"
          srcLang="en"
          label="English"
          default
        />
      </Video>
    </div>
  )
}

export default Team
