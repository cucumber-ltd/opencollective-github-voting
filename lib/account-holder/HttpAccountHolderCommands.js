module.exports = class HttpUserCommands {
  constructor({ restClient }) {
    if (!restClient) throw new Error("No restClient")
    this._restClient = restClient
  }

  async createUser(username) {
    await this._restClient.post('/users', { username })
  }
}