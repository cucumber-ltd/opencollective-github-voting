const fetch = require('node-fetch')
const EventSource = require('eventsource')
const EventSourcePubSub = require('../../../lib/cqrs-lite/pubsub/EventSourcePubSub')
const RestClient = require('../../../lib/cqrs-lite/rest/RestClient')
const HttpUserCommands = require('../../../lib/client/HttpUserCommands')
const HttpTransferCommands = require('../../../lib/client/HttpTransferCommands')
const HttpAccountQueries = require('../../../lib/client/HttpAccountQueries')
const TestAssembly = require('./TestAssembly')

module.exports = class HttpAssembly extends TestAssembly {
  async start() {
    await super.start()
    const port = await this.webServer.listen(0)
    const baseUrl = `http://localhost:${port}`
    const restClient = new RestClient(baseUrl, fetch, EventSource)

    const eventSourcePubSub = new EventSourcePubSub(restClient)
    await eventSourcePubSub.start()
    // TODO: Use ClientAssembly
    // This is another argument we should use Assembly delegation, not inheritance

    this._httpUserCommands = new HttpUserCommands(restClient)
    this._httpTransferCommands = new HttpTransferCommands(restClient)
    this._httpAccountQueries = new HttpAccountQueries(restClient, eventSourcePubSub)
  }

  async stop() {
    await this.webServer.stop()
    await super.stop()
  }

  get actionUserCommands() {
    return this._httpUserCommands
  }

  get actionTransferCommands() {
    return this._httpTransferCommands
  }

  get outcomeAccountQueries() {
    return this._httpAccountQueries
  }

  get contextPubSub() {
    return this.pubSub
  }
}