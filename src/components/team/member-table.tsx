import * as React from 'react'
import {format} from 'date-fns'
import {StateValue} from 'xstate'
import {useMachine} from '@xstate/react'
import confirmationDialogMachine, {
  ConfirmationDialogMachineContext,
  ConfirmationDialogMachineEvent,
} from 'machines/confirmation-dialog-machine'
import RemoveMemberConfirmDialog from 'components/team/remove-member-confirm-dialog'

const MemberTable = ({
  accountId,
  members,
  setMembers,
}: {
  accountId: number
  members: any[]
  setMembers: any
}) => {
  const initialContext: ConfirmationDialogMachineContext = {
    accountId,
    setMembers,
    memberToRemove: undefined,
  }
  const [current, send] = useMachine<
    ConfirmationDialogMachineContext,
    ConfirmationDialogMachineEvent
  >(confirmationDialogMachine, {
    context: initialContext,
  })

  return (
    <>
      <RemoveMemberConfirmDialog
        state={current.value}
        isOpen={current.value !== 'closed'}
        onClose={() => {
          send('CANCEL')
        }}
        onConfirm={() => {
          send('CONFIRM')
        }}
        member={current.context.memberToRemove}
      />
      <div className="bg-white border border-gray-200 dark:border-gray-700 overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {members.map((member: any, i: number) => {
            const {
              id,
              name,
              email,
              roles,
              date_added,
            }: {
              id: number
              name: string
              email: string
              roles: string[]
              date_added: string
            } = member
            const isOwner = roles.includes('Owner')

            return (
              <li
                key={id}
                className={
                  i % 2 === 0
                    ? 'bg-gray-100 dark:bg-gray-800'
                    : 'bg-white dark:bg-gray-900'
                }
              >
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium truncate">
                      {name ? (
                        <span>
                          {name} ({email})
                        </span>
                      ) : (
                        <span>{email}</span>
                      )}
                    </p>
                    <div className="ml-2 flex-shrink-0 flex">
                      {!isOwner && (
                        <p
                          onClick={() => {
                            send({
                              type: 'OPEN_DIALOG',
                              payload: {member: {id, name, email}},
                            })
                          }}
                          className="cursor-pointer px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 dark:bg-red-700 text-red-800 dark:text-red-100 hover:shadow"
                        >
                          Remove
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500 dark:text-gray-300">
                        {roles.join(', ')}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-300 sm:mt-0">
                      <p>
                        Joined on{' '}
                        <time dateTime={date_added}>
                          {format(new Date(date_added), 'yyyy/MM/dd')}
                        </time>
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </>
  )
}

export default MemberTable
