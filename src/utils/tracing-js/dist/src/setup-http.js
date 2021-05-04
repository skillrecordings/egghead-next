'use strict'
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod
    var result = {}
    if (mod != null)
      for (var k in mod)
        if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k]
    result['default'] = mod
    return result
  }
Object.defineProperty(exports, '__esModule', {value: true})
const span_context_1 = require('./span-context')
const Tags = __importStar(require('./tags'))
const Hdrs = __importStar(require('./headers'))
function setupHttpTracing(options) {
  const {name = 'setupHttpTracing', tracer, req, res} = options
  const spanOptions = getSpanOptions(req)
  const span = tracer.startSpan(name, spanOptions)
  const spanContext = span.context()
  res.on('finish', () => {
    const {statusCode = 200} = res
    span.setTag(Tags.HTTP_STATUS_CODE, statusCode)
    if (statusCode >= 400) {
      span.setTag(Tags.ERROR, true)
    }
    span.finish()
  })
  return spanContext
}
exports.setupHttpTracing = setupHttpTracing
function getFirstHeader(req, key) {
  const value = req.headers[key]
  return Array.isArray(value) ? value[0] : value
}
function getSpanOptions(req) {
  const tags = {}
  tags[Tags.HTTP_METHOD] = req.method
  tags[Tags.HTTP_URL] = req.url
  const priority = getFirstHeader(req, Hdrs.PRIORITY)
  if (typeof priority !== 'undefined') {
    tags[Tags.SAMPLING_PRIORITY] = Number.parseInt(priority)
  }
  let childOf
  const traceId = getFirstHeader(req, Hdrs.TRACE_ID)
  const parentId = getFirstHeader(req, Hdrs.PARENT_ID)
  if (traceId) {
    childOf = new span_context_1.SpanContext(traceId, parentId, tags)
  }
  return {tags, childOf}
}
