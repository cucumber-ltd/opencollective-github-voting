const MemoryEventStore = require('./cqrs-lite/eventstore/MemoryEventStore')
const PubSub = require('./cqrs-lite/pubsub/PubSub')
const buildCommandBus = require('./cqrs-lite/buildCommandBus')
const WebServer = require('./cqrs-lite/express/WebServer')
const AccountProjector = require('./read/AccountProjector')
const AccountQueries = require('./read/AccountQueries')
const UserCommands = require('./UserCommands')
const AccountCommands = require('./AccountCommands')
const TransferCommands = require('./TransferCommands')
const OpenCollectiveImporter = require('./batch/OpenCollectiveImporter')
const makeWebApp = require('./server/makeWebApp')

module.exports = class ServerAssembly {
  constructor() {
    const eventStore = new MemoryEventStore()
    const pubSub = new PubSub()
    const pub = pubSub
    const sub = pubSub
    const accountQueries = new AccountQueries({ pub })
    const commandBus = buildCommandBus(eventStore, [
      new AccountProjector(accountQueries)
    ])
    const userCommands = new UserCommands({ commandBus, accountQueries })
    const accountCommands = new AccountCommands({ commandBus, accountQueries })
    const transferCommands = new TransferCommands({ commandBus, accountQueries })
    const openCollectiveImporter = new OpenCollectiveImporter({ accountCommands })
    const webApp = makeWebApp({ sub, userCommands, transferCommands, accountQueries })
    const webServer = new WebServer(webApp)

    this.sub = pubSub
    this.accountQueries = accountQueries
    this.userCommands = userCommands
    this.accountCommands = accountCommands
    this.openCollectiveImporter = openCollectiveImporter
    this.transferCommands = transferCommands
    this.webApp = webApp
    this.webServer = webServer
  }
}