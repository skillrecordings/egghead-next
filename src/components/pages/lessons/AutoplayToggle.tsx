import React, {FunctionComponent} from 'react'
import {track} from 'utils/analytics'
import cookies from 'utils/cookies'

type AutoplayToggleProps = {}

const AutoplayToggle: FunctionComponent<AutoplayToggleProps> = () => {
  //   const {autoplay, setAutoplay} = useEggheadPlayer()
  const [autoplay, setAutoplay] = React.useState(false)
  React.useEffect(() => {
    cookies.set('egghead-autoplay', autoplay)
  }, [autoplay])

  return (
    <div className="flex">
      <button
        onClick={() => {
          track(`clicked toggle autoplay ${autoplay ? 'off' : 'on'}`)
          setAutoplay(!autoplay)
        }}
        type="button"
        name="autoplay"
        id="autoplay"
        aria-pressed="false"
        className={`${
          autoplay ? 'bg-indigo-600' : 'bg-gray-200'
        } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
      >
        <span className="sr-only">
          {autoplay ? 'Turn autoplay off' : 'Turn autoplay on'}
        </span>
        <span
          aria-hidden="true"
          className={`${
            autoplay ? 'translate-x-5' : 'translate-x-0'
          } inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
        ></span>
      </button>
      <div className="ml-2">Autoplay</div>
    </div>
  )
}

export default AutoplayToggle
