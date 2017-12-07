const PubSub = require('./PubSub')

module.exports = class EventSourceSub {
  constructor({ restClient }) {
    if (!restClient) throw new Error("No restClient")
    this._restClient = restClient
    this._pubSub = new PubSub(true)
  }

  async start() {
    return new Promise(resolve => {
      const eventSource = this._restClient.newEventSource('/pubsub')
      eventSource.onerror = e => {
        console.log('EventSource error', e)
        this._connectionId = null
      }
      eventSource.addEventListener('pubsub-signal', e => {
        const signal = JSON.parse(e.data)
        this._pubSub.publish(signal)
          .catch(err => console.error('Signalling failed', err))
      })
      this._eventSource = eventSource

      this._eventSource.addEventListener('pubsub-connectionId', e => {
        this._connectionId = e.data
        resolve()

        // This event handler will be called again on reconnect, so we need
        // to resubscribe in that case
        this._resubscribe()
          .catch(err => console.error('Resubscribe failed', err))
      })
    })
  }

  async stop() {
    this._eventSource.close()
  }

  async subscribe(signal, signalFunction) {
    const subscription = await this._pubSub.subscribe(signal, signalFunction)
    await this._postSubscription(signal)
    return subscription
  }

  async _resubscribe() {
    for (const signal of this._pubSub.getSubscribedSignals()) {
      await this._postSubscription(signal)
    }
  }

  async _postSubscription(signal) {
    if (!this._connectionId) throw new Error(`Can't subscribe before start()`)
    const path = `/pubsub/${encodeURIComponent(this._connectionId)}`
    await this._restClient.post(path, signal)
  }
}

