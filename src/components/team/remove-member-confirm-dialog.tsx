import React, {FunctionComponent} from 'react'
import * as AlertDialog from '@radix-ui/react-alert-dialog'
import IconX from '@/components/icons/icon-x'
import isObject from 'lodash/isObject'
import {StateValue} from 'xstate'

type DialogProps = {
  state: StateValue
  isOpen: boolean
  onClose: () => void
  member:
    | {
        id: number
        name: string
        email: string
      }
    | undefined
  onConfirm: () => void
}

const RemoveMemberConfirmDialog: FunctionComponent<
  React.PropsWithChildren<DialogProps>
> = ({state, onClose, member, onConfirm}) => {
  const isOpen = state !== 'closed'
  const loading = isObject(state) && state?.open === 'executingAction'
  const {name, email} = member || {}

  return (
    <AlertDialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <AlertDialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-md border-gray-400 p-8 z-50">
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
                Confirm that you would like to remove this member from your
                team.
              </p>
              <p className="font-semibold text-gray-800">
                {name ? (
                  <span>
                    {name} ({email})
                  </span>
                ) : (
                  <span>{email}</span>
                )}
              </p>
              <div className="flex flex-row justify-end space-x-2">
                <AlertDialog.Action asChild>
                  <button
                    disabled={loading}
                    onClick={onConfirm}
                    className={`text-white bg-red-600 border-0 py-2 px-4 focus:outline-none rounded-md
                        ${
                          loading
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

export default RemoveMemberConfirmDialog
