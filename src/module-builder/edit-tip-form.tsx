'use client'

import {Tip, TipSchema} from '@/lib/tips'
import {Button, Input, Textarea} from '@/ui'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/ui/form'
import {zodResolver} from '@hookform/resolvers/zod'
import {useForm} from 'react-hook-form'
import {z} from 'zod'
import MuxPlayer from '@mux/mux-player-react'
import {trpc} from '@/app/_trpc/client'
import {redirect} from 'next/navigation'

const EditTipForm: React.FC<{tip: Tip}> = ({tip}) => {
  const formSchema = TipSchema
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...tip,
    },
  })
  const {mutate: updateTip} = trpc.tips.update.useMutation()

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await updateTip(
        {
          _id: tip._id,
          title: values.title,
          slug: values.slug,
          body: values.body,
        },
        {
          onSuccess: (data) => {
            redirect(`/tips/${data?.slug}`)
          },
        },
      )
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="title"
            render={({field}) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Title" {...field} />
                </FormControl>
                <FormDescription>
                  This is the title of your tip.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({field}) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="Slug" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="body"
            render={({field}) => (
              <FormItem>
                <FormLabel>Body</FormLabel>
                <FormControl>
                  <Textarea
                    rows={16}
                    placeholder="Body"
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormDescription>This is the tip body in MDX.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Save</Button>
        </form>
      </Form>
    </>
  )
}

export default EditTipForm

export const Video: React.FC<{playbackId: string | undefined | null}> = ({
  playbackId,
}) => {
  return (
    <>
      {playbackId && (
        <MuxPlayer
          className="overflow-hidden rounded"
          playbackId={playbackId}
        />
      )}
    </>
  )
}
