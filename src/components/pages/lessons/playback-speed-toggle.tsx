import React from 'react'
import VisuallyHidden from '@reach/visually-hidden'
import {
  ListboxInput,
  ListboxButton,
  ListboxPopover,
  ListboxList,
  ListboxOption,
} from '@reach/listbox'

const availableSpeeds = ['0.5', '0.75', '1.0', '1.25', '1.50', '1.75', '2.0']

const PlaybackSpeedToggle = () => {
  let [value, setValue] = React.useState('1.0')
  return (
    <div>
      <VisuallyHidden id="playback-speed">Choose the speed</VisuallyHidden>
      <ListboxInput
        aria-labelledby="playback-speed"
        value={value}
        onChange={(value) => setValue(value)}
      >
        <ListboxButton>{value}</ListboxButton>
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
