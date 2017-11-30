module.exports = class HttpUserCommands {
  constructor(restClient) {
    this._restClient = restClient
  }

  async createUser(username) {
    await this._restClient.post('/users', { username })
  }
}