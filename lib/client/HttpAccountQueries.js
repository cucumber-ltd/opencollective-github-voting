module.exports = class HttpAccountQueries {
  constructor(restClient, pubSub) {
    if(!pubSub) throw new Error("No pubSub")
    this._restClient = restClient
    this._pubSub = pubSub
  }

  // TODO: Can we get rid of this and subscribe directly to pubSub?
  async subscribe(subscriptionKey, subscriber) {
    return this._pubSub.subscribe(subscriptionKey, subscriber)
  }

  async getUser(username) {
    const url = `/users/${encodeURIComponent(username)}`
    return this._restClient.get(url)
  }

  async getAccount(accountNumber) {
    const url = `/accounts/${encodeURIComponent(accountNumber.number)}/${encodeURIComponent(accountNumber.currency)}`
    return this._restClient.get(url)
  }

  async getAccounts(currency) {
    const url = `/accounts/${encodeURIComponent(currency)}`
    return this._restClient.get(url)
  }
}