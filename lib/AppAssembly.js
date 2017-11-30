const MemoryEventStore = require('./cqrs-lite/eventstore/MemoryEventStore')
const SigSub = require('./cqrs-lite/sigsub/SigSub')
const buildCommandBus = require('./cqrs-lite/buildCommandBus')
const WebServer = require('./cqrs-lite/express/WebServer')
const AccountProjector = require('./read/AccountProjector')
const AccountQueries = require('./read/AccountQueries')
const UserCommands = require('./UserCommands')
const AccountCommands = require('./AccountCommands')
const TransferCommands = require('./TransferCommands')
const OpenCollectiveImporter = require('./batch/OpenCollectiveImporter')
const makeWebApp = require('./server/makeWebApp')

module.exports = class AppAssembly {
  constructor() {
    const eventStore = new MemoryEventStore()
    const sigSub = new SigSub()
    const accountQueries = new AccountQueries(sigSub)
    const commandBus = buildCommandBus(eventStore, [
      new AccountProjector(accountQueries)
    ])
    const userCommands = new UserCommands({ commandBus, accountQueries })
    const accountCommands = new AccountCommands({ commandBus, accountQueries })
    const transferCommands = new TransferCommands({ commandBus, accountQueries })
    const openCollectiveImporter = new OpenCollectiveImporter({ accountCommands })
    const webApp = makeWebApp({ sigSub, userCommands, transferCommands, accountQueries })
    const webServer = new WebServer(webApp)

    this.sigSub = sigSub
    this.accountQueries = accountQueries
    this.userCommands = userCommands
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