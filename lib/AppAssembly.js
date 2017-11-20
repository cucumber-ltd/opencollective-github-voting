const MemoryEventStore = require('./cqrs-lite/eventstore/MemoryEventStore')
const buildCommandBus = require('./cqrs-lite/buildCommandBus')
const AccountProjection = require('./read/AccountProjection')
const AccountQueries = require('./read/AccountQueries')
const AccountCommands = require('./AccountCommands')
const TransferCommands = require('./TransferCommands')
const WebApp = require('./server/WebApp')

module.exports = class AppAssembly {
  constructor() {
    const eventStore = new MemoryEventStore()
    const accountQueries = new AccountQueries()
    const accountProjection = new AccountProjection(accountQueries)
    const commandBus = buildCommandBus(eventStore, [
      accountProjection
    ])
    const accountCommands = new AccountCommands({ commandBus, accountQueries: accountQueries })
    const transferCommands = new TransferCommands({ commandBus, accountQueries: accountQueries })
    const webApp = new WebApp({ transferCommands, accountQueries: accountQueries })

    this._accountQueries = accountQueries
    this._accountCommands = accountCommands
    this._transferCommands = transferCommands
    this._webApp = webApp
  }

  get accountQueries() {
    return this._accountQueries
  }

  get accountCommands() {
    return this._accountCommands
  }

  get transferCommands() {
    return this._transferCommands
  }

  get webApp() {
    return this._webApp
  }

  async start() {
  }

  async stop() {
  }
}