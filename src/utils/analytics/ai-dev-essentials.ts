import {track} from '@/utils/analytics'

export interface AIDevEssentialsAnalytics {
  page_view: {
    source?: string
    utm_campaign?: string
    utm_medium?: string
    utm_source?: string
  }
  newsletter_signup_attempt: {
    email: string
    name?: string
    source: 'hero' | 'footer' | 'inline'
  }
  newsletter_signup_success: {
    email: string
    name?: string
    source: 'hero' | 'footer' | 'inline'
  }
  newsletter_signup_error: {
    email: string
    error: string
    source: 'hero' | 'footer' | 'inline'
  }
  post_click: {
    post_id: string
    post_title: string
    position: number
    search_query?: string
    sort_by?: string
  }
  search_performed: {
    query: string
    results_count: number
  }
  pagination_click: {
    page: number
    total_pages: number
    search_query?: string
    sort_by?: string
  }
  sort_changed: {
    sort_by: string
    previous_sort?: string
    search_query?: string
  }
}

export type AIDevEssentialsEvent = keyof AIDevEssentialsAnalytics

export function trackAIDevEssentials<T extends AIDevEssentialsEvent>(
  event: T,
  properties: AIDevEssentialsAnalytics[T],
): void {
  try {
    track(`ai_dev_essentials_${event}`, {
      ...properties,
      page: 'ai-dev-essentials-newsletter',
      timestamp: new Date().toISOString(),
    })

    console.log(`[Analytics] AI Dev Essentials: ${event}`, properties)
  } catch (error) {
    console.error(
      `[Analytics] Failed to track AI Dev Essentials event: ${event}`,
      error,
    )
  }
}

export function trackPageView(params?: {
  source?: string
  utm_campaign?: string
  utm_medium?: string
  utm_source?: string
}): void {
  trackAIDevEssentials('page_view', params || {})
}

export function trackNewsletterSignup(
  type: 'attempt' | 'success' | 'error',
  data: {
    email: string
    name?: string
    source: 'hero' | 'footer' | 'inline'
    error?: string
  },
): void {
  if (type === 'error' && data.error) {
    trackAIDevEssentials('newsletter_signup_error', {
      email: data.email,
      error: data.error,
      source: data.source,
    })
  } else if (type === 'success') {
    trackAIDevEssentials('newsletter_signup_success', {
      email: data.email,
      name: data.name,
      source: data.source,
    })
  } else {
    trackAIDevEssentials('newsletter_signup_attempt', {
      email: data.email,
      name: data.name,
      source: data.source,
    })
  }
}

export function trackPostClick(data: {
  post_id: string
  post_title: string
  position: number
  search_query?: string
  sort_by?: string
}): void {
  trackAIDevEssentials('post_click', data)
}

export function trackSearch(query: string, resultsCount: number): void {
  trackAIDevEssentials('search_performed', {
    query,
    results_count: resultsCount,
  })
}

export function trackPagination(data: {
  page: number
  total_pages: number
  search_query?: string
  sort_by?: string
}): void {
  trackAIDevEssentials('pagination_click', data)
}

export function trackSortChange(data: {
  sort_by: string
  previous_sort?: string
  search_query?: string
}): void {
  trackAIDevEssentials('sort_changed', data)
}
