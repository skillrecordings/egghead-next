import React, {FunctionComponent} from 'react'
import {DialogOverlay, DialogContent} from '@reach/dialog'
import IconX from 'components/icons/icon-x'

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
          className="bg-white rounded-md border-gray-400 p-8"
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
