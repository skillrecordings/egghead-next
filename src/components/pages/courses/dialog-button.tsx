import * as React from 'react'
import LockIcon from '../../icons/lock'
import {DialogOverlay, DialogContent} from '@reach/dialog'
import {useId} from '@reach/auto-id'

const DialogButton = ({title, buttonStyles, buttonText, children}: any) => {
  const [showDialog, setShowDialog] = React.useState(false)

  const openDialog = () => {
    setShowDialog(true)
  }

  const closeDialog = () => {
    setShowDialog(false)
  }

  const labelId = `label--${useId(title)}`

  return (
    <>
      <button className={buttonStyles && buttonStyles} onClick={openDialog}>
        <LockIcon className="h-4 w-4 mr-2" /> {buttonText}
      </button>
      <DialogOverlay
        isOpen={showDialog}
        onDismiss={closeDialog}
        className="bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 xs:px-6 xs:py-8 z-50"
      >
        <DialogContent
          aria-labelledby={labelId}
          className="bg-white dark:bg-gray-900 shadow-lg rounded-lg max-w-screen-sm border dark:border-gray-800 relative p-3 xs:p-6"
          style={{width: '28rem'}}
        >
          <div className="w-full flex flex-col">
            {title && (
              <h4
                id={labelId}
                className="text-lg sm:text-xl mb-4 font-semibold text-center px-4 leading-tight"
              >
                {title}
              </h4>
            )}
            <div className="flex flex-col space-y-4">
              {children}
            </div>
          </div>
          <div className="block absolute top-0 right-0 pt-3 pr-3">
            <button
              onClick={closeDialog}
              type="button"
              className={`text-gray-500 dark:text-gray-400 hover:bg-blue-100 hover:text-blue-600 dark:hover:text-blue-300 dark:hover:bg-gray-700 p-1 focus:shadow-outline-blue transition-all rounded-full hover:scale-110 ease-in-out duration-200`}
              aria-label="Close"
            >
              <span className="sr-only">close feedback dialog</span>
              {/* prettier-ignore */}
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </DialogContent>
      </DialogOverlay>
    </>
  )
}

export default DialogButton
