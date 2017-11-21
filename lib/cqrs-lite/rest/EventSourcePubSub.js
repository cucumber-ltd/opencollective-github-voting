const uuid = require('uuid/v4')

module.exports = class EventSourcePubSub {
  constructor(restClient) {
    this._restClient = restClient
    this._subscribersByTopic = new Map()
    this._subscriberBySubscriberId = new Map()

    const eventSource = this._restClient.newEventSource('/pubsub')
    eventSource.onerror = e => this._connectionId = null
    eventSource.addEventListener('connectionId', e => {
      this._connectionId = e.data
      this._resubscribe()
        .catch(err => console.error('Resubscribe failed', err))
    })
    eventSource.addEventListener('pubsub-notification', e => {
      const subscriberId = e.data
      this._notifySubscriber(subscriberId)
        .catch(err => console.error('Delivery failed', err))
    })
    this._eventSource = eventSource
  }

  async stop() {
    this._eventSource.close()
  }

  async subscribe(topic, subscriber) {
    if (!this._subscribersByTopic.has(topic))
      this._subscribersByTopic.set(topic, [])
    this._subscribersByTopic.get(topic).push(subscriber)

    if (this._connectionId) {
      return this._postSubscription(topic, subscriber)
    }
  }

  async _resubscribe() {
    for (const [topic, subscribers] of this._subscribersByTopic) {
      for (const subscriber of subscribers) {
        await this._postSubscription(topic, subscriber)
      }
    }
  }

  async _postSubscription(topic, subscriber) {
    const subscriberId = uuid()
    this._subscriberBySubscriberId.set(subscriberId, subscriber)
    const path = `/pubsub/${encodeURIComponent(this._connectionId)}/${encodeURIComponent(subscriberId)}`
    await this._restClient.post(path, topic)
  }

  async _notifySubscriber(subscriberId) {
    const subscriber = this._subscriberBySubscriberId.get(subscriberId)
    await subscriber()
  }
}

