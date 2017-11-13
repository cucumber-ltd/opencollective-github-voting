const MemoryEventStore = require('../../../lib/infrastructure/eventstore/MemoryEventStore')
const CommandBus = require('../../../lib/infrastructure/CommandBus')
const Repository = require('../../../lib/infrastructure/Repository')

module.exports = class MemoryAssembly {
  async start() {
    this.eventStore = new MemoryEventStore()
    this.repository = new Repository(this.eventStore)
    this.commandBus = new CommandBus(this.repository)
  }

  async stop() {
  }
}