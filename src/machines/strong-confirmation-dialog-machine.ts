import {assign, createMachine} from 'xstate'

export interface StrongConfirmationDialogMachineContext {
  action?: () => Promise<void>
  errorMessage?: string
  doubleConfirmText?: string
  inputConfirmText: string
  invitationDetails: {
    accountId: number | undefined
    inviteeEmail: string
    ownerId: string | undefined
  }
}

export type StrongConfirmationDialogMachineEvent =
  | {
      type: 'OPEN_DIALOG'
      action: () => Promise<void>
      invitationDetails: {
        accountId: number | undefined
        inviteeEmail: string
        ownerId: string | undefined
      }
      doubleConfirmText?: string
    }
  | {
      type: 'CONFIRM'
    }
  | {
      type: 'CANCEL'
    }
  | {
      type: 'CHANGE'
      inputConfirmText?: string
    }
  | {
      type: 'REPORT_MATCHING'
    }

const strongConfirmationDialogMachine = createMachine<
  StrongConfirmationDialogMachineContext,
  StrongConfirmationDialogMachineEvent
>(
  {
    id: 'confirmationDialog',
    initial: 'closed',
    context: {
      action: () => Promise.resolve(),
      invitationDetails: {
        accountId: undefined,
        inviteeEmail: '',
        ownerId: undefined,
      },
      inputConfirmText: '',
    },
    states: {
      closed: {
        id: 'closed',
        entry: ['clearErrorMessage', 'clearActionFromContext'],
        on: {
          OPEN_DIALOG: {
            target: 'open',
            actions: 'assignActionToContext',
          },
        },
      },
      open: {
        initial: 'idle',
        on: {
          CANCEL: {
            target: '#closed',
          },
          CHANGE: {
            target: '.idle',
            internal: false,
            actions: 'handleChangeToInputConfirmText',
          },
        },
        states: {
          idle: {
            on: {
              REPORT_MATCHING: {
                target: 'confirmable',
                actions: [],
              },
            },
            invoke: {
              src: 'checkInputConfirmText',
              onDone: 'idle',
            },
          },
          confirmable: {
            on: {
              CONFIRM: 'executingAction',
            },
          },
          executingAction: {
            invoke: {
              src: 'executeAction',
              onError: {
                target: 'idle',
                actions: ['assignErrorMessageToContext', 'onFail'],
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
      executeAction: (context) => async () => {
        if (!context.action) return Promise.reject()

        await context.action()
      },
      checkInputConfirmText: (context) => (send) => {
        if (context.doubleConfirmText === context.inputConfirmText) {
          send('REPORT_MATCHING')
        }
      },
    },
    actions: {
      assignActionToContext: assign((_context, event) => {
        if (event.type !== 'OPEN_DIALOG') return {}
        return {
          action: event.action,
          doubleConfirmText: event.doubleConfirmText,
        }
      }),
      handleChangeToInputConfirmText: assign((_context, event) => {
        if (event.type !== 'CHANGE') return {}
        return {
          inputConfirmText: event.inputConfirmText,
        }
      }),
      assignErrorMessageToContext: assign((_context, event: any) => {
        const defaultPreamble =
          'There was an issue sending the ownership transfer invite.'
        const errorMessage = `${
          event.data?.response?.data?.error || defaultPreamble
        } Please contact support@egghead.io if the issue persists.`

        return {
          errorMessage,
        }
      }),
      clearErrorMessage: assign((_context) => {
        return {
          errorMessage: undefined,
        }
      }),
      clearActionFromContext: assign((_context) => {
        return {
          action: () => Promise.resolve(),
          invitationDetails: {
            accountId: undefined,
            inviteeEmail: '',
            ownerId: undefined,
          },
          inputConfirmText: '',
        }
      }),
      onSuccess: () => {
        console.log(
          'Default onSuccess: to be replaced when the machine is interpreted.',
        )
      },
      onFail: () => {
        console.log(
          'Default onFail: to be replaced when the machine is interpreted.',
        )
      },
    },
  },
)

export default strongConfirmationDialogMachine
