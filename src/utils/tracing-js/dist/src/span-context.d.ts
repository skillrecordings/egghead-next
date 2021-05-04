import {SpanTags} from './shared'
export declare class SpanContext {
  private traceId
  private spanId
  private tags
  constructor(traceId: string, spanId: string | undefined, tags: SpanTags)
  toSpanId(): string | undefined
  toTraceId(): string
  getTag(key: string): any
}
