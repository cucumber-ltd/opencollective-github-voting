const MemoryEventStore = require('../../../lib/infrastructure/eventstore/MemoryEventStore')
const CommandBus = require('../../../lib/infrastructure/CommandBus')
const Repository = require('../../../lib/infrastructure/Repository')
const MemoryIssueStore = require('../../../lib/read/issue/MemoryIssueStore')
const MemoryUserStore = require('../../../lib/read/user/MemoryUserStore')

module.exports = class MemoryAssembly {
  async start () {
    this.eventStore = new MemoryEventStore()
    this.repository = new Repository(this.eventStore)
    this.commandBus = new CommandBus(this.repository)
    this.store = {
      issue: new MemoryIssueStore(),
      user: new MemoryUserStore()
    }
  }

  async stop() {}
}