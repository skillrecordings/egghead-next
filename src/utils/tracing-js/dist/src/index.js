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
const tracer_1 = require('./tracer')
exports.Tracer = tracer_1.Tracer
const span_context_1 = require('./span-context')
exports.SpanContext = span_context_1.SpanContext
const Tags = __importStar(require('./tags'))
exports.Tags = Tags
const deterministic_sampler_1 = require('./deterministic-sampler')
exports.DeterministicSampler = deterministic_sampler_1.DeterministicSampler
const setup_http_1 = require('./setup-http')
exports.setupHttpTracing = setup_http_1.setupHttpTracing
const setup_fetch_1 = require('./setup-fetch')
exports.setupFetchTracing = setup_fetch_1.setupFetchTracing
