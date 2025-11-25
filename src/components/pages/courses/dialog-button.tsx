import * as React from 'react'
import LockIcon from '../../icons/lock'
import * as Dialog from '@radix-ui/react-dialog'

const DialogButton = ({title, buttonStyles, buttonText, children}: any) => {
  const [showDialog, setShowDialog] = React.useState(false)

  const labelId = `label--${React.useId()}`

  return (
    <Dialog.Root open={showDialog} onOpenChange={setShowDialog}>
      <Dialog.Trigger asChild>
        <button className={buttonStyles && buttonStyles}>
          <LockIcon className="h-4 w-4 mr-2" /> {buttonText}
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center px-4 py-6 xs:px-6 xs:py-8 z-50" />
        <Dialog.Content
          aria-labelledby={labelId}
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 shadow-lg rounded-lg max-w-screen-sm border dark:border-gray-800 xs:px-6 py-6 z-50"
          style={{width: '28rem'}}
        >
          <div className="w-full flex flex-col mt-3 mb-3">
            {title && (
              <Dialog.Title
                id={labelId}
                className="text-xl sm:text-2xl mb-3 font-semibold text-center px-0 sm:px-6 leading-7 sm:leading-9"
              >
                {title}
              </Dialog.Title>
            )}
            <div className="flex flex-col space-y-4">{children}</div>
          </div>
          <div className="block absolute top-0 right-0 pt-3 pr-3">
            <Dialog.Close asChild>
              <button
                type="button"
                className={`text-gray-500 dark:text-gray-400 hover:bg-blue-100 hover:text-blue-600 dark:hover:text-blue-300 dark:hover:bg-gray-700 p-1 focus:shadow-outline-blue transition-all rounded-full hover:scale-110 ease-in-out duration-200`}
                aria-label="Close"
              >
                <span className="sr-only">close dialog</span>
                {/* prettier-ignore */}
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default DialogButton
