const CommandBus = require('../infrastructure/CommandBus')
const Repository = require('../infrastructure/Repository')

module.exports = class Assembly {
  async start() {
    this.eventStore = this.makeEventStore()
    this.repository = new Repository(this.eventStore)
    this.commandBus = new CommandBus(this.repository)
  }

  async stop() {
  }

  makeEventStore() {
    throw new Error('override makeEventStore')
  }
}