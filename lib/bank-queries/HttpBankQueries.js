module.exports = class HttpAccountQueries {
  constructor({ restClient }) {
    if (!restClient) throw new Error("No restClient")
    this._restClient = restClient
  }

  async getAccount(id) {
    const url = `/accounts/${encodeURIComponent(id)}`
    return this._restClient.get(url)
  }

  async getAccountHolder(id) {
    const url = `/account-holders/${encodeURIComponent(id)}`
    return this._restClient.get(url)
  }

  async getAccountHolders() {
    const url = `/account-holders`
    return this._restClient.get(url)
  }
}