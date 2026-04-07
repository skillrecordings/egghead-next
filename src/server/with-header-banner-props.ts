import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  GetStaticProps,
  GetStaticPropsResult,
} from 'next'
import {getHeaderBannerData} from '@/server/header-banners'
import type {HeaderBannerData} from '@/components/app/header/banner-data'

type HeaderBannerPageProps = {
  headerBannerData: HeaderBannerData
}

function readRequestId(context: GetServerSidePropsContext) {
  const responseHeader = context.res.getHeader('x-egghead-request-id')
  if (typeof responseHeader === 'string') return responseHeader
  if (Array.isArray(responseHeader)) return responseHeader[0]

  const header =
    context.req.headers['x-egghead-request-id'] ??
    context.req.headers['x-vercel-id']

  return Array.isArray(header) ? header[0] : header
}

async function mergeHeaderBannerServerSideProps<P extends Record<string, any>>(
  route: string,
  result: GetServerSidePropsResult<P>,
  requestId?: string,
): Promise<GetServerSidePropsResult<P & HeaderBannerPageProps>> {
  if (!('props' in result)) {
    return result as GetServerSidePropsResult<P & HeaderBannerPageProps>
  }

  const headerBannerData = await getHeaderBannerData({
    route,
    request_id: requestId,
  })
  const props = await Promise.resolve(result.props)

  return {
    ...result,
    props: {
      ...(props as P),
      headerBannerData,
    },
  }
}

async function mergeHeaderBannerStaticProps<P extends Record<string, any>>(
  route: string,
  result: GetStaticPropsResult<P>,
): Promise<GetStaticPropsResult<P & HeaderBannerPageProps>> {
  if (!('props' in result)) {
    return result as GetStaticPropsResult<P & HeaderBannerPageProps>
  }

  const headerBannerData = await getHeaderBannerData({
    route,
    request_id: undefined,
  })
  const props = result.props as P

  return {
    ...result,
    props: {
      ...props,
      headerBannerData,
    },
  }
}

export function withHeaderBannerServerSideProps<P extends Record<string, any>>(
  route: string,
  gssp: GetServerSideProps<P>,
): GetServerSideProps<P & HeaderBannerPageProps> {
  return async (context) => {
    const result = await gssp(context)
    return mergeHeaderBannerServerSideProps(
      route,
      result,
      readRequestId(context),
    )
  }
}

export function withHeaderBannerStaticProps<P extends Record<string, any>>(
  route: string,
  gsp: GetStaticProps<P>,
): GetStaticProps<P & HeaderBannerPageProps> {
  return async (context) => {
    const result = await gsp(context)
    return mergeHeaderBannerStaticProps(route, result)
  }
}
