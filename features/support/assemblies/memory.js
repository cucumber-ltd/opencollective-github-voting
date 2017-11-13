const Assembly = require('../../../lib/domain/Assembly')
const MemoryEventStore = require('../../../lib/infrastructure/eventstore/MemoryEventStore')

module.exports = class MemoryAssembly extends Assembly {
  makeEventStore() {
    return new MemoryEventStore()
  }
}