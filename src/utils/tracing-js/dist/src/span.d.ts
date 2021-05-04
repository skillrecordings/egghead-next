/// <reference types="../types/libhoney" />
import {HoneyEvent} from 'libhoney'
import {SpanContext} from './span-context'
import {SpanTags, TracerOptions} from './shared'
export declare class Span {
  private spanId
  private event
  private tracerOptions
  private name
  private traceId
  private parentId
  private tags
  private start
  private duration
  constructor(
    event: HoneyEvent,
    tracerOptions: TracerOptions,
    name: string,
    traceId: string | undefined,
    parentId: string | undefined,
    tags: SpanTags,
  )
  context(): SpanContext
  addTags(tags: SpanTags): this
  setTag(key: string, value: any): this
  setOperationName(name: string): void
  private isSendable
  private getRate
  finish(): void
}
