declare module 'libhoney' {
  export default class Libhoney {
    constructor(options: HoneyOptions)
    newEvent(): HoneyEvent
  }

  export interface HoneyOptions {
    /**
     * Write key for your Honeycomb team
     */
    writeKey: string
    /**
     * Name of the dataset that should contain this event. The dataset will be created for your team if it doesn't already exist.
     */
    dataset: string
    /**
     * (Default 1) Sample rate of data. If set, causes us to send 1/sampleRate of events and drop the rest.
     */
    sampleRate?: number
    /**
     * (Default 50) We send a batch to the API when this many outstanding events exist in our event queue.
     */
    batchSizeTrigger?: number
    /**
     * (Default 100) We send a batch to the API after this many milliseconds have passed.
     */
    batchTimeTrigger?: number
    /**
     * (Default 10) We process batches concurrently to increase parallelism while sending.
     */
    maxConcurrentBatches?: number
    /**
     * (Default 10000) The maximum number of pending events we allow to accumulate in our sending queue before dropping them.
     */
    pendingWorkCapacity?: number
    /**
     * (Default 1000) The maximum number of responses we enqueue before dropping them.
     */
    maxResponseQueueSize?: number
    /**
     * Disable transmission of events to the specified `apiHost`, particularly useful for testing or development.
     */
    disabled?: boolean
    /**
     * (Default "https://api.honeycomb.io/") Server host to receive Honeycomb events (Defaults to https://api.honeycomb.io).
     */
    apiHost?: string
  }

  export interface HoneyEvent {
    timestamp?: Date
    addField: (key: string, value: any) => void
    send: () => void
  }
}
