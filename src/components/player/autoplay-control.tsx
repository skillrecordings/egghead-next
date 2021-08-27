import * as React from 'react'
import {track} from 'utils/analytics'
import {useEggheadPlayerPrefs} from 'components/EggheadPlayer/use-egghead-player'
import {Switch} from '@headlessui/react'

type AutoplayControlProps = {
  enabled: boolean
  onDark?: boolean
  actions?: any
  order?: number
}

const AutoplayControl: React.FC<AutoplayControlProps> = ({
  enabled,
  onDark = false,
  actions,
}) => {
  const {getPlayerPrefs, setPlayerPrefs} = useEggheadPlayerPrefs()
  const {autoplay} = getPlayerPrefs()

  return (
    <div className="flex px-3 items-center space-x-2">
      <span>Autoplay</span>
      <Switch
        checked={autoplay}
        onChange={() => {
          if (enabled) {
            const newAutoplayPref = !autoplay
            track(`clicked toggle autoplay`, {
              state: !autoplay ? 'off' : 'on',
            })
            setPlayerPrefs({autoplay: newAutoplayPref})

            if (newAutoplayPref && actions) {
              actions.play()
            } else {
              actions.pause()
            }
          }
        }}
        className={`${
          autoplay ? 'bg-blue-600' : 'bg-gray-700'
        } relative inline-flex items-center h-5 rounded-full w-10`}
      >
        <span className="sr-only">Enable autoplay</span>
        <span
          className={`${
            autoplay ? 'translate-x-6' : 'translate-x-1'
          } inline-block w-3 h-3 transform bg-white rounded-full`}
        />
      </Switch>
    </div>
  )
}

export default AutoplayControl
