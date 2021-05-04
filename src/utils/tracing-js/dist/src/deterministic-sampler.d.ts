import {SamplerBase} from './shared'
export declare class DeterministicSampler implements SamplerBase {
  private rate
  private upperBound
  /**
   * Determinisically sample a trace based on the trace id.
   * Each service will share the same trace id so this works
   * across multiple services/spans that are part of the same trace.
   * @param sampleRate Defaults to 1 (100%). Set to 2 for 50%, 4 for 25%, etc.
   */
  constructor(sampleRate: string | number | undefined)
  sample(traceId: string): boolean
  getRate(): number
}
