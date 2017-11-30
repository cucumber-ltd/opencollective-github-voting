const EventSourcePubSub = require('../cqrs-lite/pubsub/EventSourcePubSub')
const HttpAccountQueries = require('./HttpAccountQueries')
const HttpTransferCommands = require('./HttpTransferCommands')
const HttpUserCommands = require('./HttpUserCommands')

module.exports = class HttpAssembly {
  constructor({ restClient }) {
    if (!restClient) throw new Error("No restClient")
    this._eventSourcePubSub = new EventSourcePubSub({ restClient })

    this.accountQueries = new HttpAccountQueries({ restClient, pubSub: this._eventSourcePubSub })
    this.transferCommands = new HttpTransferCommands({ restClient })
    this.userCommands = new HttpUserCommands({ restClient })
  }

  async start() {
    await this._eventSourcePubSub.start()
  }

  async stop() {
    await this._eventSourcePubSub.stop()
  }
}
