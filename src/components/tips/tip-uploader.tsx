'use client'
import {z} from 'zod'
import React from 'react'
import cx from 'classnames'
import toast from 'react-hot-toast'
import {twMerge} from 'tailwind-merge'
import {useRouter} from 'next/navigation'
import VideoUploader from '@/components/upload/video-uploader'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {trpc} from '@/app/_trpc/client'
import Spinner from '@/components/spinner'
import useFileUploadReducer from '@/hooks/use-file-upload-reducer'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/ui/form'
import {Textarea} from '@/ui/textarea'
import {Input} from '@/ui/input'
import {Button} from '@/ui/button'
import slugify from 'slugify'

function toChicagoTitleCase(slug: string): string {
  const minorWords: Set<string> = new Set([
    'and',
    'but',
    'for',
    'or',
    'nor',
    'the',
    'a',
    'an',
    'as',
    'at',
    'by',
    'for',
    'in',
    'of',
    'on',
    'per',
    'to',
  ])

  return slug
    .replace(/-|_/g, ' ')
    .split(' ')
    .map((word, index, array) => {
      if (
        index > 0 &&
        index < array.length - 1 &&
        minorWords.has(word.toLowerCase())
      ) {
        return word.toLowerCase()
      }
      return word.charAt(0).toUpperCase() + word.substring(1).toLowerCase()
    })
    .join(' ')
}

function removeFileExtension(filename: string): string {
  return filename.replace(/\.[^/.]+$/, '')
}

const NewTipFormSchema = z.object({
  title: z.string().min(10).max(90),
  description: z.string().min(2),
  s3Url: z.string().trim().url({message: 'Please Upload a Video'}),
})

const TipCreationForm: React.FunctionComponent<
  React.PropsWithChildren<any>
> = () => {
  const [s3Url, sets3Url] = React.useState<string>('')
  const router = useRouter()
  const form = useForm<z.infer<typeof NewTipFormSchema>>({
    resolver: zodResolver(NewTipFormSchema),
    defaultValues: {
      title: '',
      description: '',
      s3Url: '',
    },
  })
  const trpcUtils = trpc.useUtils()

  const {mutate: createTip} = trpc.tips.create.useMutation({
    onSuccess: async (newTip) => {
      toast.success(`Tip created.`, {
        duration: 3000,
        icon: '✅',
      })
      form.reset()
      sets3Url('')
      form.setValue('s3Url', '')

      await trpcUtils.tips.invalidate()
      router.push(`/tips/${newTip?.slug}/edit`)
    },
    onError: (error) => {
      toast.error(
        `There was a problem creating this tip. Contact egghead staff if the issue persists.\n\n${error.message}`,
        {
          duration: 3000,
          icon: '❌',
        },
      )
    },
  })

  const onSubmit = async (values: z.infer<typeof NewTipFormSchema>) => {
    createTip({
      ...values,
      fileName: slugify(values.title.toLowerCase(), {remove: /[*+~.()'"!:@]/g}),
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({field}) => (
            <FormItem>
              <FormLabel className="text-lg font-bold">Title*</FormLabel>
              <FormDescription className="mt-2 text-sm">
                Include any relavent keywords for SEO.
              </FormDescription>
              <FormControl>
                <Textarea placeholder="How do I..." {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({field}) => (
            <FormItem>
              <FormLabel className="text-lg font-bold">Description</FormLabel>
              <FormDescription className="mt-2 text-sm">
                This should describe what you teach in the tip and include any
                relevant codeblocks and links.
              </FormDescription>
              <FormControl>
                <Textarea
                  placeholder="add as much detail as you'd like :)"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {s3Url.length === 0 ? (
          <TipUploader
            sets3Url={(s3Url: string) => {
              form.setValue('s3Url', s3Url)
              sets3Url(s3Url)
            }}
          />
        ) : (
          <div>
            {s3Url}
            <Button
              onClick={() => {
                sets3Url('')
                form.setValue('s3Url', '')
              }}
            >
              clear
            </Button>
          </div>
        )}
        <FormField
          control={form.control}
          name="s3Url"
          render={({field}) => (
            <FormItem>
              <FormControl>
                <Input type="hidden" {...field} />
              </FormControl>
              {form.formState.errors.s3Url && (
                <p>{form.formState.errors.s3Url.message}</p>
              )}
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="mt-2"
          variant="default"
          onClick={() => {
            if (!s3Url) {
              form.setError('s3Url', {
                type: 'manual',
                message: 'Please upload a video',
              })
            }
          }}
        >
          Submit Tip
        </Button>
      </form>
    </Form>
  )
}

function TipUploader({sets3Url}: {sets3Url: (value: string) => void}) {
  const [fileUploadState, dispatch] = useFileUploadReducer([])
  const uploadingFile = fileUploadState?.files[0]
  const isUploaded = fileUploadState.files[0]?.percent === 100
  const signedUrl = fileUploadState.files[0]?.signedUrl

  React.useEffect(() => {
    if (signedUrl) {
      sets3Url(signedUrl)
    }
  }, [signedUrl, sets3Url])

  return (
    <>
      <label
        className={twMerge(
          'flex justify-center h-32 px-4 transition-all bg-transparent border border-gray-400 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
          cx({
            hidden: uploadingFile,
          }),
        )}
      >
        <span className="flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 dark:text-gray-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <span className="font-medium dark:text-gray-200">
            Drop video files, or{' '}
            <span className="text-blue-600 underline">browse</span>
          </span>
        </span>
        <VideoUploader dispatch={dispatch} />
      </label>
      <label
        className={twMerge(
          'flex justify-center h-32 px-4 transition-all bg-transparent border border-gray-400 rounded-md appearance-none hover:border-gray-200 focus:outline-none relative',
          cx({
            hidden: !uploadingFile,
          }),
        )}
      >
        <div
          className="absolute top-0 h-full bg-blue-500 -left-0 -z-10 opacity-10"
          style={{
            width: `${fileUploadState.files[0]?.percent ?? 0}%`,
            transition: 'width 0.3s ease',
          }}
        />
        <span className="flex items-center space-x-2">
          {isUploaded ? (
            <>
              ✅
              <span className="ml-2 text-base font-medium">
                {uploadingFile?.file?.name} uploaded
              </span>
            </>
          ) : (
            <>
              <Spinner className="text-black dark:text-white" />
              <span className="text-base font-medium ">
                {uploadingFile?.file?.name} uploading...
              </span>
            </>
          )}
        </span>
      </label>
    </>
  )
}

export default TipCreationForm
