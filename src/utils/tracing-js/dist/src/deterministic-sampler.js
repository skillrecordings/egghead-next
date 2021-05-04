'use strict'
Object.defineProperty(exports, '__esModule', {value: true})
// TODO: add browser support with Web Crypto
// https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
const crypto_1 = require('crypto')
const MAX_UINT32 = Math.pow(2, 32) - 1
class DeterministicSampler {
  /**
   * Determinisically sample a trace based on the trace id.
   * Each service will share the same trace id so this works
   * across multiple services/spans that are part of the same trace.
   * @param sampleRate Defaults to 1 (100%). Set to 2 for 50%, 4 for 25%, etc.
   */
  constructor(sampleRate) {
    let rate
    if (typeof sampleRate === 'number') {
      rate = sampleRate
    } else if (typeof sampleRate === 'string') {
      rate = Number.parseInt(sampleRate)
    } else {
      rate = 1
    }
    this.upperBound = (MAX_UINT32 / rate) >>> 0
    this.rate = rate
  }
  sample(traceId) {
    const sum = crypto_1.createHash('SHA1').update(traceId).digest()
    return sum.readUInt32BE(0) <= this.upperBound
  }
  getRate() {
    return this.rate
  }
}
exports.DeterministicSampler = DeterministicSampler
