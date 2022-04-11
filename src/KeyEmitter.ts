import { createNanoEvents, Emitter, Unsubscribe } from "nanoevents";

interface Events {
  [key: string]: (count: number) => void
}

export interface OnConfig {
  since: number
}

export type KeyEmitterArgs = { baseTime?: number }

export default class KeyEmitter {
  private emitter: Emitter<Events> = createNanoEvents();
  private state: Map<string, number> = new Map<string, number>();
  private readonly baseTime = Date.now()

  constructor({ baseTime }: KeyEmitterArgs = {}) {
    if (baseTime) {
      this.baseTime = baseTime;
    }
  }

  emit = (key: string) => {
    const time = Date.now()
    this.state.set(key, time)
    this.emitter.emit(key, time)
  };

  on = (key: string, callback: (time: number) => void, config: OnConfig = { since: 0 }): Unsubscribe => {
    const unbind = this.emitter.on(key, callback)
    const pastDate = this.state.get(key)
    if (config.since && pastDate && pastDate >= config.since) {
      try {
        callback(pastDate)
      } catch (e) {
        // do nothing
      }
    }
    return unbind
  };

  onSinceStart = (key: string, callback: (time: number) => void): Unsubscribe => {
    return this.on(key, callback, { since: this.baseTime })
  };
}
