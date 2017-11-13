const Assembly = require('../../../lib/Assembly')
const MemoryEventStore = require('../../../lib/infrastructure/eventstore/MemoryEventStore')

module.exports = class MemoryAssembly extends Assembly {
  async start() {
    await super.start()
  }

  makeEventStore() {
    return new MemoryEventStore()
  }
}