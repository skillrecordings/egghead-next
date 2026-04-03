jest.mock('server-only', () => ({}), {virtual: true})

describe('getCourseBuilderConnectionOptions', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = {...originalEnv}
  })

  afterAll(() => {
    process.env = originalEnv
  })

  test('parses ssl json from the database url into mysql2 connection options', async () => {
    process.env.COURSE_BUILDER_DATABASE_URL =
      'mysql://user:pass@aws.connect.psdb.cloud/egghead?ssl=%7B%22rejectUnauthorized%22%3Atrue%7D'

    const {getCourseBuilderConnectionOptions} = await import(
      '../course-builder-db'
    )

    expect(getCourseBuilderConnectionOptions()).toEqual({
      uri: 'mysql://user:pass@aws.connect.psdb.cloud/egghead',
      ssl: {rejectUnauthorized: true},
    })
  })

  test('defaults to strict ssl for psdb hosts when no ssl query is provided', async () => {
    process.env.COURSE_BUILDER_DATABASE_URL =
      'mysql://user:pass@aws.connect.psdb.cloud/egghead'

    const {getCourseBuilderConnectionOptions} = await import(
      '../course-builder-db'
    )

    expect(getCourseBuilderConnectionOptions()).toEqual({
      uri: 'mysql://user:pass@aws.connect.psdb.cloud/egghead',
      ssl: {rejectUnauthorized: true},
    })
  })

  test('parses dotenv-escaped ssl json', async () => {
    process.env.COURSE_BUILDER_DATABASE_URL =
      'mysql://user:pass@aws.connect.psdb.cloud/egghead?ssl={\\"rejectUnauthorized\\":true}'

    const {getCourseBuilderConnectionOptions} = await import(
      '../course-builder-db'
    )

    expect(getCourseBuilderConnectionOptions()).toEqual({
      uri: 'mysql://user:pass@aws.connect.psdb.cloud/egghead',
      ssl: {rejectUnauthorized: true},
    })
  })
})
