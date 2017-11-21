const MemoryEventStore = require('./cqrs-lite/eventstore/MemoryEventStore')
const buildCommandBus = require('./cqrs-lite/buildCommandBus')
const WebServer = require('./cqrs-lite/express/WebServer')
const AccountProjector = require('./read/AccountProjector')
const AccountQueries = require('./read/AccountQueries')
const AccountCommands = require('./AccountCommands')
const TransferCommands = require('./TransferCommands')
const OpenCollectiveImporter = require('./batch/OpenCollectiveImporter')
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
    const openCollectiveImporter = new OpenCollectiveImporter({ accountCommands })
    const webApp = makeWebApp({ transferCommands, accountQueries })
    const webServer = new WebServer(webApp)

    this.accountQueries = accountQueries
    this.accountCommands = accountCommands
    this.openCollectiveImporter = openCollectiveImporter
    this.transferCommands = transferCommands
    this.webApp = webApp
    this.webServer = webServer
  }

  async start() {
  }

  async stop() {
  }
}