import * as React from 'react'

import {useViewer} from 'context/viewer-context'
import {Dialog, Transition} from '@headlessui/react'
import {trpc} from 'trpc/trpc.client'
import toast from 'react-hot-toast'
import {useRouter} from 'next/router'
import analytics from 'utils/analytics'

const DeleteAccount: React.FC<React.PropsWithChildren<{}>> = () => {
  const [dialogIsOpen, setDialogIsOpen] = React.useState(false)

  return (
    <div className="mt-12 space-y-2">
      <h2 className="pb-3 md:pb-4 text-lg font-medium md:font-normal md:text-xl leading-none text-red-500 ">
        Danger Zone
      </h2>
      <p className="opacity-80">
        Permanently delete your account, this is not reversable.
      </p>
      <button
        className="inline-block px-4 py-3 text-gray-900 hover:text-white dark:text-white border-red-600 border rounded focus:outline-none hover:bg-red-700"
        onClick={() => setDialogIsOpen(true)}
      >
        Delete Account
      </button>
      <AccountDeletionDialog
        isOpen={dialogIsOpen}
        setIsOpen={setDialogIsOpen}
      />
    </div>
  )
}

const AccountDeletionDialog = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean
  setIsOpen: Function
}) => {
  const {viewer, logout} = useViewer()
  const router = useRouter()

  const deleteAccount = trpc.user.deleteAccount.useMutation({
    onSuccess: async (data) => {
      toast.success(`Account for ${viewer?.email} deleted.`, {
        duration: 6000,
        icon: '✅',
      })
      analytics.events.activityCtaClick(
        'account deletion',
        String(data?.delete_user?.deleted_user_id),
      )
      localStorage.clear()
      logout()
      router.push('/')
    },
    onError: (error) => {
      toast.error(
        'Error deleting account, contact support at support@egghead.io',
        {
          duration: 6000,
          icon: '❌',
        },
      )
    },
  })

  const handleSubmit = (e: any) => {
    e.preventDefault()

    deleteAccount.mutate()
  }

  return (
    <Transition show={isOpen} as="div">
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50 w-full"
      >
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="fixed inset-0 bg-black/30 dark:bg-white/30"
            aria-hidden="true"
          />
        </Transition.Child>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="fixed inset-0 flex items-center justify-center p-4 w-full">
            <Dialog.Panel className="flex flex-col items-center max-w-lg rounded dark:bg-gray-900 bg-white dark:text-gray-200 text-black p-8 w-full">
              <Dialog.Title className=" text-xl font-bold">
                Delete your egghead account
              </Dialog.Title>

              <div className="space-y-2 mt-8">
                <p className="">
                  This will remove your account ({viewer?.email}) from our
                  system.
                </p>
                <p className="">
                  This includes all personally identifiable information (email
                  address, IP address, name, etc).
                </p>
                <p className=""></p>
                <strong>WARNING</strong> This action is irreversable.{' '}
                <strong>egghead support cannot recover your account.</strong>
                <p className="">
                  To delete your account, type <strong>goodbye egghead</strong>{' '}
                  below.
                </p>
              </div>

              <form className="w-full" onSubmit={handleSubmit}>
                <input
                  className="mt-4 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:shadow-outline border border-red-100 dark:border-red-700 rounded-md py-2 px-4 block w-full appearance-none leading-normal resize-y prose text-gray-900 dark:prose-dark md:prose-lg md:dark:prose-lg-dark dark:text-gray-100 dark:prose-a:text-blue-300 dark:hover:prose-a:text-blue-200 prose-a:text-blue-500 hover:prose-a-:text-blue-600 mb-4"
                  id="confirmation"
                  required
                  pattern="[Gg]oodbye [Ee]gghead"
                />
                <div className="flex flex-start w-full gap-4">
                  <button
                    type="submit"
                    className="inline-block px-4 py-3  text-white border-red-600 border rounded focus:outline-none bg-red-700 hover:bg-red-500"
                  >
                    Delete Account
                  </button>
                  <button
                    type="reset"
                    className="inline-block px-4 py-3 text-gray-900 hover:text-white dark:text-white border-gray-600 border rounded focus:outline-none hover:bg-gray-700"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  )
}

export default DeleteAccount
