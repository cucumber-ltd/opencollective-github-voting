const Assembly = require('../../../lib/Assembly')
const MemoryEventStore = require('../../../lib/cqrs-lite/eventstore/MemoryEventStore')

module.exports = class MemoryAssembly extends Assembly {
  makeEventStore() {
    return new MemoryEventStore()
  }
}