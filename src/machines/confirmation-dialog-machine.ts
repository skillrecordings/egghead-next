// Source: https://xstate-catalogue.com/machines/confirmation-dialog
import {assign, createMachine} from 'xstate'
import {Dispatch, SetStateAction} from 'react'
import {getAuthorizationHeader} from 'utils/auth'
import axios from 'axios'
import toast from 'react-hot-toast'

type Member = {
  id: number
  name: string
  email: string
}

export interface ConfirmationDialogMachineContext {
  accountId: number | undefined
  memberToRemove: Member | undefined
  setMembers: Dispatch<SetStateAction<any[]>>
}

export type ConfirmationDialogMachineEvent =
  | {
      type: 'OPEN_DIALOG'
      payload: {member: Member}
    }
  | {
      type: 'CONFIRM'
    }
  | {
      type: 'CANCEL'
    }

const removeTeamMember = (
  accountId: number | undefined,
  userId: number | undefined,
) => {
  if (accountId && userId) {
    const removeTeamMemberUrl = `${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/api/v1/accounts/${accountId}/team_members/${userId}`

    return axios.delete(removeTeamMemberUrl, {
      headers: {...getAuthorizationHeader()},
    })
  }
}

const confirmationDialogMachine = createMachine<
  ConfirmationDialogMachineContext,
  ConfirmationDialogMachineEvent
>(
  {
    id: 'confirmationDialog',
    initial: 'closed',
    context: {
      accountId: undefined,
      memberToRemove: undefined,
      setMembers: () => {},
    },
    states: {
      closed: {
        id: 'closed',
        on: {
          OPEN_DIALOG: {
            target: 'open',
            actions: 'assignMemberToRemoveToContext',
          },
        },
      },
      open: {
        exit: ['clearMemberToRemoveFromContext'],
        initial: 'idle',
        states: {
          idle: {
            on: {
              CANCEL: {
                target: '#closed',
                actions: [
                  assign((_context) => {
                    return {memberToRemove: undefined}
                  }),
                ],
              },
              CONFIRM: 'executingAction',
            },
          },
          executingAction: {
            invoke: {
              src: 'executeAction',
              onError: {
                target: '#closed',
                actions: 'displayErrorToast',
              },
              onDone: {
                target: '#closed',
                actions: 'onSuccess',
              },
            },
          },
        },
      },
    },
  },
  {
    services: {
      executeAction: (context, _event) => async () => {
        const userId = context?.memberToRemove?.id
        const {accountId} = context

        await removeTeamMember(accountId, userId)
      },
    },
    actions: {
      assignMemberToRemoveToContext: assign((_context, event) => {
        if (event.type !== 'OPEN_DIALOG') return {}

        return {
          memberToRemove: event.payload.member,
        }
      }),
      displayErrorToast: (context) => {
        const {name, email} = context.memberToRemove || {}

        let displayName: string
        if (name && email) {
          displayName = `${name} (${email})`
        } else if (email) {
          displayName = email
        } else {
          displayName = 'that member'
        }

        toast.error(
          `There was a problem removing ${displayName} from your team. Contact support@egghead.io if the issue persists.`,
          {
            duration: 6000,
            icon: '❌',
          },
        )
      },
      clearMemberToRemoveFromContext: assign((_context) => {
        return {
          memberToRemove: undefined,
        }
      }),
      onSuccess: (context) => {
        const {id: userId, name, email} = context.memberToRemove || {}

        context.setMembers((prevMembers: any[]) => {
          return prevMembers.filter(({id}: {id: number}) => id !== userId)
        })

        let displayName: string | undefined
        if (name && email) {
          displayName = `${name} (${email})`
        } else if (email) {
          displayName = email
        } else {
          displayName = undefined
        }

        const genericMessage =
          "You've successfully removed that member from your team."

        toast.success(
          displayName
            ? `You've successfully removed ${displayName} from your team.`
            : genericMessage,
          {duration: 3000, icon: '✅'},
        )
      },
    },
  },
)

export default confirmationDialogMachine
