const MemoryEventStore = require('./cqrs-lite/eventstore/MemoryEventStore')
const buildCommandBus = require('./cqrs-lite/buildCommandBus')
const WebServer = require('./cqrs-lite/express/WebServer')
const AccountProjector = require('./read/AccountProjector')
const AccountQueries = require('./read/AccountQueries')
const AccountCommands = require('./AccountCommands')
const TransferCommands = require('./TransferCommands')
const OpenCollectiveCommands = require('./OpenCollectiveCommands')
const makeWebApp = require('./server/makeWebApp')

module.exports = class AppAssembly {
  constructor() {
    const eventStore = new MemoryEventStore()
    const accountQueries = new AccountQueries()
    const accountProjector = new AccountProjector(accountQueries)
    const commandBus = buildCommandBus(eventStore, [
      accountProjector
    ])
    const accountCommands = new AccountCommands({ commandBus, accountQueries })
    const transferCommands = new TransferCommands({ commandBus, accountQueries })
    const openCollectiveCommands = new OpenCollectiveCommands({ commandBus, accountQueries, accountCommands })
    const webApp = makeWebApp({ transferCommands, accountQueries })
    const webServer = new WebServer(webApp)

    this.accountQueries = accountQueries
    this.accountCommands = accountCommands
    this.openCollectiveCommands = openCollectiveCommands
    this.transferCommands = transferCommands
    this.webApp = webApp
    this.webServer = webServer
  }

  async start() {
  }

  async stop() {
  }
}