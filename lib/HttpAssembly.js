const EventSourceSub = require('./infrastructure/pubsub/EventSourceSub')
const HttpBankQueries = require('./bank-queries/HttpBankQueries')
const HttpTransferCommands = require('./transfer/HttpTransferCommands')

module.exports = class HttpAssembly {
  constructor({ restClient }) {
    if (!restClient) throw new Error("No restClient")
    this.bankQueries = new HttpBankQueries({ restClient })
    this.transferCommands = new HttpTransferCommands({ restClient })
    this.sub = new EventSourceSub({ restClient })
  }

  async start() {
    await this.sub.start()
  }

  async stop() {
    await this.sub.stop()
  }

  async actor(name) {
    return this
  }
}
