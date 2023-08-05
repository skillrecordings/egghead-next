import * as React from 'react'
import {FunctionComponent} from 'react'
import {track} from 'utils/analytics'
import Tippy from '@tippyjs/react'
import {useViewer} from 'context/viewer-context'

type AddNoteButtonProps = {
  lesson: any
  onAddNote?: () => void
}

type AddNoteControlProps = {
  lesson: any
  key: string
  order: number
  actions?: any
  onAddNote?: () => void
}

const notesCreationAvailable = process.env.NEXT_PUBLIC_NOTES_ENABLED === 'true'

const NewNoteButton: FunctionComponent<
  React.PropsWithChildren<AddNoteButtonProps>
> = ({lesson, onAddNote}) => {
  const {viewer} = useViewer()
  const canCreateNote = viewer?.can_comment && notesCreationAvailable
  return (
    <button
      onClick={() => {
        if (canCreateNote && onAddNote) {
          onAddNote()
        }
        track(`clicked add note`, {
          lesson: lesson.slug,
        })
      }}
      aria-label="download video"
      className={`w-10 h-10 flex items-center justify-center border-none text-white ${
        !canCreateNote ? 'opacity-50 cursor-default' : ''
      }`}
    >
      Add Note
    </button>
  )
}

const AddNoteControl: FunctionComponent<
  React.PropsWithChildren<AddNoteControlProps>
> = ({lesson, actions, onAddNote}) => {
  const {viewer} = useViewer()
  const canCreateNote = viewer?.can_comment && notesCreationAvailable

  return canCreateNote ? (
    <NewNoteButton
      lesson={lesson}
      onAddNote={() => {
        if (actions) actions.pause()
        if (onAddNote) onAddNote()
      }}
    />
  ) : (
    <Tippy content="Notes feature is for members only">
      <div>
        <NewNoteButton lesson={lesson} />
      </div>
    </Tippy>
  )
}

export default AddNoteControl
