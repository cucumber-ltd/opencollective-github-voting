const MemoryEventStore = require('./cqrs-lite/eventstore/MemoryEventStore')
const buildCommandBus = require('./cqrs-lite/buildCommandBus')
const AccountProjection = require('./read/AccountProjection')
const VotingPort = require('./VotingPort')

module.exports = class Assembly {
  async start() {
    const eventStore = new MemoryEventStore()
    const accountProjection = new AccountProjection()
    const commandBus = buildCommandBus(eventStore, [
      accountProjection
    ])

    this._votingPort = new VotingPort(commandBus, accountProjection)
  }

  async stop() {
  }
}