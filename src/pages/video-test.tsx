import * as React from 'react'
import {useVideoJS} from '../hooks/useVideo'
import {GetServerSideProps} from 'next'

const videoResources = {
  testingjavascript: {
    subtitle:
      'https://app.egghead.io/api/v1/lessons/node-js-create-a-casify-function-to-generate-cases-for-jest-in-case/subtitles',
    poster:
      'https://dcv19h61vib2d.cloudfront.net/thumbs/scikit-learn-create-a-casify-function-to-generate-cases-for-jest-in-case-BkAh7QjsS/scikit-learn-create-a-casify-function-to-generate-cases-for-jest-in-case-BkAh7QjsS.jpg',
    hls_url:
      'https://d2c5owlt6rorc3.cloudfront.net/scikit-learn-create-a-casify-function-to-generate-cases-for-jest-in-case-BkAh7QjsS/hls/scikit-learn-create-a-casify-function-to-generate-cases-for-jest-in-case-BkAh7QjsS.m3u8',
    dash_url:
      'https://d2c5owlt6rorc3.cloudfront.net/scikit-learn-create-a-casify-function-to-generate-cases-for-jest-in-case-BkAh7QjsS/dash/scikit-learn-create-a-casify-function-to-generate-cases-for-jest-in-case-BkAh7QjsS.mpd',
  },
  configureAngularCLI: {
    poster:
      'https://dcv19h61vib2d.cloudfront.net/thumbs/egghead-configure-the-angular-cli-to-use-the-karma-mocha-test-reporter-S1MetkKSG/egghead-configure-the-angular-cli-to-use-the-karma-mocha-test-reporter-S1MetkKSG.jpg',
    hls_url:
      'https://d2c5owlt6rorc3.cloudfront.net/egghead-configure-the-angular-cli-to-use-the-karma-mocha-test-reporter-eacfbcf344/egghead-configure-the-angular-cli-to-use-the-karma-mocha-test-reporter-eacfbcf344.m3u8',

    dash_url:
      'https://d2c5owlt6rorc3.cloudfront.net/egghead-configure-the-angular-cli-to-use-the-karma-mocha-test-reporter-eacfbcf344/egghead-configure-the-angular-cli-to-use-the-karma-mocha-test-reporter-eacfbcf344.mpd',

    subtitlesUrl:
      'https://app.egghead.io/api/v1/lessons/angular-configure-the-angular-cli-to-use-the-karma-mocha-test-reporter/subtitles',
  },
  rxJS: {
    poster:
      'https://dcv19h61vib2d.cloudfront.net/thumbs/egghead-combination-operator-combinelatest/egghead-combination-operator-combinelatest.jpg',
    hls_url:
      'https://d2c5owlt6rorc3.cloudfront.net/rxjs-combination-operator-combinelatest-6166b0d1b8/rxjs-combination-operator-combinelatest-6166b0d1b8.m3u8',
    dash_url:
      'https://d2c5owlt6rorc3.cloudfront.net/rxjs-combination-operator-combinelatest-6166b0d1b8/rxjs-combination-operator-combinelatest-6166b0d1b8.mpd',
    subtitlesUrl:
      'https://app.egghead.io/api/v1/lessons/rxjs-join-values-from-multiple-observables-with-rxjs-combinelatest/subtitles',
  },
  styleReactComponents: {
    poster:
      'https://dcv19h61vib2d.cloudfront.net/thumbs/egghead-v2-10-style-react-components-with-classname-and-inline-styles-B1QzWK8rU/egghead-v2-10-style-react-components-with-classname-and-inline-styles-B1QzWK8rU.jpg',
    hls_url:
      'https://d2c5owlt6rorc3.cloudfront.net/egghead-v2-10-style-react-components-with-classname-and-inline-styles-B1QzWK8rU/hls/egghead-v2-10-style-react-components-with-classname-and-inline-styles-B1QzWK8rU.m3u8',
    dash_url:
      'https://d2c5owlt6rorc3.cloudfront.net/egghead-v2-10-style-react-components-with-classname-and-inline-styles-B1QzWK8rU/dash/egghead-v2-10-style-react-components-with-classname-and-inline-styles-B1QzWK8rU.mpd',
    subtitlesUrl:
      'https://app.egghead.io/api/v1/lessons/react-style-react-components-with-classname-and-inline-styles/subtitles',
  },
  useJSX: {
    poster:
      'https://dcv19h61vib2d.cloudfront.net/thumbs/react-v2-04-use-jsx-effectively-with-react-SJrnCuUSL/react-v2-04-use-jsx-effectively-with-react-SJrnCuUSL.jpg',
    hls_url:
      'https://d2c5owlt6rorc3.cloudfront.net/react-v2-04-use-jsx-effectively-with-react-SJrnCuUSL/hls/react-v2-04-use-jsx-effectively-with-react-SJrnCuUSL.m3u8',
    dash_url:
      'https://d2c5owlt6rorc3.cloudfront.net/react-v2-04-use-jsx-effectively-with-react-SJrnCuUSL/dash/react-v2-04-use-jsx-effectively-with-react-SJrnCuUSL.mpd',
    subtitlesUrl:
      'https://app.egghead.io/api/v1/lessons/react-use-jsx-effectively-with-react/subtitles',
  },
  redux: {
    poster:
      'https://dcv19h61vib2d.cloudfront.net/thumbs/egghead-redux-simplifying-the-arrow-functions/egghead-redux-simplifying-the-arrow-functions.jpg',
    hls_url:
      'https://d2c5owlt6rorc3.cloudfront.net/javascript-redux-simplifying-the-arrow-functions-4904bfd3df/javascript-redux-simplifying-the-arrow-functions-4904bfd3df.m3u8',
    dash_url:
      'https://d2c5owlt6rorc3.cloudfront.net/javascript-redux-simplifying-the-arrow-functions-4904bfd3df/javascript-redux-simplifying-the-arrow-functions-4904bfd3df.mpd',
    subtitlesUrl:
      'https://app.egghead.io/api/v1/lessons/javascript-redux-simplifying-the-arrow-functions/subtitles',
  },
  defaultVideo: {
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
  },
}

const pickVideoResource = (query: any) => {
  switch (query) {
    case 'testing':
      return videoResources.testingjavascript
    case 'angular':
      return videoResources.configureAngularCLI
    case 'rxjs':
      return videoResources.rxJS
    case 'stylereactcomponents':
      return videoResources.styleReactComponents
    case 'jsx':
      return videoResources.useJSX
    case 'redux':
      return videoResources.redux
    default:
      return videoResources.defaultVideo
  }
}

export const getServerSideProps: GetServerSideProps = async function ({query}) {
  const videoResource = pickVideoResource(query.v)

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
          src={videoResource.subtitlesUrl}
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
