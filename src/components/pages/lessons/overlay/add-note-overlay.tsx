import * as React from 'react'
import {Switch} from '@headlessui/react'
import VisuallyHidden from '@reach/visually-hidden'

const AddNoteOverlay: React.FC<{sendPlayerState: any}> = ({
  sendPlayerState,
}) => {
  const [enabled, setEnabled] = React.useState(false)
  return (
    <div className="w-[34rem] h-[20rem] rounded-md bg-white p-4 flex flex-col">
      <div className="flex-shrink-0 flex justify-end">
        <button
          type="button"
          onClick={() => sendPlayerState('VIEW')}
          className="text-gray-400 hover:text-gray-500"
        >
          <VisuallyHidden>Close</VisuallyHidden>
          <span aria-hidden="true">
            <IconX />
          </span>
        </button>
      </div>
      <div className="flex-grow my-2 overflow-hidden">
        <textarea
          className="w-full h-full resize-none border-none p-0 placeholder-gray-400"
          placeholder={`Write a note...\n\nYou can use markdown to [add links](https://stackoverflow.com), **bold text** or \`write syntax\``}
        />
      </div>
      <div className="flex-shrink-0 flex justify-between items-end">
        <Switch.Group>
          <div className="flex items-center">
            <Switch
              checked={enabled}
              onChange={setEnabled}
              className={`${
                enabled ? 'bg-blue-600' : 'bg-gray-200'
              } relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              <span
                className={`${
                  enabled ? 'translate-x-[1.375rem]' : 'translate-x-0.5'
                } inline-block w-5 h-5 transform bg-white rounded-full transition-transform`}
              />
            </Switch>
            <Switch.Label className="ml-4 text-gray-500 text-sm">
              Publicly visible
            </Switch.Label>
          </div>
        </Switch.Group>
        <button
          type="button"
          onClick={() => console.log('add note')}
          className="inline-flex justify-center items-center px-4 py-2 rounded-md bg-blue-600 text-white transition-all hover:bg-blue-700 ease-in-out duration-200"
        >
          Add to notes
        </button>
      </div>
    </div>
  )
}

export default AddNoteOverlay

const IconX: React.FC<any> = ({className}) => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-5 h-5 ${className ?? ''}`}
  >
    <path
      d="M6 18L18 6M6 6l12 12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
