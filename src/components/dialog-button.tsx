import * as React from 'react'
import LockIcon from './icons/lock'
import {DialogOverlay, DialogContent} from '@reach/dialog'
import Link from 'next/link'
import slugify from 'slugify'

const PlanFeatures = () => {
  const DEFAULT_FEATURES = [
    'Full access to all premium courses and lessons',
    'RSS course feeds for your favorite podcast app',
    'Offline viewing',
    'Commenting and support',
    'Enhanced Transcripts',
    'Closed captions for every video',
  ]
  const CheckIcon = () => (
    <svg
      className="text-blue-500 inline-block flex-shrink-0 mt-1"
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
    >
      <path
        fill="currentColor"
        d="M6.00266104,15 C5.73789196,15 5.48398777,14.8946854 5.29679603,14.707378 L0.304822855,9.71382936 C0.0452835953,9.46307884 -0.0588050485,9.09175514 0.0325634765,8.74257683 C0.123932001,8.39339851 0.396538625,8.12070585 0.745606774,8.02930849 C1.09467492,7.93791112 1.46588147,8.04203262 1.71655287,8.30165379 L5.86288579,12.4482966 L14.1675324,0.449797837 C14.3666635,0.147033347 14.7141342,-0.0240608575 15.0754425,0.00274388845 C15.4367507,0.0295486344 15.7551884,0.250045268 15.9074918,0.578881992 C16.0597953,0.907718715 16.0220601,1.29328389 15.8088932,1.58632952 L6.82334143,14.5695561 C6.65578773,14.8145513 6.38796837,14.9722925 6.09251656,15 C6.06256472,15 6.03261288,15 6.00266104,15 Z"
      />
    </svg>
  )

  return (
    <ul className="px-4">
      {DEFAULT_FEATURES.map((feature: string) => {
        return (
          <li className="py-2 font-medium flex" key={slugify(feature)}>
            <CheckIcon />
            <span className="ml-3 leading-tight">{feature}</span>
          </li>
        )
      })}
    </ul>
  )
}

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
      <p className="max-w-10 text-center text-gray-700">
        PRO members also get:
      </p>
      <PlanFeatures />

      <button className="font-semibold w-full mt-6 inline-flex justify-center items-center px-4 py-3 rounded-md bg-blue-600 text-white transition-all hover:bg-blue-700 ease-in-out duration-200">
        Become a Member
      </button>
      <Link href="/pricing">
        <a className="text-sm w-full inline-flex justify-center items-center pb-2 rounded-md text-blue-600 underline transition-all hover:text-blue-800 ease-in-out duration-200">
          Learn more about membership
        </a>
      </Link>
    </DialogButton>
  )
}
