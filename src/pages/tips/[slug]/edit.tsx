import Link from 'next/link'
import {Button, Skeleton} from 'ui'
import EditTipForm, {Video} from 'module-builder/edit-tip-form'
import {twMerge} from 'tailwind-merge'
import Balancer from 'react-wrap-balancer'
import {useRouter} from 'next/router'
import {trpc} from 'trpc/trpc.client'
import Layout from 'components/app/layout'
import cn from 'classnames'
import {getTip, type Tip} from 'lib/tips'
import {RxPlus, RxPencil1, RxEyeOpen} from 'react-icons/rx'
import {GetServerSideProps} from 'next'

export const getServerSideProps: GetServerSideProps = async function ({query}) {
  const tip = await getTip(query?.tip as string)

  if (!tip) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      tip,
    },
  }
}

const EditTip = ({slug}: {slug?: string}) => {
  const router = useRouter()
  const {data: tip, status: tipStatus} = trpc.tips.bySlug.useQuery({
    slug: (slug ?? router.query.slug) as string,
  })

  return (
    <Layout>
      <header className="mx-auto flex w-full max-w-screen-lg flex-col items-center justify-between space-y-5 pl-3 lg:flex-row lg:space-y-0 lg:py-6">
        <h1 className="hidden text-3xl font-bold lg:block">Your Tips</h1>
        <TipActions className="hidden lg:flex" tip={tip} />
      </header>
      <main className="mx-auto flex w-full max-w-screen-lg flex-col-reverse gap-8 pb-16 lg:flex-row">
        <TipsNavigationList />
        <article className="flex w-full flex-col space-y-6 px-5 pt-5 lg:px-0 lg:pt-0">
          {tipStatus === 'success' ? (
            <>
              <Video playbackId={tip?.muxPlaybackId} />
              <EditTipForm key={tip._id} tip={tip} />
            </>
          ) : (
            <div className="flex flex-col space-y-4">
              <Skeleton className="aspect-video" />
              {new Array(6).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          )}
          <TipActions className="flex flex-row flex-wrap lg:hidden" tip={tip} />
        </article>
      </main>
    </Layout>
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
      <Button variant="link" size="sm" asChild className="gap-2">
        <Link
          href={`https://epic-web.sanity.studio/desk/tips;${tip?._id}`}
          target="_blank"
          className="gap-0.5"
        >
          <RxPencil1 className="h-4 w-4" />
          Open in Sanity
        </Link>
      </Button>
      <Button variant="link" size="sm" asChild className="gap-1">
        <Link
          href={`${process.env.NEXT_PUBLIC_URL}/tips/${tip?.slug}`}
          target="_blank"
        >
          <RxEyeOpen className="h-4 w-4" />
          Preview
        </Link>
      </Button>
      <Button asChild size="sm" className="ml-4 gap-1">
        <Link href="/creator/tips/new">
          <RxPlus className="h-4 w-4" /> Create a New Tip
        </Link>
      </Button>
    </div>
  )
}

const TipsNavigationList = () => {
  const {data: tips, status: tipsStatus} = trpc.tips.all.useQuery()
  const router = useRouter()

  return (
    <nav className="w-full lg:max-w-[280px]">
      <ul className="flex flex-col">
        {tipsStatus === 'success' ? (
          <>
            {tips?.map((tipGroup, groupIdx) => {
              return (
                <li key={tipGroup.state} className="py-3">
                  <h2 className="pb-3 pl-3 text-sm font-bold uppercase">
                    {tipGroup.state}
                  </h2>
                  <ul className="flex flex-col gap-0.5">
                    {tipGroup.tips.map((tip, tipIdx) => {
                      const isActive = router.query.slug
                        ? tip.slug === router.query.slug
                        : groupIdx === 0 && tipIdx === 0
                      return (
                        <li key={tip._id}>
                          <Link
                            href={`/creator/tips/${tip.slug}`}
                            className={cn(
                              'flex rounded px-3 py-2 text-sm font-medium',
                              {
                                'bg-white text-foreground text-opacity-100 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:bg-white/20':
                                  isActive,
                                'opacity-80 transition hover:opacity-100':
                                  !isActive,
                              },
                            )}
                          >
                            <Balancer>{tip.title}</Balancer>
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </li>
              )
            })}
          </>
        ) : (
          <div className="flex flex-col space-y-4">
            {new Array(10).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        )}
      </ul>
    </nav>
  )
}
