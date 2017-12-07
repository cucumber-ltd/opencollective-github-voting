const debug = require('debug')('pubsub')

/**
 * A PubSub keeps track of signal subscribers for a particular key.
 * Signals can be scheduled for a key. These signal functions are invoked when signals
 * are flushed.
 *
 * @type {module.PubSub}
 */
module.exports = class PubSub {
  constructor() {
    this._scheduledSignalCounts = new Map()
    this._subscriptionsBySignal = new Map()
    this._awaitingScheduledResolvers = new Map()
  }

  async start() {
  }

  async stop() {
  }

  async subscribe(signal, signalFunction) {
    debug('subscribe(%o)', signal)
    if (!this._subscriptionsBySignal.has(signal)) {
      this._subscriptionsBySignal.set(signal, new Set())
    }
    const subscriptions = this._subscriptionsBySignal.get(signal)
    const subscription = new Subscription(signalFunction)
    subscriptions.add(subscription)
    return subscription
  }

  // TODO: Can we remove this?
  getSubscriptionKeys() {
    return this._subscriptionsBySignal.keys()
  }

  scheduleSignal(signal) {
    let scheduleCount = this._scheduledSignalCounts.get(signal) || 0
    this._scheduledSignalCounts.set(signal, ++scheduleCount)

    const resolves = this._awaitingScheduledResolvers.get(signal) || []
    for (const resolve of resolves) {
      resolve()
    }
    this._awaitingScheduledResolvers.delete(signal)
  }

  /**
   * Waits for {@param signal} to be scheduled
   * @param signal
   * @returns Promise<number> number of times the signal is scheduled
   */
  scheduled(signal) {
    const scheduleCount = this._scheduledSignalCounts.get(signal) || 0
    if (scheduleCount > 0) {
      return Promise.resolve()
    }
    return new Promise(resolve => {
      if (!this._awaitingScheduledResolvers.has(signal))
        this._awaitingScheduledResolvers.set(signal, [])
      this._awaitingScheduledResolvers.get(signal).push(resolve)
    })
  }

  async flushScheduledSignals() {
    for (const [signal, count] of this._scheduledSignalCounts) {
      this._scheduledSignalCounts.delete(signal)
      for (let n = 0; n < count; n++) {
        const subscriptions = this._subscriptionsBySignal.get(signal) || new Set()
        for (const subscription of subscriptions) {
          await subscription.invoke()
        }
      }
    }
  }
}

class Subscription {
  constructor(signalFunction) {
    this._signalFunction = signalFunction
    this._invocationCount = 0
    this._invocationCountResolvers = new Set()
  }

  async invoke() {
    if (this._signalFunction)
      await this._signalFunction()
    this._invocationCount++
    this._resolveInvocationCounters()
  }

  // TODO: Rename to received? Or even use a correlation id?
  delivered(count) {
    if (count <= this._invocationCount) {
      return Promise.resolve()
    }
    return new Promise(resolve => this._invocationCountResolvers.add(new InvocationCountResolver(count, resolve)))
  }

  _resolveInvocationCounters() {
    for (const invocationCountResolver of this._invocationCountResolvers) {
      if (invocationCountResolver.resolveMaybe(this._invocationCount)) {
        this._invocationCountResolvers.delete(invocationCountResolver)
      }
    }
  }
}

class InvocationCountResolver {
  constructor(count, resolve) {
    this._count = count
    this._resolve = resolve
  }

  resolveMaybe(invocationCount) {
    if (invocationCount >= this._count) {
      this._resolve()
      return true
    } else {
      return false
    }
  }
}