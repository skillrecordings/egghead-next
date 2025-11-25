import React, {FunctionComponent} from 'react'
import * as Select from '@radix-ui/react-select'
import {track} from '@/utils/analytics'
import MultiplySymbol from '@/components/icons/cancel'

const availableSpeeds = ['0.5', '0.75', '1', '1.25', '1.5', '1.75', '2']

const PlaybackSpeedSelect: FunctionComponent<
  React.PropsWithChildren<{
    playbackRate: number
    changePlaybackRate: any
    video: string
  }>
> = ({playbackRate, changePlaybackRate, video}) => {
  const [value, setValue] = React.useState<string>(playbackRate.toString())

  return playbackRate ? (
    <div>
      <span id="playback-speed" className="sr-only">
        Choose video playback speed
      </span>
      <Select.Root
        value={value}
        onValueChange={(newValue) => {
          changePlaybackRate(Number(newValue))
          setValue(newValue)
          track(`set playback rate`, {
            playbackRate,
            video: video,
          })
        }}
      >
        <Select.Trigger
          aria-labelledby="playback-speed"
          className="text-white text-sm rounded-md bg-gray-800 group flex items-center justify-center px-2 py-3 border-none"
        >
          <span className="text-xs mb-px translate-y-px text-gray-300 group-hover:text-white transition-colors ease-in-out duration-200">
            Speed
          </span>
          <MultiplySymbol
            strokeWidth={3}
            className="w-3 sm:mb-px translate-y-px ml-2 flex-shrink-0 text-gray-300 group-hover:text-white transition-colors ease-in-out duration-200"
          />
          <Select.Value>
            <span className="font-sans sm:text-base text-xs text-gray-100 group-hover:text-white transition-colors ease-in-out duration-200">
              {playbackRate}
            </span>
          </Select.Value>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content
            className="dark:bg-gray-900 dark:text-white dark:border-gray-800 p-0 rounded-md shadow-md overflow-hidden z-50 bg-white"
            position="popper"
            sideOffset={5}
          >
            <Select.Viewport>
              {availableSpeeds
                .filter((i) => i !== value)
                .map((speed, index) => (
                  <Select.Item
                    key={index}
                    value={speed}
                    className="dark:border-gray-800 hover:bg-blue-100 transition-colors ease-in-out duration-200 hover:text-black font-medium text-sm text-right px-3 py-2 border-t border-gray-100 cursor-pointer outline-none data-[highlighted]:bg-blue-100 data-[highlighted]:text-black"
                  >
                    <Select.ItemText>{speed}</Select.ItemText>
                  </Select.Item>
                ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  ) : null
}

export default PlaybackSpeedSelect
