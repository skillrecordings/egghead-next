import {getAIDevEssentialsPosts} from '../ai-dev-essentials'
import {PostSchema} from '@/pages/[post]'
import * as mysql from 'mysql2/promise'

// Mock mysql2/promise
jest.mock('mysql2/promise')
const mockMysql = mysql as jest.Mocked<typeof mysql>

describe('getAIDevEssentialsPosts', () => {
  let mockConnection: any
  let consoleSpy: jest.SpyInstance

  beforeEach(() => {
    mockConnection = {
      execute: jest.fn(),
      end: jest.fn(),
    }
    mockMysql.createConnection.mockResolvedValue(mockConnection)
    consoleSpy = jest.spyOn(console, 'log').mockImplementation()
  })

  afterEach(() => {
    jest.clearAllMocks()
    consoleSpy.mockRestore()
  })

  it('should return array of posts with titles containing "AI Dev Essentials"', async () => {
    const mockPostRows = [
      {
        id: 'post-1',
        type: 'post',
        createdById: 'user-1',
        fields: {
          title: 'AI Dev Essentials: Getting Started with Machine Learning',
          postType: 'lesson',
          summary: 'Learn the basics of ML',
          body: 'Content here',
          state: 'published',
          visibility: 'public',
          access: 'free',
          slug: 'ai-dev-essentials-ml-basics',
        },
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        deletedAt: null,
        name: 'John Doe',
        image: 'avatar.jpg',
      },
      {
        id: 'post-2',
        type: 'post',
        createdById: 'user-2',
        fields: {
          title: 'AI Dev Essentials: Advanced Neural Networks',
          postType: 'lesson',
          summary: 'Deep dive into neural networks',
          body: 'Advanced content',
          state: 'published',
          visibility: 'public',
          access: 'pro',
          slug: 'ai-dev-essentials-neural-networks',
        },
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
        deletedAt: null,
        name: 'Jane Smith',
        image: 'avatar2.jpg',
      },
    ]

    mockConnection.execute.mockResolvedValue([mockPostRows])

    const result = await getAIDevEssentialsPosts()

    expect(result).toHaveLength(2)
    expect(result[0].fields.title).toContain('AI Dev Essentials')
    expect(result[1].fields.title).toContain('AI Dev Essentials')
    expect(consoleSpy).toHaveBeenCalledWith(
      'INFO: Fetching AI Dev Essentials posts',
    )
    expect(consoleSpy).toHaveBeenCalledWith(
      'INFO: Fetching AI Dev Essentials posts, found 2 posts matching criteria',
    )
  })

  it('should validate PostSchema compliance', async () => {
    const validPost = {
      id: 'post-1',
      type: 'post',
      createdById: 'user-1',
      fields: {
        title: 'AI Dev Essentials: Valid Post',
        postType: 'lesson',
        summary: 'Valid summary',
        body: 'Valid content',
        state: 'published',
        visibility: 'public',
        access: 'free',
        slug: 'valid-slug',
      },
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      deletedAt: null,
      name: 'Author Name',
      image: 'avatar.jpg',
    }

    mockConnection.execute.mockResolvedValue([[validPost]])

    const result = await getAIDevEssentialsPosts()

    expect(result).toHaveLength(1)

    // Validate the returned post matches PostSchema
    const validationResult = PostSchema.safeParse(result[0])
    expect(validationResult.success).toBe(true)
  })

  it('should handle empty results gracefully', async () => {
    mockConnection.execute.mockResolvedValue([[]])

    const result = await getAIDevEssentialsPosts()

    expect(result).toHaveLength(0)
    expect(result).toEqual([])
    expect(consoleSpy).toHaveBeenCalledWith(
      'INFO: Fetching AI Dev Essentials posts, found 0 posts matching criteria',
    )
  })

  it('should filter out invalid posts and log errors', async () => {
    const invalidPost = {
      id: 'post-1',
      // Missing required fields to make it invalid
      fields: {
        title: 'AI Dev Essentials: Invalid Post',
        // Missing required fields like slug, state, etc.
      },
    }

    const validPost = {
      id: 'post-2',
      type: 'post',
      createdById: 'user-1',
      fields: {
        title: 'AI Dev Essentials: Valid Post',
        postType: 'lesson',
        summary: 'Valid summary',
        body: 'Valid content',
        state: 'published',
        visibility: 'public',
        access: 'free',
        slug: 'valid-slug',
      },
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      deletedAt: null,
      name: 'Author Name',
      image: 'avatar.jpg',
    }

    mockConnection.execute.mockResolvedValue([[invalidPost, validPost]])
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

    const result = await getAIDevEssentialsPosts()

    expect(result).toHaveLength(1)
    expect(result[0].fields.title).toBe('AI Dev Essentials: Valid Post')
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Post validation failed for AI Dev Essentials post:',
      expect.any(Object),
    )

    consoleErrorSpy.mockRestore()
  })

  it('should handle database errors', async () => {
    const dbError = new Error('Database connection failed')
    mockConnection.execute.mockRejectedValue(dbError)
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

    await expect(getAIDevEssentialsPosts()).rejects.toThrow(
      'Database connection failed',
    )
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error in getAIDevEssentialsPosts:',
      dbError,
    )
    expect(mockConnection.end).toHaveBeenCalled()

    consoleErrorSpy.mockRestore()
  })

  it('should always close database connection', async () => {
    mockConnection.execute.mockResolvedValue([[]])

    await getAIDevEssentialsPosts()

    expect(mockConnection.end).toHaveBeenCalled()
  })

  it('should use correct SQL query', async () => {
    mockConnection.execute.mockResolvedValue([[]])

    await getAIDevEssentialsPosts()

    expect(mockConnection.execute).toHaveBeenCalledWith(
      expect.stringContaining(
        "JSON_UNQUOTE(JSON_EXTRACT(cr_lesson.fields, '$.title')) LIKE '%AI Dev Essentials%'",
      ),
    )
    expect(mockConnection.execute).toHaveBeenCalledWith(
      expect.stringContaining("cr_lesson.type = 'post'"),
    )
    expect(mockConnection.execute).toHaveBeenCalledWith(
      expect.stringContaining('ORDER BY cr_lesson.createdAt DESC'),
    )
  })
})
