import React, {FunctionComponent} from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import IconX from '@/components/icons/icon-x'

type DialogProps = {
  children: React.ReactNode
  ariaLabel: string
  title: string
  buttonText: string
  buttonStyles: string
  disabled: boolean | undefined
}
const Dialog: FunctionComponent<React.PropsWithChildren<DialogProps>> = ({
  children,
  ariaLabel,
  title,
  buttonText,
  buttonStyles = '',
  disabled = false,
}) => {
  const [showDialog, setShowDialog] = React.useState(false)
  return (
    <DialogPrimitive.Root open={showDialog} onOpenChange={setShowDialog}>
      <DialogPrimitive.Trigger asChild>
        <button disabled={disabled} className={buttonStyles}>
          {buttonText}
        </button>
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <DialogPrimitive.Content
          aria-label={ariaLabel}
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-50 dark:bg-gray-1000 rounded-md border-gray-400 p-8 w-11/12 sm:w-1/2 z-50"
        >
          <div className="flex justify-center relative mb-6">
            {title && (
              <DialogPrimitive.Title className="text-xl font-medium">
                {title}
              </DialogPrimitive.Title>
            )}
            <DialogPrimitive.Close asChild>
              <button className="absolute right-0 top-0">
                <IconX className="w-5" />
              </button>
            </DialogPrimitive.Close>
          </div>
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

export default Dialog
