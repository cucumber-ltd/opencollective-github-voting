const uuid = require('uuid/v4')

class EventSubscriber {
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
    eventSource.addEventListener('pubsub-message', e => {
      const { subscriberId, message } = JSON.parse(e.data)
      this._notify(subscriberId, message)
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

  async _notify(subscriberId) {
    const subscriber = this._subscriberBySubscriberId.get(subscriberId)
    await subscriber()
  }
}

module.exports = class HttpAccountQueries {
  constructor(restClient) {
    this._restClient = restClient
    this._eventSubscriber = new EventSubscriber(this._restClient)
  }

  async stop() {
    return this._eventSubscriber.stop()
  }

  async subscribe(accountNumber, subscriber) {
    return this._eventSubscriber.subscribe(accountNumber, subscriber)
  }

  async getAccount(accountNumber) {
    const url = `/accounts/${encodeURIComponent(accountNumber.owner)}/${encodeURIComponent(accountNumber.currency)}`
    return this._restClient.get(url)
  }

  async getAccounts(currency) {
    const url = `/accounts/${encodeURIComponent(currency)}`
    return this._restClient.get(url)
  }
}