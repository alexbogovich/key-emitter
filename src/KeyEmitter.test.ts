import { describe, expect, it,  } from 'vitest'
import KeyEmitter from "./KeyEmitter";

const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

describe('Key emitter', () => {
  it('on one event for one key', () => {
    const emitter = new KeyEmitter()
    let count = 0
    emitter.on('event_key_1', () => {
      count++
    })

    emitter.emit('event_key_1')
    expect(count).eq(1)
  })

  it('callback is not called after unbind', () => {
    const emitter = new KeyEmitter()
    let count = 0
    const unbind = emitter.on('event_key_1', () => {
      count++
    })

    emitter.emit('event_key_1')
    expect(count).eq(1)

    unbind()
    emitter.emit('event_key_1')
    emitter.emit('event_key_1')
    emitter.emit('event_key_1')

    // counter should not change
    expect(count).eq(1)
  })

  it('on multiple events for one key', () => {
    const emitter = new KeyEmitter()
    let count = 0
    emitter.emit('event_key_1')

    emitter.on('event_key_1', () => {
      count++
    })

    emitter.emit('event_key_1')
    emitter.emit('event_key_1')
    emitter.emit('event_key_1')
    emitter.emit('event_key_1')
    expect(count).eq(4)
  })

  it('on multiple events for many key', () => {
    const emitter = new KeyEmitter()
    let event1Count = 0
    let event2Count = 0

    emitter.on('event_key_1', () => {
      event1Count++
    })
    emitter.on('event_key_2', () => {
      event2Count++
    })

    emitter.emit('event_key_1')
    emitter.emit('event_key_2')
    emitter.emit('event_key_1')
    expect(event2Count).eq(1)
    expect(event1Count).eq(2)
  })

  it('on onSinceStart event for one key', () => {
    const emitter = new KeyEmitter()
    let count = 0

    // fire event prior to start
    emitter.emit('event_key_1')
    emitter.emit('event_key_1')

    emitter.onSinceStart('event_key_1', () => {
      count++
    })

    // onSinceStart event should be called only once after start
    expect(count).eq(1)

    emitter.emit('event_key_1')
    expect(count).eq(2)
  })

  it('on onSinceStart event for many key', () => {
    const emitter = new KeyEmitter()
    let count1 = 0
    let count2 = 0

    // fire event prior to start only for event_key_1
    emitter.emit('event_key_1')

    emitter.onSinceStart('event_key_1', () => {
      count1++
    })
    emitter.onSinceStart('event_key_2', () => {
      count2++
    })

    // onSinceStart event should be called only once after start
    expect(count1).eq(1)
    expect(count2).eq(0)

    emitter.emit('event_key_1')
    emitter.emit('event_key_2')

    expect(count1).eq(2)
    expect(count2).eq(1)
  })

  it('call back can be async function', async () => {
    expect.hasAssertions()
    expect.assertions(5)
    const emitter = new KeyEmitter()
    let counter = 0
    emitter.on('event_key_1', async (ts) => {
      await sleep(100);
      expect(ts).toBeTruthy()
      counter++
    })

    emitter.emit('event_key_1')
    emitter.emit('event_key_1')
    emitter.emit('event_key_1')
    emitter.emit('event_key_1')

    await sleep(200);
    expect(counter).eq(4)
  })
})

