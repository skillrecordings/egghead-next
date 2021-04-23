import * as React from 'react'
import {useVideoJS} from '../hooks/useVideo'
import {GetServerSideProps} from 'next'
import {
  Player,
  BigPlayButton,
  HLSSource,
  ControlBar,
  ReplayControl,
  ClosedCaptionButton,
  PlayToggle,
  ForwardControl,
  VolumeMenuButton,
  CurrentTimeDisplay,
  TimeDivider,
  DurationDisplay,
  ProgressControl,
  RemainingTimeDisplay,
  PlaybackRateMenuButton,
  FullscreenToggle,
} from 'cueplayer-react'
import {SyntheticEvent} from 'react'
import {isFunction} from 'lodash'

export const getServerSideProps: GetServerSideProps = async function ({query}) {
  const videoResource = pickVideoResource(query.v)

  return {
    props: {
      videoResource,
    },
  }
}

const VideoTest: React.FC<any> = ({videoResource}) => {
  const actualPlayerRef = React.useRef<any>()

  //autoplay
  const lastAutoPlayed = React.useRef()
  const [autoplay, setAutoplay] = React.useState(true)

  const send = (message) => {
    console.debug(message)
  }

  const onProgress = () => {
    console.log('progress happened')
  }

  return (
    <div>
      {videoResource.hls_url && (
        <Player
          ref={(test: any) => {
            console.log(test.manager.store.getState())
          }}
          crossOrigin="anonymous"
          className="font-sans"
          poster={videoResource.poster}
          onCanPlay={(event: SyntheticEvent) => {
            console.debug(`player ready [autoplay:${autoplay}]`)
            const player: HTMLVideoElement = event.target as HTMLVideoElement
            actualPlayerRef.current = player
            const isDifferent = lastAutoPlayed.current !== videoResource.hls_url
            if (autoplay && isDifferent && isFunction(player.play)) {
              console.debug(`autoplaying`)
              lastAutoPlayed.current = videoResource.hls_url
              player.play()
            }
          }}
          onPause={() => {
            send('PAUSE')
          }}
          onPlay={() => send('PLAY')}
          onTimeUpdate={() => {
            onProgress()
          }}
          onEnded={() => {
            console.debug(`received ended event from player`)
            send('COMPLETE')
          }}
        >
          <BigPlayButton position="center" />
          <HLSSource isVideoChild src={videoResource.hls_url} />
          <track
            src={videoResource.subtitlesUrl}
            kind="subtitles"
            srcLang="en"
            label="English"
            default
          />
          <ControlBar disableDefaultControls>
            <PlayToggle key="play-toggle" order={1} />
            <ReplayControl key="replay-control" order={2} />
            <ForwardControl key="forward-control" order={3} />
            <VolumeMenuButton key="volume-menu-button" order={4} />
            <CurrentTimeDisplay key="current-time-display" order={5} />
            <TimeDivider key="time-divider" order={6} />
            <DurationDisplay key="duration-display" order={7} />
            <ProgressControl key="progress-control" order={8} />
            <RemainingTimeDisplay key="remaining-time-display" order={9} />
            <PlaybackRateMenuButton
              rates={[1, 1.25, 1.5, 2]}
              key="playback-rate"
              order={10}
            />
            <ClosedCaptionButton order={11} />
            <FullscreenToggle key="fullscreen-toggle" order={12} />
          </ControlBar>
        </Player>
      )}
    </div>
  )
}

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

export default VideoTest
