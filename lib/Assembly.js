const MemoryEventStore = require('./cqrs-lite/eventstore/MemoryEventStore')
const buildCommandBus = require('./cqrs-lite/buildCommandBus')
const AccountProjector = require('./read/AccountProjector')
const VotingPort = require('./VotingPort')

module.exports = class Assembly {
  async start() {
    const eventStore = new MemoryEventStore()
    const accountProjector = new AccountProjector()
    const commandBus = buildCommandBus(eventStore, [
      accountProjector
    ])

    this._votingPort = new VotingPort(commandBus, accountProjector)
  }

  async stop() {
  }
}