import React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
// import {Module} from '@skillrecordings/skill-lesson/schemas/module'
import {DownloadIcon, XIcon} from '@heroicons/react/solid'
// import {useSession} from 'next-auth/react'
import {useForm} from 'react-hook-form'
import {trpc} from '@/app/_trpc/client'
import {Button, Input, Label} from '@/ui'
import toast from 'react-hot-toast'
import Spinner from '@/components/spinner'
import {ClipboardCopyIcon} from '@heroicons/react/outline'
import {cn} from '@/ui/utils'
import Image from 'next/image'

const CertificateForm: React.FC<React.PropsWithChildren<{module: any}>> = ({
  module,
}) => {
  const {data: userData, status: userStatus} = trpc.user.current.useQuery()
  console.log({userData})
  const form = useForm({
    shouldUseNativeValidation: true,
    defaultValues: {
      name: userData?.full_name || '',
      certificateUrl: `/api/certificate?moduleId=${module.id}&userId=${userData?.id}&name=${userData?.full_name}`,
    },
  })
  const userNameMutation = trpc.user.updateName.useMutation({
    onSuccess: (data) => {
      form.setValue('name', data?.first_name as string)
    },
  })
  const {register, watch} = form

  const handleSubmit = async () => {
    return await userNameMutation
      .mutateAsync({
        name: watch().name,
      })
      .catch((error) => {
        toast.error('Error updating name')
        console.debug(error)
      })
  }

  const imagePath = process.env.NEXT_PUBLIC_URL + watch().certificateUrl

  React.useEffect(() => {
    if (userStatus === 'success' && userData?.id) {
      form.setValue(
        'certificateUrl',
        `${process.env.NEXT_PUBLIC_URL}/api/certificate?moduleId=${module.id}&userId=${userData?.id}&name=${userData?.full_name}`,
      )
    }
  }, [userData, userStatus])

  const certUrl = `${process.env.NEXT_PUBLIC_URL}/api/certificate?moduleId=${module.id}&userId=${userData?.id}&name=${userData?.full_name}`

  const urlInputRef = React.useRef<HTMLInputElement>(null)
  const isSubmitting = form.formState.isSubmitting
  return (
    <Dialog.Portal container={window.document.getElementById('__next')}>
      <Dialog.Overlay className="bg-black/20 fixed inset-0 z-30 backdrop-blur-sm" />
      <Dialog.Content className="fixed left-[50%] top-[50%] z-50 max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] border border-gray-100 bg-white p-[25px] shadow-2xl shadow-black/20 focus:outline-none dark:border-gray-700/50 dark:bg-gray-800 dark:shadow-black/40 dark:text-white">
        <Dialog.Title className=" pb-3 text-xl font-semibold dark:border-gray-700">
          Your Certificate of Completion
        </Dialog.Title>
        <div className="pointer-events-none relative flex items-center justify-center">
          <Image
            src="/images/egghead-course-certificate-template.svg"
            width={1263}
            height={893}
            alt=""
            className="w-full rounded-lg shadow-xl"
          />
          {module.square_cover_480_url && (
            <Image
              className="absolute top-8"
              src={module.square_cover_480_url}
              alt=""
              width={75}
              height={75}
            />
          )}
          <div className="absolute flex flex-col items-center text-center">
            <div className="mt-16">
              <div className="text-xl font-bold">{form.watch('name')}</div>
              <div className="pt-2 text-[0.5rem] text-gray-300">
                Has successfully Completed:
                <div>{module.title}</div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-5 right-5 text-[0.4rem] opacity-75">
            {new Date().toLocaleDateString()}
          </div>
        </div>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <fieldset className="flex flex-col items-start pt-3">
            <Label
              htmlFor="name"
              className="inline-block pb-1 text-lg text-gray-700 dark:text-gray-300"
            >
              Name on the certificate
            </Label>
            <div className="flex w-full items-center gap-2">
              <Input
                {...register('name', {
                  required: true,
                  // onChange: handleNameChange,
                })}
                type="text"
                placeholder="Your name"
                id="name"
                className="flex w-full flex-grow rounded border-none bg-gray-100 px-3 py-2 text-lg font-medium shadow-inner dark:bg-gray-700"
                disabled={isSubmitting}
              />
              <Button
                variant="outline"
                className="inline-flex items-center justify-center rounded border border-primary bg-primary px-3 py-2 text-base font-semibold text-white hover:bg-primary/80 hover:text-white disabled:text-white dark:disabled:text-gray-800"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Spinner className="absolute h-5 w-5 text-foreground" />
                ) : null}
                Save
              </Button>
            </div>
            {/* Using anchor instead of a button to trigger native download action */}
            <div className="mt-5 flex w-full flex-col items-center justify-start gap-5 dark:border-gray-700">
              <Button
                disabled={isSubmitting}
                size="lg"
                asChild
                className={cn(
                  'inline-flex w-full cursor-pointer items-center justify-center gap-1 self-end rounded bg-primary px-3 py-3 font-semibold text-primary-foreground transition hover:brightness-110',
                  {
                    'cursor-wait opacity-50': isSubmitting,
                  },
                )}
              >
                <a
                  download={`${module.id}-certificate.png`}
                  href={watch().certificateUrl}
                  className="text-white hover:bg-primary/80 sm:text-base"
                >
                  <DownloadIcon className="w-4" />
                  Get Your Certificate
                </a>
              </Button>
              <div className="flex w-full flex-col border-t border-gray-100 pt-5 dark:border-gray-700">
                <h3 className="inline-block pb-1 text-lg text-gray-700 dark:text-gray-300">
                  Share URL (can be used on LinkedIn, etc.)
                </h3>
                <div className="flex w-full items-center">
                  <div className="relative flex w-full items-center">
                    {certUrl ? (
                      <Input
                        disabled={isSubmitting}
                        ref={urlInputRef}
                        readOnly
                        className="flex w-full flex-grow rounded border-none bg-gray-100 px-3 py-2 text-sm font-medium shadow-inner dark:bg-gray-700"
                        onClick={() => {
                          if (certUrl) {
                            urlInputRef?.current?.select()
                          } else {
                          }
                        }}
                        value={certUrl}
                      />
                    ) : null}
                    {certUrl ? (
                      <button
                        type="button"
                        className="absolute right-1 rounded bg-white p-1 shadow transition hover:brightness-110 dark:bg-gray-600"
                        onClick={() => {
                          navigator.clipboard.writeText(certUrl)
                          toast.success('Copied to clipboard')
                        }}
                      >
                        <ClipboardCopyIcon className="h-6 w-5" />
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </fieldset>
        </form>
        <Dialog.Close asChild>
          <button
            className="absolute right-[10px] top-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
            aria-label="Close"
          >
            <XIcon aria-hidden="true" />
          </button>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  )
}

export default CertificateForm
