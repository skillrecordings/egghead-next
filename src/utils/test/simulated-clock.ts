// Source: https://github.com/statelyai/xstate/blob/264679d1393095eca54209a790005b3cf48922c7/packages/core/src/SimulatedClock.ts
// Per XState Discord: https://discord.com/channels/795785288994652170/809564635614150686/898257435750461490

export interface Clock {
  setTimeout(fn: (...args: any[]) => void, timeout: number): any
  clearTimeout(id: any): void
}

export interface SimulatedClock extends Clock {
  start(speed: number): void
  increment(ms: number): void
  set(ms: number): void
}

interface SimulatedTimeout {
  start: number
  timeout: number
  fn: (...args: any[]) => void
}
export class SimulatedClock implements SimulatedClock {
  private timeouts: Map<number, SimulatedTimeout> = new Map()
  private _now: number = 0
  private _id: number = 0
  public now() {
    return this._now
  }
  private getId() {
    return this._id++
  }
  public setTimeout(fn: (...args: any[]) => void, timeout: number) {
    const id = this.getId()
    this.timeouts.set(id, {
      start: this.now(),
      timeout,
      fn,
    })
    return id
  }
  public clearTimeout(id: number) {
    this.timeouts.delete(id)
  }
  public set(time: number) {
    if (this._now > time) {
      throw new Error('Unable to travel back in time')
    }

    this._now = time
    this.flushTimeouts()
  }
  private flushTimeouts() {
    ;[...this.timeouts]
      .sort(([_idA, timeoutA], [_idB, timeoutB]) => {
        const endA = timeoutA.start + timeoutA.timeout
        const endB = timeoutB.start + timeoutB.timeout
        return endB > endA ? -1 : 1
      })
      .forEach(([id, timeout]) => {
        if (this.now() - timeout.start >= timeout.timeout) {
          this.timeouts.delete(id)
          timeout.fn.call(null)
        }
      })
  }
  public increment(ms: number): void {
    this._now += ms
    this.flushTimeouts()
  }
}
