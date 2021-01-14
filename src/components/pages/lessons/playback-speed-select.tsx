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
import MultiplySymbol from 'components/icons/cancel'

const availableSpeeds = ['0.5', '0.75', '1', '1.25', '1.5', '1.75', '2']

const PlaybackSpeedSelect: FunctionComponent<{
  playbackRate: number
  changePlaybackRate: any
  video: string
}> = ({playbackRate, changePlaybackRate, video}) => {
  const [value, setValue] = React.useState<string>(playbackRate.toString())

  return playbackRate ? (
    <div>
      <VisuallyHidden id="playback-speed">
        Chooce video playback speed
      </VisuallyHidden>
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
        <ListboxButton className="text-white text-sm rounded-md px-3 py-2 bg-gray-800 border-none group">
          <span className="text-xs transform translate-y-px uppercase tracking-wide text-gray-300 group-hover:text-white transition-colors ease-in-out duration-200">
            speed:
          </span>
          <MultiplySymbol
            strokeWidth={3}
            className="w-3 transform translate-y-px ml-2 flex-shrink-0 text-gray-100 group-hover:text-white transition-colors ease-in-out duration-200"
          />
          <span className="font-sans text-gray-100 group-hover:text-white transition-colors ease-in-out duration-200">
            {playbackRate}
          </span>
        </ListboxButton>
        <ListboxPopover
          className="p-0 rounded-md shadow-md overflow-hidden"
          style={{outline: 'none'}}
        >
          <ListboxList
            className=""
            css={{
              '[data-reach-listbox-list][aria-selected="true"]': {
                background: '#2563EB',
                ':hover': {
                  background: '#2563EB',
                },
              },
            }}
          >
            {availableSpeeds
              .filter((i) => i !== value)
              .map((speed, index) => (
                <ListboxOption
                  key={index}
                  value={speed}
                  className="hover:bg-blue-100 transition-colors ease-in-out duration-200 hover:text-black font-medium text-sm text-right px-3 py-2 border-t border-gray-100 cursor-pointer"
                  css={{
                    ':first-child': {
                      border: 'none',
                    },
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

export default PlaybackSpeedSelect
