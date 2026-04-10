const mockAxios = {
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
  })),
  get: jest.fn(),
  patch: jest.fn(),
}

jest.mock('axios', () => ({
  __esModule: true,
  default: mockAxios,
}))

describe('email change request helpers', () => {
  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
    process.env.NEXT_PUBLIC_AUTH_DOMAIN = 'https://app.egghead.io'
  })

  it('loads token details from the Rails API with the bearer token when present', async () => {
    mockAxios.get.mockResolvedValue({
      data: {
        current_email: 'old@example.com',
        new_email: 'new@example.com',
      },
    })

    const {getEmailChangeRequest} = await import('../email-change-requests')
    const result = await getEmailChangeRequest('token-123', 'auth-token')

    expect(mockAxios.get).toHaveBeenCalledWith(
      'https://app.egghead.io/api/v1/email_change_requests/token-123',
      {
        headers: {
          Authorization: 'Bearer auth-token',
        },
      },
    )
    expect(result).toEqual({
      current_email: 'old@example.com',
      new_email: 'new@example.com',
    })
  })

  it('consumes the token through the Rails API and forwards the auth header', async () => {
    mockAxios.patch.mockResolvedValue({
      data: {
        success: true,
        new_email: 'new@example.com',
      },
    })

    const {consumeEmailChangeRequest} = await import('../email-change-requests')
    const result = await consumeEmailChangeRequest('token-123', 'auth-token')

    expect(mockAxios.patch).toHaveBeenCalledWith(
      'https://app.egghead.io/api/v1/email_change_requests/token-123',
      {},
      {
        headers: {
          Authorization: 'Bearer auth-token',
        },
      },
    )
    expect(result).toEqual({
      success: true,
      new_email: 'new@example.com',
    })
  })
})
