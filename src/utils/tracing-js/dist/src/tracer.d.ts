import {TracerOptions, TracerHoneyOptions, SpanOptions} from './shared'
import {Span} from './span'
export declare class Tracer {
  private honey
  private tracerOptions
  constructor(tracerOptions: TracerOptions, honeyOptions: TracerHoneyOptions)
  startSpan(name: string, spanOptions?: SpanOptions): Span
}
