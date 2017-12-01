const fetch = require('node-fetch')
const EventSource = require('eventsource')
const HttpAssembly = require('../../../lib/HttpAssembly')
const RestClient = require('../../../lib/infrastructure/rest-client/RestClient')
const ServerAssembly = require('../../../lib/ServerAssembly')
const BaseTestAssembly = require('./BaseTestAssembly')

module.exports = class HttpTestAssembly extends BaseTestAssembly {
  constructor() {
    super()
    const restClient = new RestClient({ fetch, EventSource })
    const httpAssembly = new HttpAssembly({ restClient })
    this._contextAssembly = new ServerAssembly()
    this._actionAssembly = httpAssembly
    this._outcomeAssembly = httpAssembly
    this._restClient = restClient
  }

  async start() {
    const port = await this._contextAssembly.webServer.listen({ port: 0 })
    const baseUrl = `http://localhost:${port}`
    await this._restClient.start({ baseUrl })
    await this._actionAssembly.start()
  }

  async stop() {
    await this._restClient.stop()
    await this._contextAssembly.webServer.stop()
  }
}