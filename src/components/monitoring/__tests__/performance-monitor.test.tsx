import {render, screen} from '@testing-library/react'
import {PerformanceMonitor} from '../performance-monitor'
import {trackAIDevEssentials} from '@/utils/analytics/ai-dev-essentials'

// Mock the analytics utility
jest.mock('@/utils/analytics/ai-dev-essentials', () => ({
  trackAIDevEssentials: jest.fn(),
}))

const mockTrackAIDevEssentials = trackAIDevEssentials as jest.MockedFunction<
  typeof trackAIDevEssentials
>

// Mock performance APIs
const mockPerformanceNavigation = {
  loadEventEnd: 1000,
  loadEventStart: 100,
} as PerformanceNavigationTiming

const mockPerformancePaint = [
  {
    name: 'first-contentful-paint',
    startTime: 500,
  },
] as PerformanceEntry[]

const mockPerformanceObserver = {
  observe: jest.fn(),
  disconnect: jest.fn(),
}

// Mock global objects
Object.defineProperty(global, 'performance', {
  value: {
    getEntriesByType: jest.fn(),
    memory: {
      usedJSHeapSize: 50 * 1024 * 1024, // 50MB
    },
  },
  writable: true,
})

Object.defineProperty(global, 'PerformanceObserver', {
  value: jest.fn().mockImplementation(() => mockPerformanceObserver),
  writable: true,
})

Object.defineProperty(global, 'navigator', {
  value: {
    connection: {
      effectiveType: '4g',
    },
  },
  writable: true,
})

