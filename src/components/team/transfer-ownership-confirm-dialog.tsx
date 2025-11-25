import * as React from 'react'
import * as AlertDialog from '@radix-ui/react-alert-dialog'
import IconX from '@/components/icons/icon-x'
import {State} from 'xstate'

type DialogProps = {
  current: any
  inviteeEmail: string
  inviteeEmailConfirmation: string
  onClose: () => void
  onConfirm: () => void
  handleInputChange: (value: string) => void
}

const TransferOwnershipConfirmDialog: React.FunctionComponent<
  React.PropsWithChildren<DialogProps>
> = ({
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
    <AlertDialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <AlertDialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 dark:bg-gray-900 bg-white rounded-md border-gray-400 p-8 w-96 lg:w-1/3 z-50">
          <div className="flex justify-center relative mb-6">
            <AlertDialog.Title className="text-xl font-medium">
              Are you sure?
            </AlertDialog.Title>
            <AlertDialog.Cancel asChild>
              <button className="absolute right-0 top-0">
                <IconX className="w-5" />
              </button>
            </AlertDialog.Cancel>
          </div>
          <AlertDialog.Description asChild>
            <div className="flex flex-col space-y-4">
              <p>
                Confirm that you would like to transfer your ownership of this
                team account to{' '}
                <strong className="font-semibold text-gray-800 dark:text-white">
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
              <div className="flex flex-row justify-center space-x-2">
                <AlertDialog.Action asChild>
                  <button
                    disabled={
                      loading || !current.matches({open: 'confirmable'})
                    }
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
                </AlertDialog.Action>
                <AlertDialog.Cancel asChild>
                  <button
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
                </AlertDialog.Cancel>
              </div>
            </div>
          </AlertDialog.Description>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}

export default TransferOwnershipConfirmDialog
