const EventSourceSub = require('../cqrs-lite/pubsub/EventSourceSub')
const HttpAccountQueries = require('./HttpAccountQueries')
const HttpTransferCommands = require('./HttpTransferCommands')
const HttpUserCommands = require('./HttpUserCommands')

module.exports = class HttpAssembly {
  constructor({ restClient }) {
    if (!restClient) throw new Error("No restClient")
    this.accountQueries = new HttpAccountQueries({ restClient })
    this.transferCommands = new HttpTransferCommands({ restClient })
    this.userCommands = new HttpUserCommands({ restClient })
    // TODO: Needed???
    this.sub = new EventSourceSub({ restClient })
  }

  async start() {
    await this.sub.start()
  }

  async stop() {
    await this.sub.stop()
  }
}
