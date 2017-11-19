const MemoryEventStore = require('./cqrs-lite/eventstore/MemoryEventStore')
const buildCommandBus = require('./cqrs-lite/buildCommandBus')
const AccountProjection = require('./read/AccountProjection')
const AccountStore = require('./read/AccountStore')
const VotingPort = require('./VotingPort')
const WebApp = require('./server/WebApp')

module.exports = class AppAssembly {
  constructor() {
    // Assemble application

    const eventStore = new MemoryEventStore()
    const accountStore = new AccountStore()
    const accountProjection = new AccountProjection(accountStore)
    const commandBus = buildCommandBus(eventStore, [
      accountProjection
    ])
    const votingPort = new VotingPort({ commandBus, accountStore })
    const webApp = new WebApp({ votingPort, accountStore })

    // Expose ports

    this._accountStore = accountStore
    this._votingPort = votingPort

    // Expose adapters

    this._webApp = webApp
  }

  get votingPort() {
    return this._votingPort
  }

  get accountStore() {
    return this._accountStore
  }

  get webApp() {
    return this._webApp
  }

  async start() {
  }

  async stop() {
  }
}