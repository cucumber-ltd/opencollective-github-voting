const PubSub = require('./PubSub')

module.exports = class EventSourceSub {
  constructor({ restClient }) {
    if (!restClient) throw new Error("No restClient")
    this._restClient = restClient
    this._sub = new PubSub()
  }

  async start() {
    return new Promise(resolve => {
      const eventSource = this._restClient.newEventSource('/sigsub')
      eventSource.onerror = e => this._connectionId = null
      eventSource.addEventListener('sigsub-signal', e => {
        const subscriptionKey = JSON.parse(e.data)
        this._scheduleAndFlush(subscriptionKey)
          .catch(err => console.error('Signalling failed', err))
      })
      this._eventSource = eventSource

      this._eventSource.addEventListener('sigsub-connectionId', e => {
        this._connectionId = e.data
        resolve()

        // This event handler will be called again on reconnect, so we need
        // to resubscribe in that case
        this._resubscribe()
          .catch(err => {
            console.error('Resubscribe failed', err)
          })
      })
    })
  }

  async stop() {
    this._eventSource.close()
  }

  async subscribe(subscriptionKey, signalFunction) {
    const subscription = await this._sub.subscribe(subscriptionKey, signalFunction)
    await this._postSubscription(subscriptionKey)
    return subscription
  }

  async _resubscribe() {
    for (const subscriptionKey of this._sub.getSubscriptionKeys()) {
      await this._postSubscription(subscriptionKey)
    }
  }

  async _postSubscription(subscriptionKey) {
    if (!this._connectionId) throw new Error(`Can't subscribe before start()`)
    const path = `/sigsub/${encodeURIComponent(this._connectionId)}`
    await this._restClient.post(path, subscriptionKey)
  }

  async _scheduleAndFlush(subscriptionKey) {
    this._sub.scheduleSignal(subscriptionKey)
    await this._sub.flushScheduledSignals()
  }
}

