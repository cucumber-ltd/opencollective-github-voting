const CommandBus = require('./CommandBus')
const Repository = require('./Repository')
const EventDispatcher = require('./EventDispatcher')
const DispatchingEventStore = require('./eventstore/DispatchingEventStore')

module.exports = function buildCommandBus(eventStore, projections) {
  const projectorEventDispatchers = projections.map(projection => new EventDispatcher(projection))
  const dispatchingEventStore = new DispatchingEventStore(eventStore, projectorEventDispatchers)
  const repository = new Repository(dispatchingEventStore)
  return new CommandBus(repository)
}