import React from 'react'
import VisuallyHidden from '@reach/visually-hidden'
import {
  ListboxInput,
  ListboxButton,
  ListboxPopover,
  ListboxList,
  ListboxOption,
} from '@reach/listbox'
import {track} from 'utils/analytics'

const availableSpeeds = ['0.5', '0.75', '1', '1.25', '1.50', '1.75', '2']

const PlaybackSpeedToggle = ({playbackRate = '1', changePlaybackRate}) => {
  const [value, setValue] = React.useState(playbackRate.toString())

  React.useEffect(() => {
    setValue(playbackRate.toString())
  }, [playbackRate])

  return (
    <div>
      <VisuallyHidden id="playback-speed">Choose the speed</VisuallyHidden>
      <ListboxInput
        aria-labelledby="playback-speed"
        value="5"
        onChange={(value) => {
          changePlaybackRate(Number(value))
          // // track(`set playback rate`, {
          // //   playbackRate,
          // //   video: resource.slug,
          // // })
          setValue(value)
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
  )
}

export default PlaybackSpeedToggle
