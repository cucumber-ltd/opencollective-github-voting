const MemoryEventStore = require('./cqrs-lite/eventstore/MemoryEventStore')
const buildCommandBus = require('./cqrs-lite/buildCommandBus')
const AccountProjection = require('./read/AccountProjection')
const VotingPort = require('./VotingPort')

module.exports = class Assembly {
  constructor() {
    const eventStore = new MemoryEventStore()
    this._accountSignals = this._makeAccountSignals()
    this._accountProjection = new AccountProjection(this._accountSignals)
    const commandBus = buildCommandBus(eventStore, [
      this._accountProjection
    ])

    this._votingPort = new VotingPort(commandBus, this._accountProjection)
  }

  async start() {
  }

  async stop() {
  }

  get votingPort() {
    return this._votingPort
  }

  get accountProjection() {
    return this._accountProjection
  }

  get accountSignals() {
    return this._accountSignals
  }

  _makeAccountSignals() {
    throw new Error('override _makeAccountSignals()')
  }
}