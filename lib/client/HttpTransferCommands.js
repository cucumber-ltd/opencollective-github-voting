module.exports = class HttpTransferCommands {
  constructor(restClient) {
    this._restClient = restClient
  }

  async transfer(fromAccountNumber, toAccountNumber, amount) {
    await this._restClient.post('/transfers', { fromAccountNumber, toAccountNumber, amount })
  }
}