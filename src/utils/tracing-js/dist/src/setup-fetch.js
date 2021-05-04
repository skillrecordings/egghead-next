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
const Tags = __importStar(require('./tags'))
const Hdrs = __importStar(require('./headers'))
const node_fetch_1 = require('node-fetch')
function setupFetchTracing(options) {
  const {fetch, spanContext} = options
  let fetchOriginal
  if (fetch) {
    fetchOriginal = fetch
  } else {
    fetchOriginal = require('node-fetch')
  }
  const fetchTracing = (url, opts) => {
    if (!opts) {
      opts = {headers: new node_fetch_1.Headers()}
    }
    const headers = new node_fetch_1.Headers(opts.headers)
    opts.headers = headers
    const traceId = spanContext.toTraceId()
    const parentId = spanContext.toSpanId()
    const priority = spanContext.getTag(Tags.SAMPLING_PRIORITY)
    headers.set(Hdrs.TRACE_ID, traceId)
    if (typeof parentId !== 'undefined') {
      headers.set(Hdrs.PARENT_ID, parentId)
    }
    if (typeof priority !== 'undefined') {
      headers.set(Hdrs.PRIORITY, priority)
    }
    return fetchOriginal(url, opts)
  }
  // TS doesn't know about decorated runtime data
  // so we copy from the original just to be safe.
  for (const key of Object.keys(fetchOriginal)) {
    const tracing = fetchTracing
    const original = fetchOriginal
    tracing[key] = original[key]
  }
  fetchTracing.default = fetchTracing
  return fetchTracing
}
exports.setupFetchTracing = setupFetchTracing
