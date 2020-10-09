/** @jsx jsx */
import {jsx} from '@emotion/core'
import React, {FunctionComponent, useState} from 'react'
import VisuallyHidden from '@reach/visually-hidden'
import {DialogOverlay, DialogContent} from '@reach/dialog'

type DialogProps = {
  children: React.ReactNode
  ariaLabel: string
  title: string
  buttonText: string
  buttonStyles: string
}
const Dialog: FunctionComponent<DialogProps> = ({
  children,
  ariaLabel,
  title,
  buttonText,
  buttonStyles = '',
}) => {
  const [showDialog, setShowDialog] = React.useState(false)
  const open = () => setShowDialog(true)
  const close = () => setShowDialog(false)
  return (
    <div>
      <button onClick={open} className={buttonStyles}>
        {buttonText}
      </button>
      <DialogOverlay isOpen={showDialog} onDismiss={close}>
        <DialogContent
          aria-label={ariaLabel}
          className="bg-white rounded-md border-gray-400"
          css={{padding: '2rem'}}
        >
          <div className="flex justify-center relative mb-6">
            {title && <h3 className="text-xl font-medium">{title}</h3>}
            <button onClick={close} className="absolute right-0 top-0">
              <IconX className="w-5" />
            </button>
          </div>
          {children}
        </DialogContent>
      </DialogOverlay>
    </div>
  )
}

export default Dialog

const IconX: FunctionComponent<{className?: string}> = ({className = ''}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
)
