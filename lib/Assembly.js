const CommandBus = require('./infrastructure/CommandBus')
const Repository = require('./infrastructure/Repository')
const EventDispatcher = require('./infrastructure/EventDispatcher')
const DispatchingEventStore = require('./infrastructure/eventstore/DispatchingEventStore')
const UserProjection = require('./read/UserProjection')
const VotingPort = require('./VotingPort')

module.exports = class Assembly {
  async start() {
    const eventStore = this.makeEventStore()
    const projections = [
      new UserProjection()
    ]
    const projectionDispatchers = projections.map(projection => new EventDispatcher(projection))
    const dispatchingEventStore = new DispatchingEventStore(eventStore, projectionDispatchers)

    const repository = new Repository(dispatchingEventStore)
    this.commandBus = new CommandBus(repository)

    this.votingPort = new VotingPort(eventStore, repository, this.commandBus)
  }

  async stop() {
  }

  makeEventStore() {
    throw new Error('override makeEventStore')
  }
}