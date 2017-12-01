module.exports = class HttpAccountQueries {
  constructor({ restClient, sub }) {
    if (!restClient) throw new Error("No restClient")
    // TODO: remove
    if (sub) throw new Error("No sub expected")
    this._restClient = restClient
    this._sub = sub
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