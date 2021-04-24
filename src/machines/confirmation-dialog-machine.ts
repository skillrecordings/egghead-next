// Source: https://xstate-catalogue.com/machines/confirmation-dialog
import {assign, createMachine} from 'xstate'
import {Dispatch, SetStateAction} from 'react'
import {getAuthorizationHeader} from 'utils/auth'
import axios from 'axios'

type Member = {
  id: number
  name: string
  email: string
}

export interface ConfirmationDialogMachineContext {
  action?: () => Promise<void>
  errorMessage?: string
  accountId: number | undefined
  memberToRemove: Member | undefined
  setMembers: Dispatch<SetStateAction<any[]>>
}

type ConfirmationDialogMachineEvent =
  | {
      type: 'OPEN_DIALOG'
      action: () => Promise<void>
    }
  | {
      type: 'CONFIRM'
    }
  | {
      type: 'CANCEL'
    }

const removeTeamMember = (accountId: number, userId: number) => {
  if (accountId) {
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
            actions: 'assignActionToContext',
          },
        },
      },
      open: {
        exit: ['clearErrorMessage'],
        initial: 'idle',
        states: {
          idle: {
            on: {
              CANCEL: {
                target: '#closed',
                actions: [assign({memberToRemove: undefined})],
              },
              CONFIRM: 'executingAction',
            },
          },
          executingAction: {
            invoke: {
              src: 'executeAction',
              onError: {
                target: 'idle',
                actions: 'assignErrorMessageToContext',
              },
              onDone: {
                target: '#closed',
                actions: ['clearActionFromContext', 'onSuccess'],
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
        const {memberToRemove, accountId} = context

        await removeTeamMember(accountId, memberToRemove.id)
      },
    },
    actions: {
      assignActionToContext: assign((context, event) => {
        if (event.type !== 'OPEN_DIALOG') return {}

        return {
          action: event.action,
          memberToRemove: event.payload.member,
        }
      }),
      assignErrorMessageToContext: assign((context, event: any) => {
        return {
          errorMessage: event.data?.message || 'An unknown error occurred',
        }
      }),
      clearErrorMessage: assign({
        errorMessage: undefined,
      }),
      clearActionFromContext: assign({
        action: undefined,
      }),
      onSuccess: (context) => {
        const {id: userId} = context.memberToRemove

        context.setMembers((prevMembers: any[]) => {
          return prevMembers.filter(({id}: {id: number}) => id !== userId)
        })
      },
    },
  },
)

export default confirmationDialogMachine
