'use strict'
Object.defineProperty(exports, '__esModule', {value: true})
class SpanContext {
  constructor(traceId, spanId, tags) {
    this.traceId = traceId
    this.spanId = spanId
    this.tags = tags
    this.traceId = traceId
    this.spanId = spanId
    this.tags = tags
  }
  toSpanId() {
    return this.spanId
  }
  toTraceId() {
    return this.traceId
  }
  getTag(key) {
    return this.tags[key]
  }
}
exports.SpanContext = SpanContext
