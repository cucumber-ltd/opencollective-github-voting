module.exports = class HttpAccountQueries {
  constructor(restClient, sigSub) {
    if(!sigSub) throw new Error("No sigSub")
    this._restClient = restClient
    this._sigSub = sigSub
  }

  // TODO: Can we get rid of this and subscribe directly to sigSub?
  async subscribe(subscriptionKey, subscriber) {
    return this._sigSub.subscribe(subscriptionKey, subscriber)
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