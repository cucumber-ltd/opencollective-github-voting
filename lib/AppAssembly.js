const MemoryEventStore = require('./cqrs-lite/eventstore/MemoryEventStore')
const buildCommandBus = require('./cqrs-lite/buildCommandBus')
const WebServer = require('./cqrs-lite/express/WebServer')
const AccountProjection = require('./read/AccountProjection')
const AccountQueries = require('./read/AccountQueries')
const AccountCommands = require('./AccountCommands')
const TransferCommands = require('./TransferCommands')
const makeWebApp = require('./server/makeWebApp')

module.exports = class AppAssembly {
  constructor() {
    const eventStore = new MemoryEventStore()
    const accountQueries = new AccountQueries()
    const accountProjection = new AccountProjection(accountQueries)
    const commandBus = buildCommandBus(eventStore, [
      accountProjection
    ])
    const accountCommands = new AccountCommands({ commandBus, accountQueries })
    const transferCommands = new TransferCommands({ commandBus, accountQueries })
    const webApp = makeWebApp({ transferCommands, accountQueries })
    const webServer = new WebServer(webApp)

    this._accountQueries = accountQueries
    this._accountCommands = accountCommands
    this._transferCommands = transferCommands
    this._webServer = webServer
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

  get webServer() {
    return this._webServer
  }

  async start() {
  }

  async stop() {
  }
}