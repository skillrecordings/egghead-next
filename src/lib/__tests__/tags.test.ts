describe('loadTag', () => {
  const originalWindow = (global as any).window

  beforeEach(() => {
    jest.resetModules()
    Object.defineProperty(global, 'window', {
      value: {},
      configurable: true,
    })
  })

  afterEach(() => {
    if (originalWindow === undefined) {
      delete (global as any).window
    } else {
      Object.defineProperty(global, 'window', {
        value: originalWindow,
        configurable: true,
      })
    }
    jest.restoreAllMocks()
  })

  test('uses the Rails GraphQL tag lookup in the browser without importing Course Builder DB code', async () => {
    const request = jest.fn(
      async (_query: string, variables: {slug: string}) => ({
        tag: {
          name: variables.slug,
          slug: variables.slug,
          label: 'Vue',
          description: 'Vue lessons',
          image_480_url: 'https://example.com/vue.png',
          path: `/q/${variables.slug}`,
        },
      }),
    )
    const getCourseBuilderTagBySlug = jest.fn(async () => {
      throw new Error('Course Builder tag lookup should be server-only')
    })

    jest.doMock('@/utils/configured-graphql-client', () => ({
      __esModule: true,
      getGraphQLClient: () => ({request}),
    }))
    jest.doMock('@/components/search/curated/react', () => ({
      __esModule: true,
      reactPageQuery: '*[]',
    }))
    jest.doMock('@/components/search/curated/next', () => ({
      __esModule: true,
      nextPageQuery: '*[]',
    }))
    jest.doMock('@/components/search/curated/remix', () => ({
      __esModule: true,
      remixPageQuery: '*[]',
    }))
    jest.doMock('@/utils/sanity-client', () => ({
      __esModule: true,
      sanityClient: {fetch: jest.fn()},
    }))
    jest.doMock('@/lib/cb-tags', () => ({
      __esModule: true,
      getCourseBuilderTagBySlug,
    }))

    const {loadTag} = await import('../tags')

    await expect(loadTag('vue')).resolves.toMatchObject({
      name: 'vue',
      slug: 'vue',
      label: 'Vue',
      path: '/q/vue',
    })
    expect(request).toHaveBeenCalledTimes(1)
    expect(getCourseBuilderTagBySlug).not.toHaveBeenCalled()
  })
})
