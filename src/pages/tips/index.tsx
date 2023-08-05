import React from 'react'
import EditTip from 'pages//tips/[slug]/index'
import {getAllTips, TipSchema} from 'lib/tips'
import {first, groupBy} from 'lodash'
import {GetServerSideProps} from 'next'
import {trpc} from '../../trpc/trpc.client'

export const getServerSideProps: GetServerSideProps = async ({req, params}) => {
  const tips = await getAllTips(false)
  const mostRecentTipSlug = tips && first(tips)?.slug

  return {
    redirect: {
      destination: `/creator/tips/${mostRecentTipSlug}`,
      permanent: false,
    },
  }
}

const CreatorTipsIndex = () => {
  const {data: tips} = trpc.tips.all.useQuery()
  const mostRecentTip = tips && tips[0].tips[0].slug

  return mostRecentTip ? <EditTip slug={mostRecentTip} /> : null
}

export default CreatorTipsIndex
