import * as React from 'react'
import {Switch} from '@headlessui/react'
import VisuallyHidden from '@reach/visually-hidden'
import axios from 'axios'

const AddNoteOverlay: React.FC<{
  onClose: any
  resourceId: string
  currentTime: number
}> = ({onClose, resourceId, currentTime}) => {
  const [enabled, setEnabled] = React.useState(false)
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  React.useEffect(() => {
    if (inputRef) {
      inputRef.current?.focus({preventScroll: true})
    }
  }, [])

  const addNote = () => {
    if (inputRef.current) {
      axios
        .post(`/api/lessons/notes/${resourceId}`, {
          text: inputRef.current.value,
          startTime: currentTime,
        })
        .then(({data}) => onClose(data.data))
    }
  }

  return (
    <div
      className="w-[34rem] h-[20rem] rounded-md bg-white p-4 flex flex-col"
      id="add-note-overlay"
    >
      <div className="flex-shrink-0 flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500"
          tabIndex={0}
        >
          <VisuallyHidden>Close</VisuallyHidden>
          <span aria-hidden="true">
            <IconX />
          </span>
        </button>
      </div>
      <div className="flex-grow my-3">
        <textarea
          ref={inputRef}
          tabIndex={0}
          className="w-full h-full rounded-lg resize-none border-gray-300 p-3 placeholder-gray-400 text-black transition duration-150 ease-in-out focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-50"
          placeholder={`Write a note...\n\nYou can use markdown to [add links](https://stackoverflow.com), **bold text** or \`write syntax\``}
        />
      </div>
      <div className="flex-shrink-0 flex justify-between items-end">
        <Switch.Group>
          <div className="flex items-center">
            {/* @ts-expect-error */}
            <Switch
              tabIndex={0}
              checked={enabled}
              onChange={setEnabled}
              className={`${
                enabled ? 'bg-blue-600' : 'bg-gray-200'
              } relative inline-flex items-center h-6 rounded-full w-11 transition duration-150 ease-in-out focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-50`}
            >
              <span
                className={`${
                  enabled ? 'translate-x-[1.375rem]' : 'translate-x-0.5'
                } inline-block w-5 h-5 bg-white rounded-full transition-transform`}
              />
            </Switch>
            <Switch.Label className="ml-4 text-gray-500 text-sm">
              Publicly visible
            </Switch.Label>
          </div>
        </Switch.Group>
        <button
          type="button"
          tabIndex={0}
          onClick={addNote}
          className="inline-flex justify-center items-center px-4 py-2 rounded-md bg-blue-600 text-white transition-all hover:bg-blue-700 duration-150 ease-in-out focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-50"
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
