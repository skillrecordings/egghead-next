/** @jsx jsx */
import {jsx} from '@emotion/core'
import React, {FunctionComponent} from 'react'
import {
  ListboxInput,
  ListboxButton,
  ListboxPopover,
  ListboxList,
  ListboxOption,
} from '@reach/listbox'
import {isEmpty, get} from 'lodash'

type PlayerControlsProps = {
  handlerSpeed: any
  handlerRewinding: any
  handlerDownload: any
  isPro: boolean
}

const PlayerControls: FunctionComponent<PlayerControlsProps> = ({
  handlerSpeed,
  handlerRewinding,
  handlerDownload,
  isPro,
}: PlayerControlsProps) => (
  <div className="flex items-center mt-4">
    {isPro ? (
      <>
        <ListboxInput defaultValue="1.0" onChange={handlerSpeed}>
          <ListboxButton className="w-20" />
          <ListboxPopover>
            <ListboxList>
              <ListboxOption value="0.85">x0.85</ListboxOption>
              <ListboxOption value="1.0">x1</ListboxOption>
              <ListboxOption value="1.25">x1.25</ListboxOption>
              <ListboxOption value="1.5">x1.5</ListboxOption>
              <ListboxOption value="1.75">x1.75</ListboxOption>
              <ListboxOption value="2.0">x2</ListboxOption>
            </ListboxList>
          </ListboxPopover>
        </ListboxInput>
        <button onClick={handlerRewinding} className="ml-4">
          rewind
        </button>
        <button onClick={handlerRewinding} className="ml-4">
          forward
        </button>
        <button onClick={handlerDownload} className="ml-4">
          download
        </button>
      </>
    ) : (
      <div>This stuff if for Pro members only</div>
    )}
  </div>
)

export default PlayerControls
