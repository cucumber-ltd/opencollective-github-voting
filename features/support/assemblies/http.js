const fetch = require('node-fetch')
const TestAssembly = require('./TestAssembly')
const HttpTransferCommands = require('../../../lib/client/HttpTransferCommands')
const HttpAccountStore = require('../../../lib/client/HttpAccountStore')

module.exports = class HttpAssembly extends TestAssembly {
  async start() {
    await super.start()
    const port = await this.webApp.listen(0)
    const baseUrl = `http://localhost:${port}`
    this._httpTransferCommands = new HttpTransferCommands(baseUrl, fetch)
    this._httpAccountStore = new HttpAccountStore(baseUrl, fetch)
  }

  async stop() {
    await this.webApp.stop()
    await super.stop()
  }

  get actionTransferCommands() {
    return this._httpTransferCommands
  }

  get outcomeAccountStore() {
    return this._httpAccountStore
  }
}