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

    this.accountQueries = accountQueries
    this.accountCommands = accountCommands
    this.transferCommands = transferCommands
    this.webApp = webApp
    this.webServer = webServer
  }

  async start() {
  }

  async stop() {
  }
}