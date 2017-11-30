module.exports = class HttpTransferCommands {
  constructor({ restClient }) {
    if (!restClient) throw new Error("No restClient")
    this._restClient = restClient
  }

  async transfer(fromAccountNumber, toAccountNumber, amount) {
    await this._restClient.post('/transfers', { fromAccountNumber, toAccountNumber, amount })
  }
}