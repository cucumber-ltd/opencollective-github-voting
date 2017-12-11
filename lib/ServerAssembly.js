const MemoryEventStore = require('./infrastructure/cqrs/eventstore/MemoryEventStore')
const PubSub = require('./infrastructure/pubsub/PubSub')
const buildCommandBus = require('./infrastructure/cqrs/buildCommandBus')
const WebServer = require('./infrastructure/express-extensions/WebServer')
const BankProjector = require('./bank-queries/BankProjector')
const BankStore = require('./bank-queries/BankStore')
const AccountHolderCommands = require('./account-holder/AccountHolderCommands')
const AccountCommands = require('./account/AccountCommands')
const TransferCommands = require('./transfer/TransferCommands')
const CommitsImporter = require('./commits/CommitDaysUpdater')
const OpenCollectiveImporter = require('./batch/OpenCollectiveImporter')
const makeWebApp = require('./makeWebApp')

module.exports = class ServerAssembly {
  constructor({ autoflush, commitsProvider }) {
    const eventStore = new MemoryEventStore()
    const pubSub = new PubSub(autoflush)
    const pub = pubSub
    const sub = pubSub
    const bankStore = new BankStore({ pub })
    const commandBus = buildCommandBus(eventStore, [
      new BankProjector({ bankStore })
    ])
    const bankQueries = bankStore.getQueries()
    const accountCommands = new AccountCommands({ commandBus, bankQueries })
    const accountHolderCommands = new AccountHolderCommands({ commandBus, accountCommands })
    const transferCommands = new TransferCommands({ commandBus })
    const openCollectiveImporter = new OpenCollectiveImporter({ accountCommands })
    const commitsImporter = new CommitsImporter({ commitsProvider, bankQueries, accountCommands })
    const webApp = makeWebApp({ sub, accountHolderCommands, transferCommands, bankQueries })
    const webServer = new WebServer(webApp)

    this.pub = pub
    this.sub = sub
    this.commitsProvider = commitsProvider
    this.bankQueries = bankQueries
    this.accountHolderCommands = accountHolderCommands
    this.accountCommands = accountCommands
    this.openCollectiveImporter = openCollectiveImporter
    this.commitsImporter = commitsImporter
    this.transferCommands = transferCommands
    this.webApp = webApp
    this.webServer = webServer
  }

  async actor(name) {
    return this
  }
}