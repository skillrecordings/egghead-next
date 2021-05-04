'use strict'
Object.defineProperty(exports, '__esModule', {value: true})
const span_context_1 = require('./span-context')
const generate_id_1 = require('./generate-id')
const tags_1 = require('./tags')
class Span {
  constructor(event, tracerOptions, name, traceId, parentId, tags) {
    this.spanId = generate_id_1.generateId()
    this.event = event
    this.tracerOptions = tracerOptions
    this.name = name
    this.traceId = traceId || generate_id_1.generateId()
    this.parentId = parentId
    this.tags = tags
    this.start = new Date()
  }
  context() {
    return new span_context_1.SpanContext(this.traceId, this.spanId, this.tags)
  }
  addTags(tags) {
    Object.keys(tags).forEach((key) => {
      this.tags[key] = tags[key]
    })
    return this
  }
  setTag(key, value) {
    this.tags[key] = value
    return this
  }
  setOperationName(name) {
    this.name = name
  }
  isSendable(sampler) {
    const priority = this.tags[tags_1.SAMPLING_PRIORITY]
    if (typeof priority === 'undefined') {
      return sampler.sample(this.traceId)
    }
    return priority > 0
  }
  getRate(sampler) {
    const priority = this.tags[tags_1.SAMPLING_PRIORITY]
    return priority > 0 ? 1 : sampler.getRate()
  }
  finish() {
    if (typeof this.duration !== 'undefined') {
      return
    }
    this.duration = Date.now() - this.start.getTime()
    const {
      serviceName,
      environment,
      dc,
      podName,
      nodeName,
      sampler,
    } = this.tracerOptions
    if (!sampler || !this.isSendable(sampler)) {
      return
    }
    this.event.addField('duration_ms', this.duration)
    this.event.addField('name', this.name)
    this.event.addField('service_name', serviceName)
    this.event.addField('environment', environment)
    this.event.addField('dc', dc)
    this.event.addField('pod_name', podName)
    this.event.addField('node_name', nodeName)
    this.event.addField('trace.trace_id', this.traceId)
    this.event.addField('trace.span_id', this.spanId)
    this.event.addField('trace.parent_id', this.parentId)
    this.event.addField('samplerate', this.getRate(sampler))
    for (const [key, value] of Object.entries(this.tags)) {
      this.event.addField('tag.' + key, value)
    }
    this.event.timestamp = this.start
    this.event.send()
  }
}
exports.Span = Span
