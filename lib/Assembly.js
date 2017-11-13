const CommandBus = require('./infrastructure/CommandBus')
const Repository = require('./infrastructure/Repository')
const EventDispatcher = require('./infrastructure/EventDispatcher')
const DispatchingEventStore = require('./infrastructure/eventstore/DispatchingEventStore')
const UserProjection = require('./read/UserProjection')
const VotingPort = require('./VotingPort')

module.exports = class Assembly {
  async start() {
    this.eventStore = this.makeEventStore()
    const projections = [
      new UserProjection()
    ]
    const projectionDispatchers = projections.map(projection => new EventDispatcher(projection))
    const dispatchingEventStore = new DispatchingEventStore(this.eventStore, projectionDispatchers)

    this.repository = new Repository(dispatchingEventStore)
    this.commandBus = new CommandBus(this.repository)

    this.votingPort = new VotingPort(this.eventStore, this.repository, this.commandBus)
  }

  async stop() {
  }

  makeEventStore() {
    throw new Error('override makeEventStore')
  }
}