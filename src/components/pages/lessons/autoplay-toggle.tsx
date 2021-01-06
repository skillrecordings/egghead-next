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
        className="flex items-center group space-x-1"
      >
        <div
          className={`${
            enabled && autoplay
              ? 'bg-blue-600'
              : 'bg-gray-200 group-hover:bg-gray-300'
          } relative inline-flex flex-shrink-0 h-5 w-9 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
        >
          {enabled && (
            <span className="sr-only">
              {autoplay ? 'Turn autoplay off' : 'Turn autoplay on'}
            </span>
          )}
          <span
            aria-hidden="true"
            className={`${
              enabled && autoplay ? 'translate-x-4' : 'translate-x-0'
            } inline-block h-4 w-4 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
          />
        </div>
        <div
          className={`text-sm group-hover:text-gray-800 transition-colors ease-in-out duration-200 ${
            !enabled && 'opacity-30'
          }`}
        >
          Autoplay
        </div>
      </button>
    </div>
  )
}

export default AutoplayToggle
