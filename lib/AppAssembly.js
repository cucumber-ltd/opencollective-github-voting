const MemoryEventStore = require('./cqrs-lite/eventstore/MemoryEventStore')
const buildCommandBus = require('./cqrs-lite/buildCommandBus')
const WebServer = require('./cqrs-lite/express/WebServer')
const AccountProjector = require('./read/AccountProjector')
const AccountQueries = require('./read/AccountQueries')
const AccountCommands = require('./AccountCommands')
const TransferCommands = require('./TransferCommands')
const OpenCollectiveImporter = require('./batch/OpenCollectiveImporter')
const BalanceUpdater = require('./batch/BalanceUpdater')
const makeWebApp = require('./server/makeWebApp')

module.exports = class AppAssembly {
  // Adapters for external services are injected with CDI
  constructor({ commitDaysBalanceProvider }) {
    if (!commitDaysBalanceProvider) throw new Error('Missing commitsBalanceProvider')

    // Domain logic
    const eventStore = new MemoryEventStore()
    const accountQueries = new AccountQueries()
    const accountProjector = new AccountProjector(accountQueries)
    const commandBus = buildCommandBus(eventStore, [
      accountProjector
    ])
    const accountCommands = new AccountCommands({ commandBus, accountQueries })
    const transferCommands = new TransferCommands({ commandBus, accountQueries })

    // HTTP Adapter
    const webApp = makeWebApp({ transferCommands, accountQueries })
    const webServer = new WebServer(webApp)

    // Batch import adapters
    const balanceUpdaters = new Map()
    balanceUpdaters.set('commit-days', new BalanceUpdater({
      accountCommands,
      balanceProvider: commitDaysBalanceProvider
    }))
    // TODO: Refactor
    const openCollectiveImporter = new OpenCollectiveImporter({ accountCommands })


    this.accountQueries = accountQueries
    this.accountCommands = accountCommands
    this.openCollectiveImporter = openCollectiveImporter
    this.transferCommands = transferCommands
    this.webApp = webApp
    this.webServer = webServer

    this.balanceUpdaters = balanceUpdaters
  }

  async start() {
  }

  async stop() {
  }
}