import {SpanContext} from './span-context'
interface SetupFetchTracingOptions<T> {
  spanContext: SpanContext
  fetch?: T
}
export declare function setupFetchTracing<T>(
  options: SetupFetchTracingOptions<T>,
): T
export {}
