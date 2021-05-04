'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : {default: mod}
  }
Object.defineProperty(exports, '__esModule', {value: true})
const span_1 = require('./span')
const span_context_1 = require('./span-context')
const tags_1 = require('./tags')
const libhoney_1 = __importDefault(require('libhoney'))
const deterministic_sampler_1 = require('./deterministic-sampler')
class Tracer {
  constructor(tracerOptions, honeyOptions) {
    this.tracerOptions = tracerOptions
    this.tracerOptions.sampler =
      tracerOptions.sampler ||
      new deterministic_sampler_1.DeterministicSampler(1)
    if (honeyOptions instanceof libhoney_1.default) {
      this.honey = honeyOptions
    } else {
      this.honey = new libhoney_1.default(honeyOptions)
    }
  }
  startSpan(name, spanOptions = {}) {
    const {childOf, tags = {}} = spanOptions
    let traceId
    let parentId
    let samplingPriority
    if (childOf instanceof span_1.Span) {
      const ctx = childOf.context()
      traceId = ctx.toTraceId()
      parentId = ctx.toSpanId()
      samplingPriority = ctx.getTag(tags_1.SAMPLING_PRIORITY)
    } else if (childOf instanceof span_context_1.SpanContext) {
      traceId = childOf.toTraceId()
      parentId = childOf.toSpanId()
      samplingPriority = childOf.getTag(tags_1.SAMPLING_PRIORITY)
    } else if (childOf) {
      throw new Error('Expected `childOf` to be Span or SpanContext')
    }
    // If the parent has a sampling priority, copy value to the child
    if (typeof samplingPriority !== 'undefined') {
      tags[tags_1.SAMPLING_PRIORITY] = samplingPriority
    }
    return new span_1.Span(
      this.honey.newEvent(),
      this.tracerOptions,
      name,
      traceId,
      parentId,
      tags,
    )
  }
}
exports.Tracer = Tracer
