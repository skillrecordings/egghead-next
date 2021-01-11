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
        <ListboxButton className="text-white">{playbackRate}</ListboxButton>
        <ListboxPopover>
          <ListboxList>
            {availableSpeeds
              .filter((i) => i !== value)
              .map((speed, index) => (
                <ListboxOption key={index} value={speed}>
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
