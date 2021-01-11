import React, {FunctionComponent} from 'react'
import {
  Listbox,
  ListboxInput,
  ListboxButton,
  ListboxPopover,
  ListboxList,
  ListboxOption,
} from '@reach/listbox'

const PlaybackSpeedToggle = () => (
  <ListboxInput defaultValue="popeyes">
    <ListboxButton />
    <ListboxPopover>
      <ListboxList>
        <ListboxOption value="bojangles">Bojangles'</ListboxOption>
        <ListboxOption value="churchs">Church's</ListboxOption>
        <ListboxOption value="kfc">KFC</ListboxOption>
        <ListboxOption value="popeyes">Popeyes</ListboxOption>
      </ListboxList>
    </ListboxPopover>
  </ListboxInput>
)

export default PlaybackSpeedToggle
