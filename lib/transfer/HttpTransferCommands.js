module.exports = class HttpTransferCommands {
  constructor({ restClient }) {
    if (!restClient) throw new Error("No restClient")
    this._restClient = restClient
  }

  async transfer({ fromAccountId, toAccountId, amount }) {
    await this._restClient.post('/transfers', { fromAccountId, toAccountId, amount })
  }
}