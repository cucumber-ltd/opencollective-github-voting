const fetch = require('node-fetch')
const EventSource = require('eventsource')
const RestClient = require('../../../lib/cqrs-lite/rest/RestClient')
const HttpTransferCommands = require('../../../lib/client/HttpTransferCommands')
const HttpAccountQueries = require('../../../lib/client/HttpAccountQueries')
const TestAssembly = require('./TestAssembly')

module.exports = class HttpAssembly extends TestAssembly {
  async start() {
    await super.start()
    const port = await this.webApp.listen(0)
    const baseUrl = `http://localhost:${port}`
    const restClient = new RestClient(baseUrl, fetch, EventSource)

    this._httpTransferCommands = new HttpTransferCommands(restClient)
    this._httpAccountQueries = new HttpAccountQueries(restClient)
  }

  async stop() {
    await this.webApp.stop()
    await super.stop()
  }

  get actionTransferCommands() {
    return this._httpTransferCommands
  }

  get outcomeAccountQueries() {
    return this._httpAccountQueries
  }
}