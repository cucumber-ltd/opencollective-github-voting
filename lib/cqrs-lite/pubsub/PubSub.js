const stringify = require('json-stable-stringify')

/**
 * A PubSub keeps track of signal subscribers for a particular key.
 * Signals can be scheduled for a key. These signal functions are invoked when signals
 * are flushed.
 *
 * @type {module.PubSub}
 */
module.exports = class PubSub {
  constructor() {
    this._subscriptionsByKey = new Map()
    this._pendingKeys = new Set()
  }

  async start() {
  }

  async stop() {
  }

  async subscribe(subscriptionKey, signalFunction) {
    const key = stringify(subscriptionKey)
    if (!this._subscriptionsByKey.has(key)) {
      this._subscriptionsByKey.set(key, new Set())
    }
    const subscriptions = this._subscriptionsByKey.get(key)
    const subscription = new Subscription(signalFunction)
    subscriptions.add(subscription)
    return subscription
  }

  getSubscriptionKeys() {
    return this._subscriptionsByKey.keys()
  }

  scheduleSignal(subscriptionKey) {
    const key = stringify(subscriptionKey)
    this._pendingKeys.add(key)
  }

  async flushScheduledSignals(keep) {
    for (const pendingKey of this._pendingKeys) {
      if (!keep) this._pendingKeys.delete(pendingKey)
      const subscripion = this._subscriptionsByKey.get(pendingKey) || new Set()
      for (const subscription of subscripion) {
        await subscription.invoke()
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
    await this._signalFunction()
    this._invocationCount++
    this._resolveInvocationCounters()
  }

  // TODO: Rename to received? Or even use a correlation id?
  delivered(count) {
    if (count <= this._invocationCount) {
      return Promise.resolve()
    }
    return new Promise(resolve => {
      this._invocationCountResolvers.add(new InvocationCountResolver(count, resolve))
    })
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