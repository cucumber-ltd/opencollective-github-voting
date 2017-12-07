const fetch = require('node-fetch')
const EventSource = require('eventsource')
const HttpAssembly = require('../../../lib/HttpAssembly')
const RestClient = require('../../../lib/infrastructure/rest-client/RestClient')
const ServerAssembly = require('../../../lib/ServerAssembly')
const BaseTestAssembly = require('./BaseTestAssembly')

module.exports = class HttpTestAssembly extends BaseTestAssembly {
  constructor() {
    super()
    this.context = new ServerAssembly()
    this._actors = []
  }

  async actor(accountHolder) {
    const restClient = new RestClient({ baseUrl: this._baseUrl, fetch, EventSource })
    const httpAssembly = new HttpAssembly({ restClient })
    await httpAssembly.start()
    this._actors.push(httpAssembly)
    return httpAssembly
  }

  async start() {
    const port = await this.context.webServer.listen({ port: 0 })
    this._baseUrl = `http://localhost:${port}`
  }

  async stop() {
    for(const actor of this._actors) {
      await actor.stop()
    }
    await this.context.webServer.stop()
  }
}