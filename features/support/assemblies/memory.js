const MemoryEventStore = require('../../../lib/eventstore/MemoryEventStore')
const MemoryCommandBus = require('../../../lib/commandbus/MemoryCommandBus')
const MemoryIssueStore = require('../../../lib/read/issue/MemoryIssueStore')
const MemoryUserStore = require('../../../lib/read/user/MemoryUserStore')

module.exports = class MemoryAssembly {
  async start () {
    this.eventStore = new MemoryEventStore()
    this.commandBus = new MemoryCommandBus()
    this.store = {
      issue: new MemoryIssueStore(),
      user: new MemoryUserStore()
    }
  }

  async stop() {}
}