import React, {FunctionComponent} from 'react'
import VisuallyHidden from '@reach/visually-hidden'
import {
  ListboxInput,
  ListboxButton,
  ListboxPopover,
  ListboxList,
  ListboxOption,
} from '@reach/listbox'
import {track} from 'utils/analytics'
import CancelIcon from 'components/icons/cancel'

const availableSpeeds = ['0.5', '0.75', '1', '1.25', '1.5', '1.75', '2']

const PlaybackSpeedToggle: FunctionComponent<{
  playbackRate: number
  changePlaybackRate: any
  video: string
}> = ({playbackRate, changePlaybackRate, video}) => {
  const [value, setValue] = React.useState<string>(playbackRate.toString())

  return playbackRate ? (
    <div>
      <VisuallyHidden id="playback-speed">Choose the speed</VisuallyHidden>
      <ListboxInput
        aria-labelledby="playback-speed"
        value={value}
        onChange={(value) => {
          changePlaybackRate(Number(value))
          setValue(value)
          track(`set playback rate`, {
            playbackRate,
            video: video,
          })
        }}
      >
        <ListboxButton className="text-white text-sm rounded-md px-3 py-2">
          <span>speed:</span>
          <CancelIcon className="w-3 ml-2 text-white flex-shrink-0" />
          {playbackRate}
        </ListboxButton>
        <ListboxPopover className="p-0 rounded-md border-0 shadow-md overflow-hidden">
          <ListboxList>
            {availableSpeeds
              .filter((i) => i !== value)
              .map((speed, index) => (
                <ListboxOption
                  key={index}
                  value={speed}
                  className="hover:bg-blue-200 hover:text-black font-medium"
                  css={{
                    '[data-reach-listbox-option][aria-selected="true"]': {
                      background: '#2563EB',
                      ':hover': {
                        background: '#2563EB',
                      },
                    },
                  }}
                >
                  {speed}
                </ListboxOption>
              ))}
          </ListboxList>
        </ListboxPopover>
      </ListboxInput>
    </div>
  ) : null
}

export default PlaybackSpeedToggle
