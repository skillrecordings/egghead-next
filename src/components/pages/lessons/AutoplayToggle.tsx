import React, {FunctionComponent} from 'react'
import {track} from 'utils/analytics'
import cookies from 'utils/cookies'
import {useEggheadPlayerPrefs} from '../../EggheadPlayer/use-egghead-player'

type AutoplayToggleProps = {
  enabled: boolean
}

const AutoplayToggle: FunctionComponent<AutoplayToggleProps> = ({enabled}) => {
  const {autoplay, setPlayerPrefs} = useEggheadPlayerPrefs()

  return (
    <div className="flex">
      <button
        onClick={() => {
          if (enabled) {
            track(`clicked toggle autoplay`, {
              state: !autoplay ? 'off' : 'on',
            })
            setPlayerPrefs({autoplay: !autoplay})
          }
        }}
        type="button"
        name="autoplay"
        id="autoplay"
        aria-pressed="false"
        className={`${
          enabled && autoplay ? 'bg-indigo-600' : 'bg-gray-200'
        } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
      >
        {enabled && (
          <span className="sr-only">
            {autoplay ? 'Turn autoplay off' : 'Turn autoplay on'}
          </span>
        )}
        <span
          aria-hidden="true"
          className={`${
            enabled && autoplay ? 'translate-x-5' : 'translate-x-0'
          } inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
        />
      </button>
      <div className={`ml-2 ${!enabled && 'opacity-30'}`}>Autoplay</div>
    </div>
  )
}

export default AutoplayToggle
