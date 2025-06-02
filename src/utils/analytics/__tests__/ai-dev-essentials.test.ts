import {
  trackAIDevEssentials,
  trackPageView,
  trackNewsletterSignup,
  trackPostClick,
  trackSearch,
  trackPagination,
  trackSortChange,
} from '../ai-dev-essentials'
import {track} from '@/utils/analytics'

// Mock the analytics utility
jest.mock('@/utils/analytics', () => ({
  track: jest.fn(),
}))

const mockTrack = track as jest.MockedFunction<typeof track>

describe('AI Dev Essentials Analytics', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(console, 'log').mockImplementation(() => {})
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('trackAIDevEssentials', () => {
    it('should track events with proper formatting', () => {
      const properties = {source: 'test'}

      trackAIDevEssentials('page_view', properties)

      expect(mockTrack).toHaveBeenCalledWith('ai_dev_essentials_page_view', {
        source: 'test',
        page: 'ai-dev-essentials-newsletter',
        timestamp: expect.any(String),
      })
    })

    it('should log successful tracking', () => {
      const consoleSpy = jest.spyOn(console, 'log')
      const properties = {source: 'test'}

      trackAIDevEssentials('page_view', properties)

      expect(consoleSpy).toHaveBeenCalledWith(
        '[Analytics] AI Dev Essentials: page_view',
        properties,
      )
    })

    it('should handle tracking errors gracefully', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error')
      const error = new Error('Tracking failed')
      mockTrack.mockImplementation(() => {
        throw error
      })

      trackAIDevEssentials('page_view', {})

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[Analytics] Failed to track AI Dev Essentials event: page_view',
        error,
      )
    })
  })

  describe('trackPageView', () => {
    it('should track page view with UTM parameters', () => {
      const params = {
        source: 'email',
        utm_campaign: 'newsletter',
        utm_medium: 'email',
        utm_source: 'mailchimp',
      }

      trackPageView(params)

      expect(mockTrack).toHaveBeenCalledWith('ai_dev_essentials_page_view', {
        ...params,
        page: 'ai-dev-essentials-newsletter',
        timestamp: expect.any(String),
      })
    })

    it('should track page view without parameters', () => {
      trackPageView()

      expect(mockTrack).toHaveBeenCalledWith('ai_dev_essentials_page_view', {
        page: 'ai-dev-essentials-newsletter',
        timestamp: expect.any(String),
      })
    })
  })

  describe('trackNewsletterSignup', () => {
    const signupData = {
      email: 'test@example.com',
      name: 'Test User',
      source: 'hero' as const,
    }

    it('should track signup attempt', () => {
      trackNewsletterSignup('attempt', signupData)

      expect(mockTrack).toHaveBeenCalledWith(
        'ai_dev_essentials_newsletter_signup_attempt',
        {
          email: 'test@example.com',
          name: 'Test User',
          source: 'hero',
          page: 'ai-dev-essentials-newsletter',
          timestamp: expect.any(String),
        },
      )
    })

    it('should track signup success', () => {
      trackNewsletterSignup('success', signupData)

      expect(mockTrack).toHaveBeenCalledWith(
        'ai_dev_essentials_newsletter_signup_success',
        {
          email: 'test@example.com',
          name: 'Test User',
          source: 'hero',
          page: 'ai-dev-essentials-newsletter',
          timestamp: expect.any(String),
        },
      )
    })

    it('should track signup error', () => {
      const errorData = {
        ...signupData,
        error: 'Email already exists',
      }

      trackNewsletterSignup('error', errorData)

      expect(mockTrack).toHaveBeenCalledWith(
        'ai_dev_essentials_newsletter_signup_error',
        {
          email: 'test@example.com',
          error: 'Email already exists',
          source: 'hero',
          page: 'ai-dev-essentials-newsletter',
          timestamp: expect.any(String),
        },
      )
    })

    it('should handle signup without name', () => {
      const dataWithoutName = {
        email: 'test@example.com',
        source: 'footer' as const,
      }

      trackNewsletterSignup('success', dataWithoutName)

      expect(mockTrack).toHaveBeenCalledWith(
        'ai_dev_essentials_newsletter_signup_success',
        {
          email: 'test@example.com',
          name: undefined,
          source: 'footer',
          page: 'ai-dev-essentials-newsletter',
          timestamp: expect.any(String),
        },
      )
    })
  })

  describe('trackPostClick', () => {
    it('should track post click with all parameters', () => {
      const clickData = {
        post_id: 'post-123',
        post_title: 'AI Development Tips',
        position: 3,
        search_query: 'AI tips',
        sort_by: 'date',
      }

      trackPostClick(clickData)

      expect(mockTrack).toHaveBeenCalledWith('ai_dev_essentials_post_click', {
        ...clickData,
        page: 'ai-dev-essentials-newsletter',
        timestamp: expect.any(String),
      })
    })

    it('should track post click without optional parameters', () => {
      const clickData = {
        post_id: 'post-456',
        post_title: 'Machine Learning Basics',
        position: 1,
      }

      trackPostClick(clickData)

      expect(mockTrack).toHaveBeenCalledWith('ai_dev_essentials_post_click', {
        ...clickData,
        page: 'ai-dev-essentials-newsletter',
        timestamp: expect.any(String),
      })
    })
  })

  describe('trackSearch', () => {
    it('should track search with results', () => {
      trackSearch('machine learning', 15)

      expect(mockTrack).toHaveBeenCalledWith(
        'ai_dev_essentials_search_performed',
        {
          query: 'machine learning',
          results_count: 15,
          page: 'ai-dev-essentials-newsletter',
          timestamp: expect.any(String),
        },
      )
    })

    it('should track search with no results', () => {
      trackSearch('nonexistent topic', 0)

      expect(mockTrack).toHaveBeenCalledWith(
        'ai_dev_essentials_search_performed',
        {
          query: 'nonexistent topic',
          results_count: 0,
          page: 'ai-dev-essentials-newsletter',
          timestamp: expect.any(String),
        },
      )
    })
  })

  describe('trackPagination', () => {
    it('should track pagination with search context', () => {
      const paginationData = {
        page: 2,
        total_pages: 5,
        search_query: 'AI',
        sort_by: 'title',
      }

      trackPagination(paginationData)

      expect(mockTrack).toHaveBeenCalledWith(
        'ai_dev_essentials_pagination_click',
        {
          ...paginationData,
          page: 'ai-dev-essentials-newsletter',
          timestamp: expect.any(String),
        },
      )
    })

    it('should track pagination without search context', () => {
      const paginationData = {
        page: 3,
        total_pages: 10,
      }

      trackPagination(paginationData)

      expect(mockTrack).toHaveBeenCalledWith(
        'ai_dev_essentials_pagination_click',
        {
          ...paginationData,
          page: 'ai-dev-essentials-newsletter',
          timestamp: expect.any(String),
        },
      )
    })
  })

  describe('trackSortChange', () => {
    it('should track sort change with previous sort', () => {
      const sortData = {
        sort_by: 'title',
        previous_sort: 'date',
        search_query: 'AI development',
      }

      trackSortChange(sortData)

      expect(mockTrack).toHaveBeenCalledWith('ai_dev_essentials_sort_changed', {
        ...sortData,
        page: 'ai-dev-essentials-newsletter',
        timestamp: expect.any(String),
      })
    })

    it('should track sort change without previous sort', () => {
      const sortData = {
        sort_by: 'date',
      }

      trackSortChange(sortData)

      expect(mockTrack).toHaveBeenCalledWith('ai_dev_essentials_sort_changed', {
        ...sortData,
        page: 'ai-dev-essentials-newsletter',
        timestamp: expect.any(String),
      })
    })
  })
})
