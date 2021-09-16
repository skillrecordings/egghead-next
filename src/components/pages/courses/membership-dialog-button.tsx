import * as React from 'react'
import Link from 'next/link'
import FeaturesList from '../../pro-member-features'
import DialogButton from './dialog-button'

const MembershipDialogButton = ({title, children, buttonText}: any) => {
  return (
    <DialogButton
      buttonText={buttonText}
      title={title}
      buttonStyles="text-gray-600 dark:text-gray-300 flex flex-row items-center rounded hover:bg-gray-100 
        dark:hover:bg-gray-700 border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600 px-4 py-2 border transition-colors text-sm xs:text-base ease-in-out opacity-90 shadow-sm"
    >
      <p className="max-w-10 text-center text-gray-700 dark:text-gray-400">
        {children}
      </p>
      <p className="uppercase text-sm tracking-wide text-gray-500 font-bold text-center border-t border-gray-200 dark:border-gray-700 pt-5">
        Membership includes
      </p>
      <FeaturesList />
      <Link href="/pricing">
        <a className="w-full inline-flex justify-center rounded-md text-blue-600 transition-all hover:text-blue-800 ease-in-out duration-200">
          <button className="font-semibold w-full inline-flex justify-center py-4 rounded-md bg-blue-600 text-white transition-all hover:bg-blue-700 ease-in-out duration-200">
            Become a Member
          </button>
        </a>
      </Link>
    </DialogButton>
  )
}

export default MembershipDialogButton
