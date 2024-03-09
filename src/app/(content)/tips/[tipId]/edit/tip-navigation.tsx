'use client'

import {trpc} from '@/app/_trpc/client'

import Link from 'next/link'
import cn from 'classnames'
import Balancer from 'react-wrap-balancer'
import {Skeleton} from '@/ui'
import {useRouter} from 'next/router'

export const TipsNavigationList = ({slug}: {slug: string}) => {
  const {data: tips, status: tipsStatus} = trpc.tips.all.useQuery()

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
                      const isActive = slug
                        ? tip.slug === slug
                        : groupIdx === 0 && tipIdx === 0
                      return (
                        <li key={tip._id}>
                          <Link
                            href={`/tips/${tip.slug}`}
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
