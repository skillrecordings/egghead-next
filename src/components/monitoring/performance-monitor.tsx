import {useEffect, useRef, useState} from 'react'
import {trackAIDevEssentials} from '@/utils/analytics/ai-dev-essentials'

interface PerformanceMetrics {
  loadTime: number
  renderTime: number
  interactionTime?: number
  memoryUsage?: number
  connectionType?: string
}

interface PerformanceMonitorProps {
  pageName: string
  trackingEnabled?: boolean
}

export function PerformanceMonitor({
  pageName,
  trackingEnabled = true,
}: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const startTimeRef = useRef<number>(Date.now())
  const renderStartRef = useRef<number>(Date.now())

  useEffect(() => {
    if (!trackingEnabled) return

    const measurePerformance = () => {
      try {
        const navigation = performance.getEntriesByType(
          'navigation',
        )[0] as PerformanceNavigationTiming
        const paint = performance.getEntriesByType('paint')
        const firstContentfulPaint = paint.find(
          (entry) => entry.name === 'first-contentful-paint',
        )

        const loadTime = navigation.loadEventEnd - navigation.loadEventStart
        const renderTime = Date.now() - renderStartRef.current

        // Get memory usage if available
        const memoryInfo = (performance as any).memory
        const memoryUsage = memoryInfo
          ? memoryInfo.usedJSHeapSize / 1024 / 1024
          : undefined

        // Get connection info if available
        const connection = (navigator as any).connection
        const connectionType = connection ? connection.effectiveType : undefined

        const performanceMetrics: PerformanceMetrics = {
          loadTime,
          renderTime,
          memoryUsage,
          connectionType,
        }

        setMetrics(performanceMetrics)

        // Track performance metrics
        trackAIDevEssentials('page_view', {
          source: 'performance_monitor',
        })

        console.log(`[Performance] ${pageName} metrics:`, {
          loadTime: `${loadTime.toFixed(2)}ms`,
          renderTime: `${renderTime.toFixed(2)}ms`,
          firstContentfulPaint: firstContentfulPaint
            ? `${firstContentfulPaint.startTime.toFixed(2)}ms`
            : 'N/A',
          memoryUsage: memoryUsage ? `${memoryUsage.toFixed(2)}MB` : 'N/A',
          connectionType: connectionType || 'Unknown',
        })

        // Track slow performance
        if (loadTime > 3000 || renderTime > 1000) {
          console.warn(
            `[Performance] Slow performance detected on ${pageName}:`,
            {
              loadTime,
              renderTime,
            },
          )
        }
      } catch (error) {
        console.error('[Performance] Failed to measure performance:', error)
      }
    }

    // Measure performance after page load
    if (document.readyState === 'complete') {
      measurePerformance()
    } else {
      window.addEventListener('load', measurePerformance)
      return () => window.removeEventListener('load', measurePerformance)
    }
  }, [pageName, trackingEnabled])

  // Track interaction timing
  useEffect(() => {
    if (!trackingEnabled) return

    const handleFirstInteraction = () => {
      const interactionTime = Date.now() - startTimeRef.current
      setMetrics((prev) => (prev ? {...prev, interactionTime} : null))

      console.log(`[Performance] First interaction after ${interactionTime}ms`)

      // Remove listeners after first interaction
      document.removeEventListener('click', handleFirstInteraction)
      document.removeEventListener('keydown', handleFirstInteraction)
      document.removeEventListener('scroll', handleFirstInteraction)
    }

    document.addEventListener('click', handleFirstInteraction, {once: true})
    document.addEventListener('keydown', handleFirstInteraction, {once: true})
    document.addEventListener('scroll', handleFirstInteraction, {once: true})

    return () => {
      document.removeEventListener('click', handleFirstInteraction)
      document.removeEventListener('keydown', handleFirstInteraction)
      document.removeEventListener('scroll', handleFirstInteraction)
    }
  }, [trackingEnabled])

  // Monitor Core Web Vitals
  useEffect(() => {
    if (!trackingEnabled || typeof window === 'undefined') return

    const observeWebVitals = () => {
      try {
        // Largest Contentful Paint (LCP)
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          console.log(`[Performance] LCP: ${lastEntry.startTime.toFixed(2)}ms`)
        })
        lcpObserver.observe({entryTypes: ['largest-contentful-paint']})

        // First Input Delay (FID)
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry) => {
            const event = entry as PerformanceEventTiming
            console.log(
              `[Performance] FID: ${event.processingStart - event.startTime}ms`,
            )
          })
        })
        fidObserver.observe({entryTypes: ['first-input']})

        // Cumulative Layout Shift (CLS)
        let clsValue = 0
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value
            }
          })
          console.log(`[Performance] CLS: ${clsValue.toFixed(4)}`)
        })
        clsObserver.observe({entryTypes: ['layout-shift']})

        return () => {
          lcpObserver.disconnect()
          fidObserver.disconnect()
          clsObserver.disconnect()
        }
      } catch (error) {
        console.error('[Performance] Failed to observe Web Vitals:', error)
      }
    }

    const cleanup = observeWebVitals()
    return cleanup
  }, [trackingEnabled])

  // Development-only performance display
  if (process.env.NODE_ENV === 'development' && metrics) {
    return (
      <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white text-xs p-2 rounded z-50 max-w-xs">
        <div className="font-bold mb-1">Performance Metrics</div>
        <div>Load: {metrics.loadTime.toFixed(0)}ms</div>
        <div>Render: {metrics.renderTime.toFixed(0)}ms</div>
        {metrics.interactionTime && (
          <div>Interaction: {metrics.interactionTime.toFixed(0)}ms</div>
        )}
        {metrics.memoryUsage && (
          <div>Memory: {metrics.memoryUsage.toFixed(1)}MB</div>
        )}
        {metrics.connectionType && (
          <div>Connection: {metrics.connectionType}</div>
        )}
      </div>
    )
  }

  return null
}

export default PerformanceMonitor
