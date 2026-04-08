import {
  withHeaderBannerServerSideProps,
  withHeaderBannerStaticProps,
} from '../with-header-banner-props'
import {getHeaderBannerData} from '../header-banners'

jest.mock('../header-banners', () => ({
  getHeaderBannerData: jest.fn(async () => ({
    lifetimeSaleEnabled: true,
    cursorWorkshopSaleEnabled: false,
    claudeCodeWorkshopSaleEnabled: false,
    cursorWorkshopEarlyBirdEnabled: false,
    cursorWorkshop: null,
    claudeCodeWorkshop: null,
  })),
}))

describe('with-header-banner-props', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('merges header banner data into server-side props', async () => {
    const wrapped = withHeaderBannerServerSideProps(
      '/q/[[...all]]',
      async () => {
        return {
          props: {
            hello: 'world',
          },
        }
      },
    )

    const result = await wrapped({
      req: {
        headers: {
          'x-egghead-request-id': 'req_123',
        },
      },
      res: {
        getHeader: jest.fn(() => undefined),
      },
    } as any)

    expect(result).toEqual({
      props: {
        hello: 'world',
        headerBannerData: {
          lifetimeSaleEnabled: true,
          cursorWorkshopSaleEnabled: false,
          claudeCodeWorkshopSaleEnabled: false,
          cursorWorkshopEarlyBirdEnabled: false,
          cursorWorkshop: null,
          claudeCodeWorkshop: null,
        },
      },
    })

    expect(getHeaderBannerData).toHaveBeenCalledWith({
      route: '/q/[[...all]]',
      request_id: 'req_123',
    })
  })

  test('preserves redirects for server-side props', async () => {
    const wrapped = withHeaderBannerServerSideProps(
      '/courses/[course]',
      async () => {
        return {
          redirect: {
            destination: '/',
            permanent: false,
          },
        }
      },
    )

    const result = await wrapped({
      req: {headers: {}},
      res: {
        getHeader: jest.fn(() => undefined),
      },
    } as any)

    expect(result).toEqual({
      redirect: {
        destination: '/',
        permanent: false,
      },
    })
    expect(getHeaderBannerData).not.toHaveBeenCalled()
  })

  test('merges header banner data into static props and preserves revalidate', async () => {
    const wrapped = withHeaderBannerStaticProps('/lessons/[slug]', async () => {
      return {
        props: {
          lesson: 'value',
        },
        revalidate: 60,
      }
    })

    const result = await wrapped({} as any)

    expect(result).toEqual({
      props: {
        lesson: 'value',
        headerBannerData: {
          lifetimeSaleEnabled: true,
          cursorWorkshopSaleEnabled: false,
          claudeCodeWorkshopSaleEnabled: false,
          cursorWorkshopEarlyBirdEnabled: false,
          cursorWorkshop: null,
          claudeCodeWorkshop: null,
        },
      },
      revalidate: 60,
    })

    expect(getHeaderBannerData).toHaveBeenCalledWith({
      route: '/lessons/[slug]',
      request_id: undefined,
    })
  })
})
