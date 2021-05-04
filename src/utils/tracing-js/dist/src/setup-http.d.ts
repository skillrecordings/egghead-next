import {SpanContext} from './span-context'
import {Tracer} from './tracer'
import {HttpRequest, HttpResponse} from './shared'
interface SetupHttpTracingOptions {
  name?: string
  tracer: Tracer
  req: HttpRequest
  res: HttpResponse
}
export declare function setupHttpTracing(
  options: SetupHttpTracingOptions,
): SpanContext
export {}