describe('PerformanceMonitor', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(console, 'log').mockImplementation(() => {})
    jest.spyOn(console, 'error').mockImplementation(() => {})
    jest.spyOn(console, 'warn').mockImplementation(() => {})

    // Reset performance mocks
    ;(performance.getEntriesByType as jest.Mock).mockImplementation((type) => {
      if (type === 'navigation') return [mockPerformanceNavigation]
      if (type === 'paint') return mockPerformancePaint
      return []
    })

    // Mock document ready state
    Object.defineProperty(document, 'readyState', {
      value: 'complete',
      writable: true,
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('Basic Functionality', () => {
    it('should render without crashing', () => {
      render(<PerformanceMonitor pageName="test-page" />)
      // Component should not render anything in production
      expect(screen.queryByText('Performance Metrics')).not.toBeInTheDocument()
    })

    it('should track analytics when enabled', () => {
      render(<PerformanceMonitor pageName="test-page" trackingEnabled={true} />)

      expect(mockTrackAIDevEssentials).toHaveBeenCalledWith('page_view', {
        source: 'performance_monitor',
      })
    })

    it('should not track analytics when disabled', () => {
      render(
        <PerformanceMonitor pageName="test-page" trackingEnabled={false} />,
      )

      expect(mockTrackAIDevEssentials).not.toHaveBeenCalled()
    })
  })

  describe('Performance Measurement', () => {
    it('should measure load and render times', () => {
      const consoleSpy = jest.spyOn(console, 'log')

      render(<PerformanceMonitor pageName="test-page" />)

      expect(consoleSpy).toHaveBeenCalledWith(
        '[Performance] test-page metrics:',
        expect.objectContaining({
          loadTime: '900.00ms',
          renderTime: expect.any(String),
          firstContentfulPaint: '500.00ms',
          memoryUsage: '50.00MB',
          connectionType: '4g',
        }),
      )
    })

    it('should handle missing performance data gracefully', () => {
      ;(performance.getEntriesByType as jest.Mock).mockReturnValue([])

      const consoleErrorSpy = jest.spyOn(console, 'error')

      render(<PerformanceMonitor pageName="test-page" />)

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[Performance] Failed to measure performance:',
        expect.any(Error),
      )
    })

    it('should warn about slow performance', () => {
      const slowNavigation = {
        loadEventEnd: 5000,
        loadEventStart: 100,
      }
      ;(performance.getEntriesByType as jest.Mock).mockImplementation(
        (type) => {
          if (type === 'navigation') return [slowNavigation]
          if (type === 'paint') return mockPerformancePaint
          return []
        },
      )

      const consoleWarnSpy = jest.spyOn(console, 'warn')

      render(<PerformanceMonitor pageName="test-page" />)

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '[Performance] Slow performance detected on test-page:',
        expect.objectContaining({
          loadTime: 4900,
        }),
      )
    })
  })

  describe('Web Vitals Monitoring', () => {
    it('should set up performance observers for Web Vitals', () => {
      render(<PerformanceMonitor pageName="test-page" />)

      expect(PerformanceObserver).toHaveBeenCalledTimes(3) // LCP, FID, CLS
      expect(mockPerformanceObserver.observe).toHaveBeenCalledWith({
        entryTypes: ['largest-contentful-paint'],
      })
      expect(mockPerformanceObserver.observe).toHaveBeenCalledWith({
        entryTypes: ['first-input'],
      })
      expect(mockPerformanceObserver.observe).toHaveBeenCalledWith({
        entryTypes: ['layout-shift'],
      })
    })

    it('should handle Web Vitals observer errors', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error')
      ;(PerformanceObserver as jest.Mock).mockImplementation(() => {
        throw new Error('Observer not supported')
      })

      render(<PerformanceMonitor pageName="test-page" />)

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[Performance] Failed to observe Web Vitals:',
        expect.any(Error),
      )
    })

    it('should not set up observers when tracking is disabled', () => {
      render(
        <PerformanceMonitor pageName="test-page" trackingEnabled={false} />,
      )

      expect(PerformanceObserver).not.toHaveBeenCalled()
    })
  })

  describe('Interaction Tracking', () => {
    it('should track first interaction timing', () => {
      const consoleSpy = jest.spyOn(console, 'log')

      render(<PerformanceMonitor pageName="test-page" />)

      // Simulate click event
      document.dispatchEvent(new Event('click'))

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringMatching(/\[Performance\] First interaction after \d+ms/),
      )
    })

    it('should handle multiple interaction types', () => {
      const addEventListenerSpy = jest.spyOn(document, 'addEventListener')

      render(<PerformanceMonitor pageName="test-page" />)

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'click',
        expect.any(Function),
        {once: true},
      )
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'keydown',
        expect.any(Function),
        {once: true},
      )
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'scroll',
        expect.any(Function),
        {once: true},
      )
    })

    it('should not track interactions when disabled', () => {
      const addEventListenerSpy = jest.spyOn(document, 'addEventListener')

      render(
        <PerformanceMonitor pageName="test-page" trackingEnabled={false} />,
      )

      expect(addEventListenerSpy).not.toHaveBeenCalledWith(
        'click',
        expect.any(Function),
        {once: true},
      )
    })
  })

  describe('Development Mode Display', () => {
    const originalEnv = process.env.NODE_ENV

    beforeEach(() => {
      process.env.NODE_ENV = 'development'
    })

    afterEach(() => {
      process.env.NODE_ENV = originalEnv
    })

    it('should show performance metrics in development mode', async () => {
      render(<PerformanceMonitor pageName="test-page" />)

      // Wait for metrics to be calculated
      await new Promise((resolve) => setTimeout(resolve, 100))

      expect(screen.getByText('Performance Metrics')).toBeInTheDocument()
      expect(screen.getByText(/Load: \d+ms/)).toBeInTheDocument()
      expect(screen.getByText(/Render: \d+ms/)).toBeInTheDocument()
      expect(screen.getByText(/Memory: \d+\.\d+MB/)).toBeInTheDocument()
      expect(screen.getByText(/Connection: 4g/)).toBeInTheDocument()
    })

    it('should not show metrics when tracking is disabled', () => {
      render(
        <PerformanceMonitor pageName="test-page" trackingEnabled={false} />,
      )

      expect(screen.queryByText('Performance Metrics')).not.toBeInTheDocument()
    })
  })

  describe('Memory and Connection Handling', () => {
    it('should handle missing memory information', () => {
      Object.defineProperty(performance, 'memory', {
        value: undefined,
        writable: true,
      })

      const consoleSpy = jest.spyOn(console, 'log')

      render(<PerformanceMonitor pageName="test-page" />)

      expect(consoleSpy).toHaveBeenCalledWith(
        '[Performance] test-page metrics:',
        expect.objectContaining({
          memoryUsage: 'N/A',
        }),
      )
    })

    it('should handle missing connection information', () => {
      Object.defineProperty(navigator, 'connection', {
        value: undefined,
        writable: true,
      })

      const consoleSpy = jest.spyOn(console, 'log')

      render(<PerformanceMonitor pageName="test-page" />)

      expect(consoleSpy).toHaveBeenCalledWith(
        '[Performance] test-page metrics:',
        expect.objectContaining({
          connectionType: 'Unknown',
        }),
      )
    })
  })

  describe('Load Event Handling', () => {
    it('should wait for load event when document is not ready', () => {
      Object.defineProperty(document, 'readyState', {
        value: 'loading',
        writable: true,
      })

      const addEventListenerSpy = jest.spyOn(window, 'addEventListener')

      render(<PerformanceMonitor pageName="test-page" />)

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'load',
        expect.any(Function),
      )
    })

    it('should measure immediately when document is ready', () => {
      Object.defineProperty(document, 'readyState', {
        value: 'complete',
        writable: true,
      })

      const consoleSpy = jest.spyOn(console, 'log')

      render(<PerformanceMonitor pageName="test-page" />)

      expect(consoleSpy).toHaveBeenCalledWith(
        '[Performance] test-page metrics:',
        expect.any(Object),
      )
    })
  })
})
