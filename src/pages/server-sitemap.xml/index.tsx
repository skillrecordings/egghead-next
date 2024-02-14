import {getServerSideSitemap} from 'next-sitemap'
import {GetServerSideProps} from 'next'
import {getAllTips} from '@/lib/tips'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  ctx.res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')

  const tips = await getAllTips()

  return getServerSideSitemap(ctx, [
    ...tips.map((tip: any) => {
      return {
        loc: `${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}/${tip.slug}`, // Absolute url
        lastmod: new Date(tip._updatedAt).toISOString(),
        changefreq: 'weekly' as any,
        priority: 0.7,
      }
    }),
  ])
}

// Default export to prevent next.js errors
export default function SitemapIndex() {}
