import Link from 'next/link'
import {Button, Skeleton} from '@/ui'
import EditTipForm, {Video} from '@/module-builder/edit-tip-form'
import {twMerge} from 'tailwind-merge'
import {getTip, type Tip} from '@/lib/tips'
import {RxPlus, RxEyeOpen} from 'react-icons/rx'
import {Suspense} from 'react'
import {notFound, redirect} from 'next/navigation'
import {cookies} from 'next/headers'
import {ACCESS_TOKEN_KEY} from '@/utils/auth'
import {getAbilityFromToken} from '@/server/ability'

const EditTip = async ({params}: {params: {tipId: string}}) => {
  const cookieStore = cookies()
  const userToken = cookieStore?.get(ACCESS_TOKEN_KEY ?? '')?.value
  const ability = await getAbilityFromToken(userToken)
  const tip = await getTip(params.tipId as string)

  if (!ability.can('create', 'Content')) {
    redirect('/')
  }

  if (!tip) {
    return notFound()
  }

  return (
    <div>
      <header className="mx-auto flex w-full max-w-screen-lg flex-col items-center justify-between space-y-5 pl-3 lg:flex-row lg:space-y-0 lg:py-6">
        <h1 className="hidden text-3xl font-bold lg:block">Your Tips</h1>
        <TipActions className="hidden lg:flex" tip={tip} />
      </header>
      <main className="mx-auto flex w-full max-w-screen-lg flex-col-reverse gap-8 pb-16 lg:flex-row">
        <article className="flex w-full flex-col space-y-6 px-5 pt-5 lg:px-0 lg:pt-0">
          <Suspense
            fallback={
              <>
                <Skeleton className="aspect-video" />
                {new Array(6).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </>
            }
          >
            <Video playbackId={tip?.muxPlaybackId} />
            <EditTipForm key={tip._id} tip={tip} />
            <TipActions
              className="flex flex-row flex-wrap lg:hidden"
              tip={tip}
            />
          </Suspense>
        </article>
      </main>
    </div>
  )
}

export default EditTip

const TipActions: React.FC<{tip: Tip | undefined; className?: string}> = ({
  tip,
  className,
}) => {
  return (
    <div
      className={twMerge('flex flex-col items-center lg:flex-row', className)}
    >
      <Button variant="link" size="sm" asChild className="gap-1">
        <Link href={`/tips/${tip?.slug}`} target="_blank">
          <RxEyeOpen className="h-4 w-4" />
          View Tip
        </Link>
      </Button>
      <Button asChild size="sm" className="ml-4 gap-1">
        <Link href="/tips/new">
          <RxPlus className="h-4 w-4" /> Create a New Tip
        </Link>
      </Button>
    </div>
  )
}
