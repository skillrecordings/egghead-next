import * as React from 'react'
import {DialogOverlay, DialogContent} from '@reach/dialog'
import IconX from 'components/icons/icon-x'
import {State} from 'xstate'

type DialogProps = {
  current: any
  inviteeEmail: string
  inviteeEmailConfirmation: string
  onClose: () => void
  onConfirm: () => void
  handleInputChange: (value: string) => void
}

const TransferOwnershipConfirmDialog: React.FunctionComponent<DialogProps> = ({
  current,
  inviteeEmail,
  inviteeEmailConfirmation,
  onClose,
  onConfirm,
  handleInputChange,
}) => {
  const isOpen = !current.matches('closed')
  const loading = current.matches({open: 'executingAction'})

  return (
    <div>
      <DialogOverlay isOpen={isOpen} onDismiss={onClose}>
        <DialogContent
          aria-label="Confirm removing team member"
          className="bg-white rounded-md border-gray-400"
          css={{padding: '2rem'}}
        >
          <div className="flex justify-center relative mb-6">
            <h3 className="text-xl font-medium">Are you sure?</h3>
            <button onClick={onClose} className="absolute right-0 top-0">
              <IconX className="w-5" />
            </button>
          </div>
          <div className="flex flex-col space-y-4">
            <p>
              Confirm that you would like to transfer your ownership of this
              team account to{' '}
              <strong className="font-semibold text-gray-800">
                {inviteeEmail}
              </strong>{' '}
              by re-typing their email. Then click 'Confirm'.
            </p>
            {current.context.errorMessage && (
              <p className="text-sm text-red-600">
                {current.context.errorMessage}
              </p>
            )}
            <input
              id="email"
              type="email"
              value={inviteeEmailConfirmation}
              onChange={(e) => handleInputChange(e.target.value)}
              autoFocus
              required
              disabled={loading}
              className="bg-gray-50 dark:bg-gray-800 focus:outline-none focus:shadow-outline border border-gray-100 dark:border-gray-700 rounded-md py-2 px-4 block w-full appearance-none leading-normal"
            />
            <div className="flex flex-row justify-end space-x-2">
              <button
                disabled={loading || !current.matches({open: 'confirmable'})}
                onClick={onConfirm}
                className={`text-white bg-red-600 border-0 py-2 px-4 focus:outline-none rounded-md
                    ${
                      loading || !current.matches({open: 'confirmable'})
                        ? 'cursor-not-allowed opacity-50'
                        : 'hover:bg-red-700'
                    }`}
              >
                Confirm
              </button>
              <button
                onClick={onClose}
                disabled={loading}
                className={`text-gray-700 bg-white border border-1 border-gray-700 py-2 px-4 focus:outline-none rounded-md
                    ${
                      loading
                        ? 'cursor-not-allowed opacity-50'
                        : 'hover:bg-gray-200'
                    }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </DialogContent>
      </DialogOverlay>
    </div>
  )
}

export default TransferOwnershipConfirmDialog
