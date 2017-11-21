const EventSourcePubSub = require('../cqrs-lite/rest/EventSourcePubSub')

module.exports = class HttpAccountQueries {
  constructor(restClient) {
    this._restClient = restClient
    this._pubSub = new EventSourcePubSub(this._restClient)
  }

  async stop() {
    return this._pubSub.stop()
  }

  async subscribe(accountNumber, subscriber) {
    return this._pubSub.subscribe(accountNumber, subscriber)
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