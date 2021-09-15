import * as React from 'react'
import LockIcon from '../../icons/lock'
import {DialogOverlay, DialogContent} from '@reach/dialog'
import Link from 'next/link'
import FeaturesList from '../../pro-member-features'

export const DialogButton = ({
  title,
  buttonStyles,
  buttonText,
  children,
}: any) => {
  const [showDialog, setShowDialog] = React.useState(false)

  const openDialog = () => {
    setShowDialog(true)
  }

  const closeDialog = () => {
    setShowDialog(false)
  }

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
          aria-label="sign in to bookmark"
          className="bg-white dark:bg-gray-900 shadow-lg rounded-lg max-w-screen-sm border dark:border-gray-800 relative p-3 xs:p-6 w-112"
        >
          <div className="w-full flex flex-col">
            {title && (
              <h4 className="text-lg sm:text-xl mb-4 font-semibold text-center px-4 leading-tight">
                {title}
              </h4>
            )}
            <div className="flex flex-col space-y-4">
              {children && children}
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

export const MembershipDialogButton = ({title, children, buttonText}: any) => {
  return (
    <DialogButton
      buttonText={buttonText}
      title={title}
      buttonStyles="text-gray-600 dark:text-gray-300 flex flex-row items-center rounded hover:bg-gray-100 
        dark:hover:bg-gray-700 border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600 px-4 py-2 border transition-colors text-sm xs:text-base ease-in-out opacity-90 shadow-sm"
    >
      <p className="max-w-10 text-center text-gray-700">{children}</p>
      <p className="max-w-10 text-center text-gray-700">PRO members get:</p>
      <FeaturesList />
      <Link href="/pricing">
        <a className="text-sm w-full inline-flex justify-center items-center pb-2 rounded-md text-blue-600 underline transition-all hover:text-blue-800 ease-in-out duration-200">
          <button className="font-semibold w-full mt-6 inline-flex justify-center items-center px-4 py-3 rounded-md bg-blue-600 text-white transition-all hover:bg-blue-700 ease-in-out duration-200">
            Become a Member
          </button>
        </a>
      </Link>
    </DialogButton>
  )
}
